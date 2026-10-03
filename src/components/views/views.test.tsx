import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { EmptyState } from "./EmptyState";
import { Button } from "../ui/button";
import { ButtonGroup } from "./ButtonGroup";
import { SplitButton } from "./SplitButton";
import { LanguageSelector } from "./LanguageSelector";
import { Spinner, UserAvatar, ProgressIndicator, StatusBadge } from "./indicators";
import { ConfirmDialog } from "./ConfirmDialog";
import { Modal } from "./Modal";
import { AppHeader } from "./AppHeader";
import { LoginDialog } from "./LoginDialog";
import { PasswordResetDialog } from "./PasswordResetDialog";
import { NameDialog } from "./NameDialog";
import { useLoginForm } from "../../hooks/useLoginForm";
import { usePasswordResetForm } from "../../hooks/usePasswordResetForm";
import { useNameForm } from "../../hooks/useNameForm";
import { loginLabels } from "./auth.stories";
import type { AuthActions } from "../../hooks/useSupabaseAuth";

const messages = { passwordResetSent: "Reset sent", checkEmail: "Confirm your email" };
function login(overrides: Partial<AuthActions> = {}) {
  const actions: AuthActions = {
    signIn: vi.fn(async () => {}),
    signUp: vi.fn(async () => ({ needsConfirmation: true })),
    signInWithGitHub: vi.fn(async () => {}),
    requestPasswordReset: vi.fn(async () => {}),
    updatePassword: vi.fn(async () => {}),
    signOut: vi.fn(async () => {}),
    ...overrides,
  };
  const onClose = vi.fn();
  function Example({ isOpen = true }: { isOpen?: boolean }) {
    const form = useLoginForm({ isOpen, actions, onClose, messages });
    return <LoginDialog isOpen={isOpen} onClose={onClose} form={form} labels={loginLabels} />;
  }
  return { ...render(<Example />), actions, onClose, Example };
}
async function credentials() {
  await userEvent.type(screen.getByLabelText("Email"), "ada@example.com");
  await userEvent.type(screen.getByLabelText("Password"), "supersecret");
}

describe("copied presentation views", () => {
  it("renders empty-state content and delegates its action", async () => {
    const action = vi.fn();
    render(
      <EmptyState
        icon={<span>Icon</span>}
        title="Empty"
        description="Add something"
        action={<Button onClick={action}>Add</Button>}
      />
    );
    expect(screen.getByText("Empty")).toBeInTheDocument();
    await userEvent.click(screen.getByText("Add"));
    expect(action).toHaveBeenCalledOnce();
  });
  it("delegates filter toggles without changing controlled selection", async () => {
    const onToggle = vi.fn();
    render(
      <ButtonGroup
        label="Filters"
        items={[{ value: "one", label: "One", selected: true }]}
        onToggle={onToggle}
      />
    );
    await userEvent.click(screen.getByRole("button", { name: "One" }));
    expect(onToggle).toHaveBeenCalledWith("one");
    expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "true");
  });
  it("delegates split actions and prevents disabled menu selection", async () => {
    const primary = vi.fn(),
      secondary = vi.fn();
    render(
      <SplitButton
        label="Save"
        eventId="save"
        menuLabel="More"
        onClick={primary}
        items={[
          { label: "Copy", eventId: "copy", onSelect: secondary },
          { label: "Disabled", eventId: "disabled", onSelect: secondary, disabled: true },
        ]}
      />
    );
    await userEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(primary).toHaveBeenCalledOnce();
    await userEvent.click(screen.getByRole("button", { name: "More" }));
    expect(screen.getByRole("menuitem", { name: "Disabled" })).toHaveAttribute(
      "aria-disabled",
      "true"
    );
    await userEvent.click(screen.getByRole("menuitem", { name: "Copy" }));
    expect(secondary).toHaveBeenCalledOnce();
  });
  it("shows regional language selections and delegates changes", async () => {
    const change = vi.fn();
    render(
      <LanguageSelector
        value="en-US"
        onValueChange={change}
        label="Language"
        languages={[
          { code: "en", short: "EN", label: "English" },
          { code: "es", short: "ES", label: "Spanish" },
        ]}
      />
    );
    await userEvent.click(screen.getByRole("button", { name: "Language" }));
    expect(screen.getByRole("menuitemradio", { name: "English" })).toHaveAttribute(
      "aria-checked",
      "true"
    );
    await userEvent.click(screen.getByRole("menuitemradio", { name: "Spanish" }));
    expect(change).toHaveBeenCalledWith("es");
  });
  it("renders accessible loading, avatar fallbacks and badges", () => {
    render(
      <>
        <Spinner label="Loading" />
        <UserAvatar label="Ada" fallback="AL" />
        <StatusBadge positive>Published</StatusBadge>
      </>
    );
    expect(screen.getByRole("status")).toHaveAccessibleName("Loading");
    expect(screen.getByLabelText("Ada")).toHaveTextContent("AL");
    expect(screen.getByText("Published")).toHaveClass("bg-emerald-100");
  });
  it.each([0, 60, 100])("exposes exact progress %s", (value) => {
    render(<ProgressIndicator value={value} label="Progress" />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", String(value));
    expect(screen.getByRole("progressbar").firstElementChild).toHaveStyle({ width: `${value}%` });
  });
  it("supports bounded and indeterminate progress", () => {
    const { rerender } = render(<ProgressIndicator value={200} label="Progress" />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "100");
    rerender(<ProgressIndicator value={null} label="Progress" />);
    expect(screen.getByRole("progressbar")).not.toHaveAttribute("aria-valuenow");
  });
  it("delegates confirmation and cancellation", async () => {
    const confirm = vi.fn(),
      cancel = vi.fn();
    const { rerender } = render(
      <ConfirmDialog
        isOpen
        onConfirm={confirm}
        onCancel={cancel}
        title="Delete?"
        description="Cannot undo"
        confirmLabel="Delete"
        cancelLabel="Cancel"
      />
    );
    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(cancel).toHaveBeenCalledOnce();
    rerender(
      <ConfirmDialog
        isOpen
        onConfirm={confirm}
        onCancel={cancel}
        title="Delete?"
        description="Cannot undo"
        confirmLabel="Delete"
        cancelLabel="Cancel"
      />
    );
    await userEvent.click(screen.getByRole("button", { name: "Delete" }));
    expect(confirm).toHaveBeenCalledOnce();
  });
  it("supports modal content, footer, escape and host-controlled closing", async () => {
    const change = vi.fn();
    render(
      <Modal
        isOpen
        onOpenChange={change}
        title="Details"
        description="Description"
        closeLabel="Close"
        footer={<button>Accept</button>}
      >
        <p>Content</p>
      </Modal>
    );
    expect(screen.getByRole("dialog")).toHaveAccessibleName("Details");
    expect(screen.getByText("Content")).toBeInTheDocument();
    await userEvent.keyboard("{Escape}");
    expect(change).toHaveBeenCalledWith(false);
  });
  it("renders the header's host-provided branding and actions", () => {
    render(
      <AppHeader
        title="Planner"
        subtitle="Plan work"
        icon={<span>Logo</span>}
        actions={<Button>Login</Button>}
      />
    );
    expect(screen.getByRole("heading", { name: "Planner" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument();
  });
});

describe("authentication view and reusable form hooks", () => {
  it("signs in and closes only after success", async () => {
    const { actions, onClose } = login();
    await credentials();
    await userEvent.click(screen.getByTestId("login-submit"));
    expect(actions.signIn).toHaveBeenCalledWith("ada@example.com", "supersecret");
    await waitFor(() => expect(onClose).toHaveBeenCalledOnce());
  });
  it("surfaces API errors without closing", async () => {
    const { onClose } = login({
      signIn: async () => {
        throw new Error("Invalid credentials");
      },
    });
    await credentials();
    await userEvent.click(screen.getByTestId("login-submit"));
    expect(await screen.findByRole("alert")).toHaveTextContent("Invalid credentials");
    expect(onClose).not.toHaveBeenCalled();
  });
  it("shows signup confirmation and resets passwords when switching modes", async () => {
    const { actions, onClose } = login();
    await credentials();
    await userEvent.click(screen.getByText(loginLabels.switchToSignUp));
    expect(screen.getByLabelText("Password")).toHaveValue("");
    await userEvent.type(screen.getByLabelText("Password"), "supersecret");
    await userEvent.click(screen.getByTestId("login-submit"));
    expect(actions.signUp).toHaveBeenCalledWith("ada@example.com", "supersecret");
    expect(await screen.findByTestId("login-info")).toHaveTextContent(messages.checkEmail);
    expect(onClose).not.toHaveBeenCalled();
  });
  it("requests recovery without a password and can go back", async () => {
    const { actions } = login();
    await userEvent.click(screen.getByText(loginLabels.forgotPassword));
    expect(screen.queryByLabelText("Password")).not.toBeInTheDocument();
    await userEvent.type(screen.getByLabelText("Email"), "ada@example.com");
    await userEvent.click(screen.getByTestId("login-submit"));
    expect(actions.requestPasswordReset).toHaveBeenCalledWith("ada@example.com");
    expect(await screen.findByTestId("login-info")).toHaveTextContent(messages.passwordResetSent);
    await userEvent.click(screen.getByText(loginLabels.backToSignIn));
    expect(screen.queryByTestId("login-info")).not.toBeInTheDocument();
  });
  it("recovers the busy state after OAuth errors", async () => {
    const { actions } = login({
      signInWithGitHub: vi.fn(async () => {
        throw new Error("OAuth failed");
      }),
    });
    await userEvent.click(screen.getByText(loginLabels.continueWithGitHub));
    expect(actions.signInWithGitHub).toHaveBeenCalledOnce();
    expect(await screen.findByRole("alert")).toHaveTextContent("OAuth failed");
    expect(screen.getByTestId("login-submit")).not.toBeDisabled();
  });
  it("ignores an operation completed after the dialog was closed and reopened", async () => {
    let finish!: () => void;
    const { Example, rerender, onClose } = login({
      signIn: () =>
        new Promise<void>((resolve) => {
          finish = resolve;
        }),
    });
    await credentials();
    await userEvent.click(screen.getByTestId("login-submit"));
    expect(screen.getByTestId("login-submit")).toBeDisabled();
    rerender(<Example isOpen={false} />);
    rerender(<Example />);
    await act(async () => finish());
    expect(onClose).not.toHaveBeenCalled();
    expect(screen.getByLabelText("Password")).toHaveValue("");
    expect(screen.getByTestId("login-submit")).not.toBeDisabled();
  });
  it("validates recovery passwords and delegates updates", async () => {
    const updatePassword = vi.fn(async () => {});
    function Example() {
      const form = usePasswordResetForm({
        isOpen: true,
        updatePassword,
        messages: { passwordTooShort: "Too short", passwordsDoNotMatch: "Mismatch" },
      });
      return (
        <PasswordResetDialog
          isOpen
          form={form}
          labels={{
            title: "Reset",
            description: "Set password",
            newPassword: "New password",
            confirmPassword: "Confirm password",
            updatePassword: "Update",
          }}
        />
      );
    }
    render(<Example />);
    await userEvent.type(screen.getByLabelText("New password"), "short");
    await userEvent.type(screen.getByLabelText("Confirm password"), "short");
    await userEvent.click(screen.getByText("Update"));
    expect(await screen.findByRole("alert")).toHaveTextContent("Too short");
    await userEvent.type(screen.getByLabelText("New password"), "password");
    await userEvent.click(screen.getByText("Update"));
    expect(await screen.findByRole("alert")).toHaveTextContent("Mismatch");
    await userEvent.type(screen.getByLabelText("Confirm password"), "password");
    await userEvent.click(screen.getByText("Update"));
    expect(updatePassword).toHaveBeenCalledWith("shortpassword");
    await waitFor(() => expect(screen.getByLabelText("New password")).toHaveValue(""));
  });
  it("trims name submissions, disables unchanged names and surfaces errors", async () => {
    const submit = vi.fn(async () => {
      throw new Error("Name unavailable");
    });
    const close = vi.fn();
    function Example() {
      const form = useNameForm({
        isOpen: true,
        initialName: "Existing",
        onSubmit: submit,
        onClose: close,
      });
      return (
        <NameDialog
          isOpen
          onClose={close}
          form={form}
          labels={{
            title: "Rename",
            description: "Rename item",
            name: "Name",
            cancel: "Cancel",
            submit: "Save",
          }}
        />
      );
    }
    render(<Example />);
    expect(screen.getByText("Save")).toBeDisabled();
    await userEvent.clear(screen.getByLabelText("Name"));
    await userEvent.type(screen.getByLabelText("Name"), "  Updated  ");
    await userEvent.click(screen.getByText("Save"));
    expect(submit).toHaveBeenCalledWith("Updated");
    expect(await screen.findByRole("alert")).toHaveTextContent("Name unavailable");
    expect(close).not.toHaveBeenCalled();
  });
});

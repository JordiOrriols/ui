import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { AppAccountControls, type AppAccountControlsProps } from "./AppAccountControls";

function props(): AppAccountControlsProps {
  return {
    projectId: "ladders",
    enabled: true,
    signedIn: false,
    signOutLabel: "Sign out",
    accountTitle: "Owner",
    actions: {
      signIn: vi.fn().mockResolvedValue(undefined),
      signUp: vi.fn().mockResolvedValue({ needsConfirmation: true }),
      signOut: vi.fn().mockResolvedValue(undefined),
      requestPasswordReset: vi.fn().mockResolvedValue(undefined),
      signInWithGitHub: vi.fn().mockResolvedValue(undefined),
    },
    formatError: (message) => `Localized: ${message}`,
    messages: { passwordResetSent: "Reset sent", checkEmail: "Check your email" },
    labels: {
      signInTitle: "Sign in to your account",
      signUpTitle: "Create account",
      forgotPasswordTitle: "Reset password",
      description: "Account access",
      forgotPasswordDescription: "Reset account access",
      continueWithGitHub: "Continue with GitHub",
      email: "Email",
      password: "Password",
      forgotPassword: "Forgot password?",
      switchToSignUp: "Create an account",
      switchToSignIn: "Already have an account",
      backToSignIn: "Back to sign in",
      cancel: "Cancel",
      signIn: "Sign in",
      signUp: "Sign up",
      sendResetEmail: "Send reset email",
    },
  };
}

async function openAndFill() {
  await userEvent.click(screen.getByTestId("sign-in-button"));
  await userEvent.type(screen.getByLabelText("Email"), "owner@example.test");
  await userEvent.type(screen.getByLabelText("Password"), "test-password");
}

describe("AppAccountControls", () => {
  it("reuses the shared login form and closes after a successful sign-in", async () => {
    const config = props();
    render(<AppAccountControls {...config} />);
    await openAndFill();
    await userEvent.click(screen.getByTestId("login-submit"));
    expect(config.actions.signIn).toHaveBeenCalledWith("owner@example.test", "test-password");
    await waitFor(() => expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument());
  });

  it("localizes failed login and preserves input for an explicit retry", async () => {
    const config = props();
    vi.mocked(config.actions.signIn).mockRejectedValueOnce(new Error("Invalid credentials"));
    render(<AppAccountControls {...config} />);
    await openAndFill();
    await userEvent.click(screen.getByTestId("login-submit"));
    expect(await screen.findByRole("alert")).toHaveTextContent("Localized: Invalid credentials");
    expect(screen.getByLabelText("Email")).toHaveValue("owner@example.test");
    expect(screen.getByLabelText("Password")).toHaveValue("test-password");
    await userEvent.click(screen.getByTestId("login-submit"));
    await waitFor(() => expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument());
    expect(config.actions.signIn).toHaveBeenCalledTimes(2);
  });

  it("keeps signup confirmation and password recovery messages supplied by the caller", async () => {
    const config = props();
    render(<AppAccountControls {...config} />);
    await openAndFill();
    await userEvent.click(screen.getByRole("button", { name: "Create an account" }));
    await userEvent.type(screen.getByLabelText("Password"), "new-password");
    await userEvent.click(screen.getByTestId("login-submit"));
    expect(await screen.findByTestId("login-info")).toHaveTextContent("Check your email");
    expect(config.actions.signUp).toHaveBeenCalledWith("owner@example.test", "new-password");
    await userEvent.click(screen.getByRole("button", { name: "Already have an account" }));
    await userEvent.click(screen.getByRole("button", { name: "Forgot password?" }));
    expect(screen.queryByLabelText("Password")).not.toBeInTheDocument();
    await userEvent.click(screen.getByTestId("login-submit"));
    expect(await screen.findByTestId("login-info")).toHaveTextContent("Reset sent");
    expect(config.actions.requestPasswordReset).toHaveBeenCalledWith("owner@example.test");
  });

  it("reports OAuth and session-restoration errors rather than hiding them", async () => {
    const config = props();
    vi.mocked(config.actions.signInWithGitHub).mockRejectedValue(new Error("OAuth failed"));
    render(<AppAccountControls {...config} authError="Session failed" />);
    expect(screen.getByRole("alert")).toHaveTextContent("Localized: Session failed");
    await userEvent.click(screen.getByTestId("sign-in-button"));
    await userEvent.click(screen.getByRole("button", { name: "Continue with GitHub" }));
    expect(await screen.findByTestId("login-error")).toHaveTextContent("Localized: OAuth failed");
  });

  it("disables sign-out while pending and displays localized failures without changing account state", async () => {
    const config = props();
    let reject: (error: Error) => void = () => {
      throw new Error("Promise not initialized");
    };
    vi.mocked(config.actions.signOut).mockImplementation(
      () =>
        new Promise<void>((_, fail) => {
          reject = fail;
        })
    );
    render(<AppAccountControls {...config} signedIn />);
    await userEvent.click(screen.getByTestId("sign-out-button"));
    expect(screen.getByTestId("sign-out-button")).toBeDisabled();
    await act(async () => reject(new Error("Sign-out failed")));
    expect(await screen.findByRole("alert")).toHaveTextContent("Localized: Sign-out failed");
    expect(screen.getByTestId("sign-out-button")).toBeEnabled();
    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
  });

  it("closes login when account state changes and keeps disabled auth unavailable", async () => {
    const config = props();
    const { rerender } = render(<AppAccountControls {...config} />);
    await userEvent.click(screen.getByTestId("sign-in-button"));
    rerender(<AppAccountControls {...config} signedIn />);
    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
    expect(screen.getByTestId("sign-out-button")).toBeVisible();
    rerender(<AppAccountControls {...config} enabled={false} />);
    expect(screen.queryByTestId("sign-in-button")).not.toBeInTheDocument();
    expect(screen.queryByTestId("sign-out-button")).not.toBeInTheDocument();
    expect(config.actions.signOut).not.toHaveBeenCalled();
  });
});

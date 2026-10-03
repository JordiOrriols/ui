import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { LayoutGrid } from "lucide-react";
import { AppHeader } from "./AppHeader";
import { WelcomeScreen } from "./WelcomeScreen";

const welcome = {
  brand: "Planner",
  icon: <LayoutGrid />,
  title: "Plan the work ahead",
  description: "Plan with your team.",
  features: [{ label: "Capacity", icon: <LayoutGrid /> }],
  signInLabel: "Sign in",
  signUpLabel: "Create account",
};

describe("shared application shell", () => {
  it("delegates welcome actions without owning authentication", async () => {
    const signIn = vi.fn();
    const signUp = vi.fn();
    render(<WelcomeScreen {...welcome} onSignIn={signIn} onSignUp={signUp} />);
    expect(screen.getByRole("heading", { name: welcome.title })).toBeInTheDocument();
    expect(screen.getByText("Capacity")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Sign in" }));
    await userEvent.click(screen.getByRole("button", { name: "Create account" }));
    expect(signIn).toHaveBeenCalledOnce();
    expect(signUp).toHaveBeenCalledOnce();
  });
  it("disables welcome access and displays injected errors", async () => {
    const signIn = vi.fn();
    render(
      <WelcomeScreen
        {...welcome}
        onSignIn={signIn}
        onSignUp={vi.fn()}
        disabled
        notice={<p role="alert">Configure authentication</p>}
      />
    );
    expect(screen.getByRole("alert")).toHaveTextContent("Configure authentication");
    await userEvent.click(screen.getByRole("button", { name: "Sign in" }));
    expect(signIn).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Create account" })).toBeDisabled();
  });
  it("places page navigation below branding and provides an accessible account action", async () => {
    const signOut = vi.fn();
    render(
      <AppHeader
        title="Planner"
        subtitle="Plan work"
        icon={<LayoutGrid data-testid="brand-icon" />}
        actions={<button>Language</button>}
        accountAction={{ type: "signOut", label: "Sign out", onClick: signOut }}
        navigation={
          <nav aria-label="Pages">
            <a href="#backlog">Backlog</a>
          </nav>
        }
      />
    );
    expect(screen.getByTestId("header-title")).toHaveClass("text-lg");
    expect(screen.getByTestId("header-subtitle")).toHaveClass("text-xs");
    expect(screen.getByTestId("brand-icon").parentElement).toHaveClass("[&_svg]:size-5");
    const header = screen.getByTestId("header");
    expect(header).toContainElement(screen.getByRole("navigation", { name: "Pages" }));
    const position = screen
      .getByRole("button", { name: "Sign out" })
      .compareDocumentPosition(screen.getByRole("navigation", { name: "Pages" }));
    expect(position & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    await userEvent.click(screen.getByRole("button", { name: "Sign out" }));
    expect(signOut).toHaveBeenCalledOnce();
  });
  it("keeps account labels accessible on narrow screens and disables busy actions", () => {
    render(
      <AppHeader
        title="Ladders"
        subtitle="Team competencies"
        icon={<LayoutGrid />}
        accountAction={{ type: "signIn", label: "Sign in", disabled: true, onClick: vi.fn() }}
      />
    );
    expect(screen.getByTestId("sign-in-button")).toHaveAccessibleName("Sign in");
    expect(screen.getByTestId("sign-in-button")).toBeDisabled();
  });
});

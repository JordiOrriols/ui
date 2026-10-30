import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { PROJECTS } from "../../lib/projects";
import { ProjectIcon } from "./ProjectIcon";
import { AppHeader } from "./AppHeader";
import { WelcomeScreen } from "./WelcomeScreen";

const palette = [
  ["ladders", "#3b82f6", "lucide-trending-up"],
  ["planner", "#10b981", "lucide-square-chart-gantt"],
  ["pulse", "#a855f7", "lucide-heart-pulse"],
  ["shiplog", "#f59e0b", "lucide-rocket"],
] as const;

describe("shared project brand colors", () => {
  it.each(palette)(
    "renders %s with its registered color and keeps SVG props",
    (projectId, color) => {
      render(
        <ProjectIcon
          projectId={projectId}
          data-testid="brand"
          className="size-8"
          aria-label={`${projectId} icon`}
          style={{ margin: 4, color: "black" }}
        />
      );
      const icon = screen.getByTestId("brand");
      expect(icon).toHaveStyle({ color, margin: "4px" });
      expect(icon).toHaveAttribute("aria-label", `${projectId} icon`);
      expect(icon).toHaveClass("size-8");
    }
  );

  it.each(palette)(
    "uses %s branding in the header, menu and sign-in icon",
    async (projectId, color) => {
      const onClick = vi.fn();
      render(
        <AppHeader
          title={projectId}
          projectId={projectId}
          accountAction={{ type: "signIn", label: "Sign in", onClick }}
        />
      );
      const project = PROJECTS.find((entry) => entry.id === projectId)!;
      const trigger = screen.getByRole("button", { name: "Switch project" });
      expect(trigger).toHaveStyle({ backgroundColor: project.backgroundColor });
      expect(trigger.querySelector("svg")).toHaveStyle({ color });
      const signIn = screen.getByRole("button", { name: "Sign in" });
      expect(signIn.querySelector("svg")).toHaveStyle({ color });
      await userEvent.click(signIn);
      expect(onClick).toHaveBeenCalledOnce();
      await userEvent.click(trigger);
      for (const [id, expectedColor] of palette) {
        const entry = PROJECTS.find((project) => project.id === id)!;
        const item = screen.getByRole("menuitem", { name: entry.name });
        expect(item.querySelector("svg")).toHaveStyle({ color: expectedColor });
        expect(item).toHaveAttribute("href", entry.url);
      }
    }
  );

  it.each(palette)(
    "uses the colored %s mark on the login/welcome screen without changing its actions",
    async (projectId, color, iconClass) => {
      const onSignIn = vi.fn();
      render(
        <WelcomeScreen
          projectId={projectId}
          brand={projectId}
          icon={<span>Legacy mark</span>}
          title="Welcome"
          description="Sign in to your account."
          features={[]}
          signInLabel="Sign in"
          signUpLabel="Create account"
          onSignIn={onSignIn}
          onSignUp={vi.fn()}
        />
      );
      const icon = screen.getByTestId("welcome-page").querySelector("svg");
      expect(icon).toHaveStyle({ color });
      expect(icon).toHaveClass(iconClass);
      expect(screen.queryByText("Legacy mark")).not.toBeInTheDocument();
      await userEvent.click(screen.getByRole("button", { name: "Sign in" }));
      expect(onSignIn).toHaveBeenCalledOnce();
    }
  );

  it("preserves custom branding and neutral sign-in icons when no project is specified", () => {
    render(
      <>
        <AppHeader
          title="Custom app"
          icon={<span>Custom header mark</span>}
          accountAction={{ type: "signIn", label: "Header sign in", onClick: vi.fn() }}
        />
        <WelcomeScreen
          brand="Custom"
          icon={<span>Custom welcome mark</span>}
          title="Welcome"
          description="Account"
          features={[]}
          signInLabel="Sign in"
          signUpLabel="Create account"
          onSignIn={vi.fn()}
          onSignUp={vi.fn()}
        />
      </>
    );
    expect(screen.getByText("Custom header mark")).toBeVisible();
    expect(screen.getByText("Custom welcome mark")).toBeVisible();
    expect(
      screen.getByRole("button", { name: "Header sign in" }).querySelector("svg")
    ).not.toHaveAttribute("style");
  });
});

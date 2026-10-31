import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { AppShell } from "./AppShell";
import { AppHeader } from "./AppHeader";

describe("AppShell", () => {
  it("composes existing page, header, main and footer using one project identity", () => {
    render(
      <AppShell projectId="planner" header={{ title: "Planner" }}>
        <p>Roadmap</p>
      </AppShell>
    );
    expect(screen.getByRole("banner")).toHaveTextContent("Planner");
    expect(screen.getByRole("main")).toHaveTextContent("Roadmap");
    expect(screen.getByRole("main")).toHaveClass("flex-1", "w-full");
    expect(screen.getByTestId("app-footer")).toHaveTextContent("Made with love by Jordi Orriols");
    expect(screen.getByRole("link", { name: "Contribute on GitHub" })).toHaveAttribute(
      "href",
      "https://github.com/JordiOrriols/planner"
    );
  });

  it("preserves app-owned navigation, extra actions, account state and localized language callback", async () => {
    const signOut = vi.fn();
    const changeLanguage = vi.fn();
    render(
      <AppShell
        projectId="pulse"
        header={{
          title: "Pulse",
          navigation: (
            <nav aria-label="Pages">
              <a href="/actions">Actions</a>
            </nav>
          ),
          language: {
            value: "en",
            label: "Language",
            className: "inline-flex",
            onValueChange: changeLanguage,
          },
          actions: <button>Extra action</button>,
          accountAction: { type: "signOut", label: "Sign out", title: "Owner", onClick: signOut },
        }}
      >
        <p>Content</p>
      </AppShell>
    );
    expect(screen.getByRole("navigation", { name: "Pages" })).toHaveTextContent("Actions");
    expect(screen.getByRole("button", { name: "Extra action" })).toBeVisible();
    await userEvent.click(screen.getByRole("button", { name: "Sign out" }));
    expect(signOut).toHaveBeenCalledOnce();
    await userEvent.click(screen.getByRole("button", { name: "Language" }));
    await userEvent.click(screen.getByRole("menuitemradio", { name: "Français" }));
    expect(changeLanguage).toHaveBeenCalledWith("fr");
  });

  it("keeps full-width/custom main content and translated footer contribution labels", () => {
    render(
      <AppShell
        projectId="shiplog"
        className="custom-page"
        mainClassName="max-w-none py-4"
        header={{
          title: "Shiplog",
          language: { value: "fr", label: "Langue", onValueChange: () => {} },
        }}
        footer={{ text: "Attribution" }}
      >
        <p>Content</p>
      </AppShell>
    );
    expect(screen.getByRole("main")).toHaveClass("max-w-none", "py-4");
    expect(screen.getByRole("main")).not.toHaveClass("max-w-7xl", "py-8");
    expect(screen.getByRole("button", { name: "Switch project" })).toBeVisible();
    expect(screen.getByTestId("app-footer")).toHaveTextContent("Attribution");
    expect(screen.getByRole("link", { name: "Contribuer sur GitHub" })).toHaveAttribute(
      "href",
      "https://github.com/JordiOrriols/shiplog"
    );
  });

  it("keeps the original AppHeader API working without a language configuration", () => {
    render(
      <AppHeader
        title="Existing header"
        icon={<span>Icon</span>}
        actions={<button>Existing action</button>}
      />
    );
    expect(screen.getByRole("button", { name: "Existing action" })).toBeVisible();
    expect(screen.queryByTestId("language-selector")).not.toBeInTheDocument();
  });
});

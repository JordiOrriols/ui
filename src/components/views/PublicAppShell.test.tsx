import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { PublicAppShell } from "./PublicAppShell";
import { ErrorState } from "./ErrorState";

describe("PublicAppShell", () => {
  it("reuses one shell with registry branding but no project menu or account controls", () => {
    render(
      <PublicAppShell projectId="shiplog" header={{ title: "Public releases" }}>
        <p>Catalog</p>
      </PublicAppShell>
    );
    expect(screen.getAllByRole("banner")).toHaveLength(1);
    expect(screen.getAllByRole("main")).toHaveLength(1);
    expect(screen.getAllByTestId("app-footer")).toHaveLength(1);
    expect(
      screen.getByTestId("app-brand-icon").querySelector(".lucide-rocket")
    ).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Switch project" })).not.toBeInTheDocument();
    expect(screen.queryByTestId("sign-in-button")).not.toBeInTheDocument();
    expect(screen.getByRole("main")).toHaveTextContent("Catalog");
  });

  it("keeps localized language selection mobile-visible and full-width overrides available", async () => {
    const changeLanguage = vi.fn();
    render(
      <PublicAppShell
        projectId="planner"
        mainClassName="max-w-none"
        header={{
          title: "Roadmap",
          language: { value: "fr", label: "Langue", onValueChange: changeLanguage },
        }}
      >
        <p>Schedule</p>
      </PublicAppShell>
    );
    expect(screen.getByRole("main")).toHaveClass("max-w-none");
    expect(screen.getByTestId("language-selector")).not.toHaveClass("hidden");
    expect(screen.getByRole("link", { name: "Contribuer sur GitHub" })).toHaveAttribute(
      "href",
      "https://github.com/JordiOrriols/planner"
    );
    await userEvent.click(screen.getByTestId("language-selector"));
    await userEvent.click(screen.getByRole("menuitemradio", { name: "English" }));
    expect(changeLanguage).toHaveBeenCalledWith("en");
  });

  it("preserves caller-owned restricted edits, navigation and error recovery", async () => {
    const save = vi.fn();
    const retry = vi.fn();
    render(
      <PublicAppShell
        projectId="ladders"
        header={{
          title: "Self evaluation",
          navigation: (
            <nav aria-label="Evaluation pages">
              <a href="#goals">Goals</a>
            </nav>
          ),
        }}
      >
        <button onClick={save}>Save permitted evaluation</button>
        <ErrorState message="Link unavailable" onRetry={retry} retryLabel="Retry" />
      </PublicAppShell>
    );
    await userEvent.click(screen.getByRole("button", { name: "Save permitted evaluation" }));
    await userEvent.click(screen.getByRole("button", { name: "Retry" }));
    expect(save).toHaveBeenCalledOnce();
    expect(retry).toHaveBeenCalledOnce();
    expect(screen.getByRole("navigation", { name: "Evaluation pages" })).toBeVisible();
  });
});

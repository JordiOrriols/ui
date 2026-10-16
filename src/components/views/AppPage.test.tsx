import { readFileSync } from "node:fs";
import { join } from "node:path";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AppMain, AppPage } from "./AppPage";
import { AppHeader } from "./AppHeader";
import { AppSkeleton } from "./AppSkeleton";

const css = (file: string) => readFileSync(join(process.cwd(), "src/styles", file), "utf8");

describe("AppPage", () => {
  it("paints the shared page canvas and keeps header content on white", () => {
    render(
      <AppPage data-testid="page">
        <AppHeader title="Planner" icon={<span />} />
        <AppMain>Body</AppMain>
      </AppPage>
    );
    expect(screen.getByTestId("page")).toHaveClass("min-h-screen", "bg-page");
    expect(screen.getByRole("banner")).toHaveClass("bg-background");
    expect(screen.getByRole("main")).toHaveClass("mx-auto", "max-w-7xl", "py-8");
  });

  it("lets apps extend the layout", () => {
    render(<AppMain className="space-y-6" data-testid="main" />);
    expect(screen.getByTestId("main")).toHaveClass("space-y-6", "max-w-7xl");
  });

  it("uses the page canvas while loading, with white header and cards", () => {
    render(<AppSkeleton label="Loading" />);
    const status = screen.getByRole("status", { name: "Loading" });
    expect(status).toHaveClass("bg-page");
    expect(status.querySelector(".border-b")).toHaveClass("bg-background");
    expect(status.querySelectorAll(".rounded-xl.bg-card").length).toBeGreaterThan(0);
  });

  it("defines a light cool page token, a dark fallback, and paints the body with it", () => {
    const tokens = css("tokens.css");
    expect(tokens).toContain("--color-page: var(--page);");
    expect(tokens).toMatch(/:root \{[^}]*--page: oklch\(0\.984 0\.003 247\.858\);/);
    expect(tokens).toMatch(/\.dark \{[^}]*--page: oklch\(0\.145 0 0\);/);
    expect(css("base.css")).toContain("@apply bg-page text-foreground;");
  });
});

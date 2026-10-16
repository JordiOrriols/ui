import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Tabs } from "radix-ui";
import { AppNavigation, AppNavigationItem } from "./AppNavigation";

describe("AppNavigation", () => {
  it("labels the navigation and separates tabs from trailing actions", () => {
    render(
      <AppNavigation label="Pages" actions={<button type="button">Share</button>}>
        <AppNavigationItem aria-current="page">Estimation</AppNavigationItem>
        <AppNavigationItem>Roadmap</AppNavigationItem>
      </AppNavigation>
    );
    const nav = screen.getByRole("navigation", { name: "Pages" });
    const [tabs, actions] = Array.from(nav.children);
    expect(within(tabs as HTMLElement).getAllByRole("button")).toHaveLength(2);
    expect(within(actions as HTMLElement).getByRole("button", { name: "Share" })).toBeVisible();
  });

  it("styles router links as tabs and marks the current page", () => {
    render(
      <AppNavigation label="Pages">
        <AppNavigationItem asChild>
          <a href="/vacations" aria-current="page">
            Vacations
          </a>
        </AppNavigationItem>
      </AppNavigation>
    );
    const link = screen.getByRole("link", { name: "Vacations" });
    expect(link).toHaveAttribute("aria-current", "page");
    expect(link).not.toHaveAttribute("type");
    expect(link.className).toContain("aria-[current=page]:border-primary");
    expect(link.className).toContain("border-b-2");
  });

  it("drives Radix tabs with the same look", async () => {
    render(
      <Tabs.Root defaultValue="individual">
        <AppNavigation label="Views">
          <Tabs.List>
            <Tabs.Trigger value="individual" asChild>
              <AppNavigationItem>Individual</AppNavigationItem>
            </Tabs.Trigger>
            <Tabs.Trigger value="team" asChild>
              <AppNavigationItem>Team</AppNavigationItem>
            </Tabs.Trigger>
          </Tabs.List>
        </AppNavigation>
        <Tabs.Content value="individual">Individual view</Tabs.Content>
        <Tabs.Content value="team">Team view</Tabs.Content>
      </Tabs.Root>
    );
    const team = screen.getByRole("tab", { name: "Team" });
    expect(team).toHaveAttribute("type", "button");
    expect(team.className).toContain("data-[state=active]:border-primary");
    await userEvent.click(team);
    expect(team).toHaveAttribute("data-state", "active");
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Team view");
  });

  it("supports a forced active state", () => {
    render(<AppNavigationItem active>Forced</AppNavigationItem>);
    expect(screen.getByRole("button", { name: "Forced" })).toHaveAttribute("data-active", "true");
  });
});

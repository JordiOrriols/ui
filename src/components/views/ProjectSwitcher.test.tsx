import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { AppHeader } from "./AppHeader";
import { PROJECTS, getProjectUrl } from "../../lib/projects";

describe("shared project directory", () => {
  it("opens all registered projects from the header icon with names, icons and canonical links", async () => {
    render(<AppHeader title="Planner" icon={<span>P</span>} projectId="planner" />);
    await userEvent.click(screen.getByRole("button", { name: "Switch project" }));
    for (const project of PROJECTS) {
      const link = screen.getByRole("menuitem", { name: project.name });
      expect(link).toHaveAttribute("href", getProjectUrl(project.id));
      expect(link.querySelector("svg")).not.toBeNull();
    }
    expect(screen.getByRole("menuitem", { name: "Planner" })).toHaveAttribute(
      "aria-current",
      "page"
    );
    await userEvent.keyboard("{Escape}");
    expect(screen.getByRole("button", { name: "Switch project" })).toHaveFocus();
  });

  it("lists Pulse with its heart icon and marks it current inside Pulse", async () => {
    render(<AppHeader title="Pulse" icon={<span>P</span>} projectId="pulse" />);
    const trigger = screen.getByRole("button", { name: "Switch project" });
    expect(trigger.querySelector("svg.lucide-heart-pulse")).not.toBeNull();
    await userEvent.click(trigger);
    expect(screen.getAllByRole("menuitem").map((item) => item.textContent)).toEqual([
      "Ladders",
      "Planner",
      "Pulse",
      "Shiplog",
    ]);
    const pulse = screen.getByRole("menuitem", { name: "Pulse" });
    expect(pulse).toHaveAttribute("href", "https://pulse.jordiorriols.cat/");
    expect(pulse).toHaveAttribute("aria-current", "page");
  });

  it("uses the Shiplog rocket and canonical URL", async () => {
    render(<AppHeader title="Shiplog" projectId="shiplog" />);
    expect(
      screen.getByRole("button", { name: "Switch project" }).querySelector("svg.lucide-rocket")
    ).not.toBeNull();
    await userEvent.click(screen.getByRole("button", { name: "Switch project" }));
    expect(screen.getByRole("menuitem", { name: "Shiplog" })).toHaveAttribute(
      "href",
      "https://shiplog.jordiorriols.cat/"
    );
  });

  it("uses the registry growth icon in both Ladders locations without a chevron", async () => {
    render(
      <AppHeader title="Ladders" icon={<span>Ignored custom icon</span>} projectId="ladders" />
    );
    const trigger = screen.getByRole("button", { name: "Switch project" });
    expect(trigger.querySelector("svg.lucide-trending-up")).not.toBeNull();
    expect(trigger.querySelectorAll("svg")).toHaveLength(1);
    expect(screen.queryByText("Ignored custom icon")).not.toBeInTheDocument();
    await userEvent.click(trigger);
    expect(
      screen.getByRole("menuitem", { name: "Ladders" }).querySelector("svg.lucide-trending-up")
    ).not.toBeNull();
  });
});

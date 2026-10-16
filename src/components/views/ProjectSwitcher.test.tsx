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
});

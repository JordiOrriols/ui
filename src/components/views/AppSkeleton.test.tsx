import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AppSkeleton } from "./AppSkeleton";

describe("shared app skeleton", () => {
  it("announces loading once and hides pulsing placeholders from assistive technology", () => {
    const rendered = render(<AppSkeleton label="Loading Planner" />);
    expect(screen.getByRole("status", { name: "Loading Planner" })).toHaveAttribute(
      "aria-busy",
      "true"
    );
    expect(rendered.container.querySelector(".animate-pulse")).toHaveClass(
      "motion-reduce:animate-none"
    );
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});

import { createRef, useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Checkbox } from "./checkbox";

describe("Checkbox", () => {
  it("supports label clicks, keyboard toggles, refs and disabled controls", async () => {
    const ref = createRef<HTMLButtonElement>();
    const change = vi.fn();
    render(
      <>
        <label>
          <Checkbox ref={ref} onCheckedChange={change} /> Include comments
        </label>
        <label>
          <Checkbox disabled defaultChecked /> Locked
        </label>
      </>
    );
    const checkbox = screen.getByRole("checkbox", { name: "Include comments" });
    expect(ref.current).toBe(checkbox);
    expect(checkbox).toHaveAttribute("data-slot", "checkbox");
    await userEvent.click(screen.getByText("Include comments"));
    expect(checkbox).toBeChecked();
    expect(change).toHaveBeenLastCalledWith(true);
    checkbox.focus();
    await userEvent.keyboard(" ");
    expect(checkbox).not.toBeChecked();
    await userEvent.click(screen.getByText("Locked"));
    expect(screen.getByRole("checkbox", { name: "Locked" })).toBeChecked();
    expect(screen.getByRole("checkbox", { name: "Locked" })).toBeDisabled();
  });

  it("preserves controlled and indeterminate state", async () => {
    function Controlled() {
      const [checked, setChecked] = useState<boolean | "indeterminate">("indeterminate");
      return <Checkbox aria-label="All items" checked={checked} onCheckedChange={setChecked} />;
    }
    render(<Controlled />);
    const checkbox = screen.getByRole("checkbox", { name: "All items" });
    expect(checkbox).toHaveAttribute("aria-checked", "mixed");
    await userEvent.click(checkbox);
    expect(checkbox).toBeChecked();
    await userEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });

  it("preserves checkbox FormData, custom values and reset without submitting on toggle", async () => {
    const submit = vi.fn((event) => event.preventDefault());
    const { container } = render(
      <form onSubmit={submit}>
        <label>
          <Checkbox name="mandatory" defaultChecked /> Mandatory
        </label>
        <label>
          <Checkbox name="selection" value="feature" /> Feature
        </label>
        <button type="reset">Reset</button>
      </form>
    );
    const form = container.querySelector("form")!;
    expect(new FormData(form).get("mandatory")).toBe("on");
    expect(new FormData(form).has("selection")).toBe(false);
    await userEvent.click(screen.getByRole("checkbox", { name: "Mandatory" }));
    await userEvent.click(screen.getByRole("checkbox", { name: "Feature" }));
    expect(new FormData(form).has("mandatory")).toBe(false);
    expect(new FormData(form).get("selection")).toBe("feature");
    expect(submit).not.toHaveBeenCalled();
    await userEvent.click(screen.getByRole("button", { name: "Reset" }));
    expect(screen.getByRole("checkbox", { name: "Mandatory" })).toBeChecked();
    expect(new FormData(form).get("mandatory")).toBe("on");
  });
});

import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { SelectField } from "./select-field";

const options = [
  { value: "", label: "All" },
  { value: "draft", label: "Draft" },
  { value: "qa", label: "QA", disabled: true },
];

describe("SelectField", () => {
  it("reuses option indicators in the selected trigger without altering accessible labels or submitted values", async () => {
    render(
      <form aria-label="Access">
        <SelectField
          name="access"
          aria-label="Permission"
          options={[
            { value: "", label: "No access", indicatorClassName: "bg-slate-400" },
            { value: "viewer", label: "Viewer", indicatorClassName: "bg-blue-500" },
          ]}
        />
      </form>
    );
    const trigger = screen.getByRole("combobox", { name: "Permission" });
    expect(trigger.querySelector(".bg-slate-400")).toBeInTheDocument();
    await userEvent.click(trigger);
    await userEvent.click(screen.getByRole("option", { name: "Viewer", exact: true }));
    expect(trigger.querySelector(".bg-blue-500")).toBeInTheDocument();
    expect(new FormData(screen.getByRole("form") as HTMLFormElement).get("access")).toBe("viewer");
  });
  it("uses a custom listbox, supports empty choices and submits the real form value", async () => {
    const changed = vi.fn();
    render(
      <form aria-label="Release">
        <label htmlFor="status">Status</label>
        <SelectField id="status" name="status" options={options} onValueChange={changed} />
      </form>
    );
    const field = screen.getByRole("combobox", { name: "Status" });
    expect(field.tagName).toBe("BUTTON");
    await userEvent.click(field);
    await userEvent.click(screen.getByRole("option", { name: "Draft" }));
    expect(changed).toHaveBeenLastCalledWith("draft");
    expect(new FormData(screen.getByRole("form") as HTMLFormElement).get("status")).toBe("draft");
    await userEvent.click(field);
    expect(screen.getByRole("option", { name: "QA" })).toHaveAttribute("aria-disabled", "true");
    await userEvent.click(screen.getByRole("option", { name: "All" }));
    expect(changed).toHaveBeenLastCalledWith("");
    expect(new FormData(screen.getByRole("form") as HTMLFormElement).get("status")).toBe("");
  });
  it("supports controlled selection, placeholder and disabled fieldsets", () => {
    const { rerender } = render(
      <SelectField
        aria-label="Status"
        value=""
        options={[{ value: "", label: "Choose", disabled: true }, ...options.slice(1)]}
      />
    );
    expect(screen.getByRole("combobox")).toHaveTextContent("Choose");
    rerender(
      <fieldset disabled>
        <SelectField aria-label="Status" name="status" value="draft" options={options} />
      </fieldset>
    );
    expect(screen.getByRole("combobox")).toBeDisabled();
    expect(screen.getByRole("combobox")).toHaveTextContent("Draft");
  });
  it("preserves native required validation, fieldset submission rules and form reset", async () => {
    render(
      <form aria-label="Required">
        <fieldset>
          <SelectField
            name="project"
            aria-label="Project"
            required
            options={[
              { value: "", label: "Choose", disabled: true },
              { value: "one", label: "First", group: "Projects" },
            ]}
          />
        </fieldset>
      </form>
    );
    const form = screen.getByRole("form") as HTMLFormElement;
    expect(form.checkValidity()).toBe(false);
    await userEvent.click(screen.getByRole("combobox"));
    expect(screen.getByRole("group", { name: "Projects" })).toBeVisible();
    await userEvent.click(screen.getByRole("option", { name: "First" }));
    expect(form.checkValidity()).toBe(true);
    expect(new FormData(form).get("project")).toBe("one");
    fireEvent.reset(form);
    expect(screen.getByRole("combobox")).toHaveTextContent("Choose");
    const fieldset = form.querySelector("fieldset")!;
    fieldset.disabled = true;
    expect(new FormData(form).has("project")).toBe(false);
  });
});

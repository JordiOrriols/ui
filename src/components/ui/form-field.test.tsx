import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { FormField } from "./form-field";
import { Input } from "./input";
import { SelectField } from "./select-field";
import { Textarea } from "./textarea";

describe("FormField", () => {
  it("associates labels with unique stable generated control IDs", async () => {
    const fields = (
      <>
        <FormField label="Name">{(field) => <Input {...field} />}</FormField>
        <FormField label="Notes">{(field) => <Textarea {...field} />}</FormField>
      </>
    );
    const { rerender } = render(fields);
    const name = screen.getByRole("textbox", { name: "Name" });
    const notes = screen.getByRole("textbox", { name: "Notes" });
    const id = name.id;
    expect(id).not.toBe(notes.id);
    await userEvent.click(screen.getByText("Notes"));
    expect(notes).toHaveFocus();
    rerender(fields);
    expect(name).toHaveAttribute("id", id);
  });

  it("connects translated hints and errors and removes stale error attributes", () => {
    const { rerender } = render(
      <>
        <p id="external-hint">External hint</p>
        <FormField
          id="name"
          label="Name"
          description="Use your full name"
          error="Name is required"
          aria-describedby="external-hint"
        >
          {(field) => <Input {...field} />}
        </FormField>
      </>
    );
    const input = screen.getByRole("textbox", { name: "Name" });
    expect(input).toHaveAttribute("id", "name");
    expect(input).toHaveAttribute("aria-describedby", "external-hint name-description name-error");
    expect(input).toHaveAccessibleDescription("External hint Use your full name Name is required");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByRole("alert")).toHaveTextContent("Name is required");
    rerender(
      <FormField id="name" label="Name">
        {(field) => <Input {...field} />}
      </FormField>
    );
    const updated = screen.getByRole("textbox", { name: "Name" });
    expect(updated).not.toHaveAttribute("aria-describedby");
    expect(updated).toHaveAttribute("aria-invalid", "false");
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("also associates the existing SelectField trigger and preserves submitted values", async () => {
    render(
      <form aria-label="Selection">
        <FormField label="Status" description="Release stage">
          {(field) => (
            <SelectField
              {...field}
              name="status"
              options={[
                { value: "draft", label: "Draft" },
                { value: "qa", label: "QA" },
              ]}
            />
          )}
        </FormField>
      </form>
    );
    const select = screen.getByRole("combobox", { name: "Status" });
    expect(select).toHaveAccessibleDescription("Release stage");
    await userEvent.click(select);
    await userEvent.click(screen.getByRole("option", { name: "QA" }));
    expect(new FormData(screen.getByRole<HTMLFormElement>("form")).get("status")).toBe("qa");
  });
});

describe("Textarea", () => {
  it("preserves refs, native constraints, FormData and uncontrolled reset", async () => {
    const ref = createRef<HTMLTextAreaElement>();
    render(
      <form aria-label="Notes form">
        <FormField label="Notes">
          {(field) => (
            <Textarea
              {...field}
              ref={ref}
              name="notes"
              required
              maxLength={8}
              defaultValue="Draft"
            />
          )}
        </FormField>
      </form>
    );
    const input = screen.getByRole("textbox", { name: "Notes" });
    const form = screen.getByRole<HTMLFormElement>("form");
    expect(ref.current).toBe(input);
    expect(input).toHaveAttribute("maxlength", "8");
    await userEvent.clear(input);
    expect(form.checkValidity()).toBe(false);
    await userEvent.type(input, "Published");
    expect(input).toHaveValue("Publishe");
    expect(new FormData(form).get("notes")).toBe("Publishe");
    form.reset();
    expect(input).toHaveValue("Draft");
    ref.current!.disabled = true;
    expect(new FormData(form).has("notes")).toBe(false);
  });

  it("preserves controlled values, custom classes, rows and disabled state", () => {
    const { rerender } = render(
      <Textarea
        aria-label="Notes"
        value="First"
        onChange={() => {}}
        rows={6}
        className="min-h-48"
        disabled
      />
    );
    const input = screen.getByRole("textbox", { name: "Notes" });
    expect(input).toHaveValue("First");
    expect(input).toBeDisabled();
    expect(input).toHaveAttribute("rows", "6");
    expect(input).toHaveClass("min-h-48");
    expect(input).not.toHaveClass("min-h-24");
    rerender(<Textarea aria-label="Notes" value="Updated" onChange={() => {}} />);
    expect(input).toHaveValue("Updated");
    expect(input).toBeEnabled();
  });
});

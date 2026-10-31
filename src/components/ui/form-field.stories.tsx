import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Button } from "./button";
import { FormField } from "./form-field";
import { Input } from "./input";
import { SelectField } from "./select-field";
import { Textarea } from "./textarea";

const meta = {
  title: "Components/FormField",
  component: FormField,
  tags: ["autodocs"],
  args: {
    label: "Name",
    children: (field) => <Input {...field} name="name" placeholder="Application name" />,
  },
} satisfies Meta<typeof FormField>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithDescription: Story = {
  args: { description: "This name appears in the public release history." },
};
export const WithError: Story = {
  args: { description: "Use a short, recognizable name.", error: "Name is required." },
};
export const TextareaField: Story = {
  args: {
    label: "Release notes",
    description: "Describe the changes for your readers.",
    children: (field) => <Textarea {...field} name="notes" placeholder="What changed?" />,
  },
};
export const Select: Story = {
  args: {
    label: "Status",
    children: (field) => (
      <SelectField
        {...field}
        name="status"
        options={[
          { value: "draft", label: "Draft" },
          { value: "qa", label: "QA" },
        ]}
      />
    ),
  },
};

function NativeFormExample() {
  const [submitted, setSubmitted] = useState("");
  return (
    <form
      aria-label="Release"
      className="max-w-lg space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(JSON.stringify(Object.fromEntries(new FormData(event.currentTarget))));
      }}
      onReset={() => setSubmitted("")}
    >
      <FormField label="Title">
        {(field) => <Input {...field} name="title" required defaultValue="Website" />}
      </FormField>
      <FormField label="Notes" description="Public release notes">
        {(field) => (
          <Textarea {...field} name="notes" required maxLength={80} defaultValue="Initial notes" />
        )}
      </FormField>
      <FormField label="Status">
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
      <div className="flex gap-2">
        <Button type="submit">Save</Button>
        <Button type="reset" variant="outline">
          Reset
        </Button>
      </div>
      <output aria-label="Submitted fields">{submitted}</output>
    </form>
  );
}

export const NativeForm: Story = { render: () => <NativeFormExample /> };

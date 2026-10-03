import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { NameDialog } from "./NameDialog";
import { useNameForm } from "../../hooks/useNameForm";

const meta = {
  title: "Views/NameDialog",
  component: NameDialog,
  tags: ["autodocs"],
} satisfies Meta<typeof NameDialog>;

export default meta;
type Story = StoryObj;

function NameExample() {
  const [isOpen, setOpen] = useState(false);
  const form = useNameForm({
    isOpen,
    onSubmit: async () => setOpen(false),
    onClose: () => setOpen(false),
  });
  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Create item
      </button>
      <NameDialog
        isOpen={isOpen}
        onClose={() => setOpen(false)}
        form={form}
        labels={{
          title: "Create item",
          description: "Give it a name.",
          name: "Name",
          cancel: "Cancel",
          submit: "Create",
        }}
      />
    </>
  );
}

export const CreateName: Story = { render: () => <NameExample /> };

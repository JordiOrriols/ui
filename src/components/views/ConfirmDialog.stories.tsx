import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../ui/button";
import { ConfirmDialog } from "./ConfirmDialog";

const meta = {
  title: "Views/ConfirmDialog",
  component: ConfirmDialog,
  tags: ["autodocs"],
} satisfies Meta<typeof ConfirmDialog>;

export default meta;
type Story = StoryObj;

function Confirmation() {
  const [isOpen, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Delete item</Button>
      <ConfirmDialog
        isOpen={isOpen}
        onConfirm={() => setOpen(false)}
        onCancel={() => setOpen(false)}
        title="Delete item?"
        description="This cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
      />
    </>
  );
}

export const ConfirmationFlow: Story = { render: () => <Confirmation /> };

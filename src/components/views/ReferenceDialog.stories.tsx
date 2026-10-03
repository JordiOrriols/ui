import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ReferenceDialog } from "./ReferenceDialog";

const meta = {
  title: "Views/ReferenceDialog",
  component: ReferenceDialog,
  tags: ["autodocs"],
} satisfies Meta<typeof ReferenceDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

function Reference() {
  const [isOpen, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Open reference
      </button>
      <ReferenceDialog
        isOpen={isOpen}
        onClose={() => setOpen(false)}
        title="Reference"
        closeLabel="Close"
      >
        <h3>Help content</h3>
        <p>Host-provided reference content.</p>
      </ReferenceDialog>
    </>
  );
}

export const Content: Story = { render: () => <Reference /> };

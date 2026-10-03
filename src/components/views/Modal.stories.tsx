import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../ui/button";
import { Modal } from "./Modal";

const meta = {
  title: "Views/Modal",
  component: Modal,
  tags: ["autodocs"],
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

function ModalExample() {
  const [isOpen, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open details</Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={setOpen}
        title="Project details"
        description="Reusable content with host-controlled actions."
        closeLabel="Close"
      >
        <p>Any content can be placed here.</p>
      </Modal>
    </>
  );
}

export const Interactive: Story = { render: () => <ModalExample /> };

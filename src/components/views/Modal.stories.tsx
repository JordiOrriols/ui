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
type Story = StoryObj;

function ModalExample({ long = false }: { long?: boolean }) {
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
        footer={<Button>Save</Button>}
      >
        {long ? (
          <div className="space-y-4">
            {Array.from({ length: 30 }, (_, index) => (
              <p key={index}>
                Detail {index + 1}: Space for additional form fields and release information.
              </p>
            ))}
          </div>
        ) : (
          <p>Any content can be placed here.</p>
        )}
      </Modal>
    </>
  );
}

export const Interactive: Story = { render: () => <ModalExample /> };
export const LongContent: Story = { render: () => <ModalExample long /> };

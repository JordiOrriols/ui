import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../ui/button";
import { AlertModal } from "./AlertModal";

const meta = {
  title: "Views/AlertModal",
  component: AlertModal,
  tags: ["autodocs"],
} satisfies Meta<typeof AlertModal>;
export default meta;
type Story = StoryObj;
function Feedback() {
  const [isOpen, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Copy link</Button>
      <AlertModal
        isOpen={isOpen}
        title="Link copied"
        description="The sharing link was copied to your clipboard."
        closeLabel="OK"
        onClose={() => setOpen(false)}
      />
    </>
  );
}
export const ClipboardFeedback: Story = { render: () => <Feedback /> };

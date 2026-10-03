import type { Meta, StoryObj } from "@storybook/react-vite";
import { SplitButton } from "./SplitButton";

const meta = {
  title: "Views/SplitButton",
  component: SplitButton,
  tags: ["autodocs"],
} satisfies Meta<typeof SplitButton>;

export default meta;
type Story = StoryObj;

export const SharingActions: Story = {
  render: () => (
    <SplitButton
      label="Share"
      eventId="example_share"
      menuLabel="Sharing options"
      onClick={() => {}}
      items={[
        { label: "Copy link", eventId: "copy", onSelect: () => {} },
        { label: "Unavailable", eventId: "unavailable", disabled: true, onSelect: () => {} },
      ]}
    />
  ),
};

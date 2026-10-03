import type { Meta, StoryObj } from "@storybook/react-vite";
import { StatusBadge } from "./indicators";

const meta = {
  title: "Views/StatusBadge",
  component: StatusBadge,
  tags: ["autodocs"],
} satisfies Meta<typeof StatusBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const States: Story = {
  render: () => (
    <div className="flex gap-2">
      <StatusBadge>Draft</StatusBadge>
      <StatusBadge positive>Published</StatusBadge>
    </div>
  ),
};

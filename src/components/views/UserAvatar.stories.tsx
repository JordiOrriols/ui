import type { Meta, StoryObj } from "@storybook/react-vite";
import { UserAvatar } from "./indicators";

const meta = {
  title: "Views/UserAvatar",
  component: UserAvatar,
  tags: ["autodocs"],
} satisfies Meta<typeof UserAvatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Fallbacks: Story = {
  render: () => (
    <div className="flex gap-3">
      <UserAvatar label="User" />
      <UserAvatar label="Ada Lovelace" fallback="AL" />
      <UserAvatar label="Another user" fallback="?" />
    </div>
  ),
};

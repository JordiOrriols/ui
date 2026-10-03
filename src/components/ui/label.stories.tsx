import type { Meta, StoryObj } from "@storybook/react-vite";
import { Input } from "./input";
import { Label } from "./label";

const meta = {
  title: "UI/Label",
  component: Label,
  tags: ["autodocs"],
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AssociatedInput: Story = {
  render: () => (
    <div className="max-w-sm space-y-2">
      <Label htmlFor="label-story-email">Email address</Label>
      <Input id="label-story-email" type="email" placeholder="you@example.com" />
    </div>
  ),
};

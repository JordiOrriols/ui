import type { Meta, StoryObj } from "@storybook/react-vite";
import { Input } from "./input";

const meta = {
  title: "UI/Input",
  component: Input,
  tags: ["autodocs"],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Examples: Story = {
  render: () => (
    <div className="max-w-sm space-y-3">
      <Input aria-label="Email" type="email" placeholder="you@example.com" />
      <Input aria-label="Disabled input" disabled placeholder="Disabled input" />
      <Input aria-label="Invalid input" aria-invalid defaultValue="Invalid value" />
    </div>
  ),
};

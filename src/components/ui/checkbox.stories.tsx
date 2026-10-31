import type { Meta, StoryObj } from "@storybook/react-vite";
import { Checkbox } from "./checkbox";

const meta = {
  title: "Components/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
} satisfies Meta<typeof Checkbox>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
  render: () => (
    <label className="flex items-center gap-2">
      <Checkbox /> Include comments
    </label>
  ),
};
export const Checked: Story = { args: { defaultChecked: true, "aria-label": "Selected" } };
export const Indeterminate: Story = {
  args: { checked: "indeterminate", "aria-label": "Some selected" },
};
export const Disabled: Story = {
  args: { disabled: true, defaultChecked: true, "aria-label": "Unavailable" },
};

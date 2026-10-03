import type { Meta, StoryObj } from "@storybook/react-vite";
import { ProgressIndicator } from "./indicators";

const meta = {
  title: "Views/ProgressIndicator",
  component: ProgressIndicator,
  tags: ["autodocs"],
} satisfies Meta<typeof ProgressIndicator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ProgressStates: Story = {
  render: () => (
    <div className="w-64 space-y-4">
      {[0, 60, 100, null].map((value) => (
        <ProgressIndicator key={String(value)} value={value} label="Upload progress" />
      ))}
    </div>
  ),
};

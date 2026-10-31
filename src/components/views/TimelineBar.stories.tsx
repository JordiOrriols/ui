import type { Meta, StoryObj } from "@storybook/react-vite";
import { TimelineBar } from "./TimelineCard";

const meta = {
  title: "Views/TimelineBar",
  component: TimelineBar,
  tags: ["autodocs"],
  args: {
    columnCount: 14,
    span: { id: "vacation", label: "Anna: October 3–6", start: 2, end: 6 },
  },
  render: (args) => (
    <div className="relative flex h-12 w-96 items-center rounded border border-border">
      <TimelineBar {...args} />
    </div>
  ),
} satisfies Meta<typeof TimelineBar>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Clipped: Story = {
  args: { span: { id: "clipped", label: "Clipped vacation", start: -2, end: 3.5 } },
};

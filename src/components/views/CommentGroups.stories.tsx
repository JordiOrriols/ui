import type { Meta, StoryObj } from "@storybook/react-vite";
import { CommentGroups } from "./CommentGroups";

const meta = {
  title: "Views/CommentGroups",
  component: CommentGroups,
  tags: ["autodocs"],
} satisfies Meta<typeof CommentGroups>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ReviewerNotes: Story = {
  render: () => (
    <CommentGroups
      title="Notes"
      categories={["Quality", "Reliability", "Speed"]}
      groups={[
        {
          id: "reviewer",
          label: "Reviewer",
          color: "#10b981",
          comments: { Quality: "Clear, well-tested work." },
        },
        {
          id: "self",
          label: "Self",
          color: "#c084fc",
          comments: { Quality: "Improving the review process." },
        },
      ]}
    />
  ),
};

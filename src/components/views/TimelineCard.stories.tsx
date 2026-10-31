import type { Meta, StoryObj } from "@storybook/react-vite";
import { TimelineCard } from "./TimelineCard";

const meta = {
  title: "Views/TimelineCard",
  component: TimelineCard,
  tags: ["autodocs"],
  args: {
    title: "Team availability",
    "aria-label": "Vacation timeline",
    labelTitle: "Member",
    columnTitle: "Day",
    columns: Array.from({ length: 14 }, (_, index) => ({
      id: String(index),
      label: String(index + 1),
      group: index < 7 ? "October" : "November",
    })),
    rows: [
      {
        id: "jordi",
        label: "Jordi Orriols",
        accessibleLabel: "Jordi Orriols",
        group: { id: "platform", label: "Platform" },
        spans: [{ id: "holiday", label: "Jordi: October 3–6", start: 2, end: 6 }],
      },
      {
        id: "anna",
        label: "Anna",
        accessibleLabel: "Anna",
        group: { id: "platform", label: "Platform" },
        spans: [],
      },
      {
        id: "marc",
        label: "Marc",
        accessibleLabel: "Marc",
        group: { id: "product", label: "Product" },
        spans: [
          {
            id: "holiday",
            label: "Marc: November 2–5",
            start: 8,
            end: 12,
            className: "bg-emerald-600",
          },
        ],
      },
    ],
    markers: [{ id: "today", label: "Today", caption: "Today", position: 5.5 }],
  },
} satisfies Meta<typeof TimelineCard>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Vacations: Story = {};
export const Empty: Story = { args: { rows: [], empty: "No members yet." } };

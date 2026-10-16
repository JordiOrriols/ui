import type { Meta, StoryObj } from "@storybook/react-vite";
import { GanttChartSquare } from "lucide-react";
import { ProjectSwitcher } from "./ProjectSwitcher";

export default {
  title: "Views/ProjectSwitcher",
  component: ProjectSwitcher,
  tags: ["autodocs"],
} satisfies Meta<typeof ProjectSwitcher>;

export const Planner: StoryObj<typeof ProjectSwitcher> = {
  args: { projectId: "planner", children: <GanttChartSquare /> },
};

import type { Meta, StoryObj } from "@storybook/react-vite";
import { RadarChart } from "./RadarChart";

const meta = {
  title: "Views/RadarChart",
  component: RadarChart,
  tags: ["autodocs"],
} satisfies Meta<typeof RadarChart>;

export default meta;
type Story = StoryObj;

const axes = ["Quality", "Reliability", "Speed", "Collaboration"];
const series = [
  {
    id: "current",
    label: "Current",
    color: "#10b981",
    primary: true,
    levels: { Quality: 3, Reliability: 4, Speed: 2, Collaboration: 5 },
  },
  {
    id: "goal",
    label: "Goal",
    color: "#fbbf24",
    dashed: true,
    levels: { Quality: 4, Reliability: 5, Speed: 4, Collaboration: 5 },
  },
];

export const Skills: Story = {
  render: () => <RadarChart axes={axes} series={series} label="Skills" />,
};

export const NoData: Story = {
  render: () => <RadarChart axes={axes} series={[]} label="Skills" />,
};

import type { Meta, StoryObj } from "@storybook/react-vite";
import { ProfileCard } from "./ProfileCard";
import { RadarChart } from "./RadarChart";

const meta = {
  title: "Views/ProfileCard",
  component: ProfileCard,
  tags: ["autodocs"],
} satisfies Meta<typeof ProfileCard>;

export default meta;
type Story = StoryObj;

export const WithChart: Story = {
  render: () => (
    <div className="max-w-sm">
      <ProfileCard
        id="ada"
        name="Ada Lovelace"
        subtitle="Engineer"
        editLabel="Edit Ada"
        deleteLabel="Delete Ada"
        onEdit={() => {}}
        onDelete={() => {}}
      >
        <RadarChart
          axes={["Quality", "Reliability", "Speed", "Collaboration"]}
          series={[
            {
              id: "current",
              label: "Current",
              color: "#10b981",
              primary: true,
              levels: { Quality: 3, Reliability: 4, Speed: 2, Collaboration: 5 },
            },
          ]}
          size={180}
          showLabels={false}
          showLegend={false}
          label="Skills"
        />
      </ProfileCard>
    </div>
  ),
};

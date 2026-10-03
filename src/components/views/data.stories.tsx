import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { RadarChart } from "./RadarChart";
import { ProfileCard } from "./ProfileCard";
import { CommentGroups } from "./CommentGroups";
import { ShareAccessDialog, type AccessEntry } from "./ShareAccessDialog";
import { useShareAccessForm } from "../../hooks/useShareAccessForm";
import { LevelSelector } from "./LevelSelector";
import { ReferenceDialog } from "./ReferenceDialog";

export default {
  title: "Views/Data display",
  tags: ["autodocs"],
  subcomponents: {
    RadarChart,
    ProfileCard,
    CommentGroups,
    ShareAccessDialog,
    LevelSelector,
    ReferenceDialog,
  },
} satisfies Meta;
type Story = StoryObj;
const axes = ["Quality", "Reliability", "Speed", "Collaboration"];
const series = [
  {
    id: "current",
    label: "Current",
    color: "#10b981",
    primary: true,
    levels: {
      Quality: 3,
      Reliability: 4,
      Speed: 2,
      Collaboration: 5,
    },
  },
  {
    id: "goal",
    label: "Goal",
    color: "#fbbf24",
    dashed: true,
    levels: {
      Quality: 4,
      Reliability: 5,
      Speed: 4,
      Collaboration: 5,
    },
  },
];
export const Radar: Story = {
  render: () => <RadarChart axes={axes} series={series} label="Skills" />,
};
export const EmptyRadar: Story = {
  render: () => <RadarChart axes={axes} series={[]} label="Skills" />,
};
export const Card: Story = {
  render: () => (
    <div className="max-w-sm">
      <ProfileCard
        id="ada"
        name="Ada"
        subtitle="Engineer"
        editLabel="Edit Ada"
        deleteLabel="Delete Ada"
        onEdit={() => {}}
        onDelete={() => {}}
      >
        <RadarChart
          axes={axes}
          series={series}
          size={180}
          showLabels={false}
          showLegend={false}
          label="Skills"
        />
      </ProfileCard>
    </div>
  ),
};
export const Comments: Story = {
  render: () => (
    <CommentGroups
      title="Notes"
      categories={axes}
      groups={[
        {
          id: "one",
          label: "Reviewer",
          color: "#10b981",
          comments: { Quality: "Clear, well-tested work." },
        },
        {
          id: "two",
          label: "Self",
          color: "#c084fc",
          comments: { Quality: "Improving the review process." },
        },
      ]}
    />
  ),
};
function Sharing({ empty = false, loading = false }: { empty?: boolean; loading?: boolean }) {
  const [isOpen, setOpen] = useState(true);
  const [entries, setEntries] = useState<AccessEntry<"reader" | "writer">[]>(
    empty ? [] : [{ id: "ada", email: "ada@example.com", access: "reader" }]
  );
  const form = useShareAccessForm<"reader" | "writer">({
    isOpen,
    initialAccess: "reader",
    onShare: async (email, access) => {
      setEntries((previous) => [...previous, { id: email, email, access }]);
    },
    onChangeAccess: async (id, access) => {
      setEntries((previous) =>
        previous.map((entry) => (entry.id === id ? { ...entry, access } : entry))
      );
    },
    onRemove: async (id) => {
      setEntries((previous) => previous.filter((entry) => entry.id !== id));
    },
  });
  return (
    <>
      <button onClick={() => setOpen(true)}>Manage access</button>
      <ShareAccessDialog
        isOpen={isOpen}
        onClose={() => setOpen(false)}
        entries={entries}
        loading={loading}
        form={form}
        options={[
          { value: "reader", label: "Read" },
          { value: "writer", label: "Write" },
        ]}
        labels={{
          title: "Share workspace",
          description: "Invite collaborators.",
          email: "Email",
          permission: "Permission",
          share: "Invite",
          loading: "Loading",
          empty: "No collaborators",
          close: "Close",
          permissionFor: (email) => `Permission for ${email}`,
          remove: (email) => `Remove ${email}`,
        }}
      />
    </>
  );
}
export const SharingAccess: Story = { render: () => <Sharing /> };
export const EmptySharing: Story = { render: () => <Sharing empty /> };
export const LoadingSharing: Story = { render: () => <Sharing loading /> };

function Levels() {
  const [current, setCurrent] = useState(0);
  const [goal, setGoal] = useState(0);
  const [comment, setComment] = useState("");
  return (
    <LevelSelector
      id="quality"
      title="Quality"
      options={[
        { value: 1, name: "Learning", description: "Learning the process" },
        { value: 2, name: "Practising", description: "Applying the process" },
        { value: 3, name: "Leading", description: "Teaching the process" },
      ]}
      summary={
        <p>
          Current: {current}; Goal: {goal}
        </p>
      }
      ariaLabel="Quality levels"
      className="bg-indigo-50 border-indigo-200"
      accentClassName="bg-indigo-500"
      currentLevel={current}
      goalLevel={goal}
      onCurrentChange={setCurrent}
      onGoalChange={setGoal}
      comment={comment}
      onCommentChange={setComment}
      labels={{
        current: "Current",
        currentPlus: "Current+",
        goal: "Goal",
        goalPlus: "Goal+",
        self: "Self",
        comments: "Comments",
        commentsPlaceholder: "Add notes",
      }}
    />
  );
}
export const LevelSelection: Story = { render: () => <Levels /> };
function Reference() {
  const [isOpen, setOpen] = useState(true);
  return (
    <>
      <button onClick={() => setOpen(true)}>Reference</button>
      <ReferenceDialog
        isOpen={isOpen}
        onClose={() => setOpen(false)}
        title="Reference"
        closeLabel="Close"
      >
        <h3>Help content</h3>
        <p>Host-provided reference content.</p>
      </ReferenceDialog>
    </>
  );
}
export const ReferenceContent: Story = { render: () => <Reference /> };

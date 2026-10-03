import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { LevelSelector } from "./LevelSelector";

const meta = {
  title: "Views/LevelSelector",
  component: LevelSelector,
  tags: ["autodocs"],
} satisfies Meta<typeof LevelSelector>;

export default meta;
type Story = StoryObj;

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
      className="border-indigo-200 bg-indigo-50"
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

export const Interactive: Story = { render: () => <Levels /> };

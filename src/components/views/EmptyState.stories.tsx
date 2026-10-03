import type { Meta, StoryObj } from "@storybook/react-vite";
import { Plus, User, Users } from "lucide-react";
import { Button } from "../ui/button";
import { EmptyState } from "./EmptyState";

const meta = {
  title: "Views/EmptyState",
  component: EmptyState,
  tags: ["autodocs"],
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NoPeople: Story = {
  render: () => (
    <EmptyState
      icon={<User className="h-8 w-8 text-slate-400" />}
      title="No people yet"
      description="Add a person to get started."
      action={
        <Button>
          <Plus />
          Add person
        </Button>
      }
    />
  ),
};

export const NoTeams: Story = {
  render: () => (
    <EmptyState
      icon={<Users className="h-8 w-8 text-slate-400" />}
      title="No teams yet"
      description="Create your first team."
      action={
        <Button>
          <Plus />
          Create team
        </Button>
      }
    />
  ),
};

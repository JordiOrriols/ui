import { useMemo, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { WorkspaceBar } from "./WorkspaceBar";
import { createDemoWorkspaceApi, DEMO_WORKSPACES } from "../../lib/workspace-demo";
import { getWorkspaceLabels } from "../../lib/workspace-labels";

const meta = {
  title: "Views/WorkspaceBar",
  component: WorkspaceBar,
  tags: ["autodocs"],
} satisfies Meta<typeof WorkspaceBar>;

export default meta;
type Story = StoryObj;

function Bar({ language = "en", value = "digital" }: { language?: string; value?: string }) {
  const api = useMemo(() => createDemoWorkspaceApi(), []);
  const [workspaces, setWorkspaces] = useState(DEMO_WORKSPACES);
  const [selected, setSelected] = useState(value);
  return (
    <WorkspaceBar
      api={api}
      app="planner"
      workspaces={workspaces}
      value={selected}
      onValueChange={setSelected}
      onCreated={(created) => {
        setWorkspaces((previous) => [...previous, created]);
        setSelected(created.id);
      }}
      labels={getWorkspaceLabels(language)}
    />
  );
}

export const Owner: Story = { render: () => <Bar /> };
export const SharedWithMe: Story = { render: () => <Bar value="lead" /> };
export const Catalan: Story = { render: () => <Bar language="ca" /> };

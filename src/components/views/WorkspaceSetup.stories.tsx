import { useMemo, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { WorkspaceSetup } from "./WorkspaceSetup";
import { createDemoWorkspaceApi } from "../../lib/workspace-demo";

const meta = {
  title: "Views/WorkspaceSetup",
  component: WorkspaceSetup,
  tags: ["autodocs"],
} satisfies Meta<typeof WorkspaceSetup>;
export default meta;
type Story = StoryObj;

function Setup({ language = "en" }: { language?: string }) {
  const api = useMemo(() => createDemoWorkspaceApi(), []);
  const [workspace, setWorkspace] = useState("");
  return workspace ? (
    <p role="status">{workspace}</p>
  ) : (
    <WorkspaceSetup
      api={api}
      language={language}
      onCreated={(created) => setWorkspace(created.name)}
      onRefresh={async () => {
        const invited = (await api.listWorkspaces("planner"))[0];
        if (invited) setWorkspace(invited.name);
      }}
    />
  );
}
export const CreateOrWait: Story = { render: () => <Setup /> };
export const Spanish: Story = { render: () => <Setup language="es" /> };

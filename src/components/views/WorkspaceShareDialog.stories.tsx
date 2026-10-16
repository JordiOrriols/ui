import { useMemo, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { WorkspaceShareDialog } from "./WorkspaceShareDialog";
import { createDemoWorkspaceApi } from "../../lib/workspace-demo";
import { getWorkspaceLabels } from "../../lib/workspace-labels";

const meta = {
  title: "Views/WorkspaceShareDialog",
  component: WorkspaceShareDialog,
  tags: ["autodocs"],
} satisfies Meta<typeof WorkspaceShareDialog>;

export default meta;
type Story = StoryObj;

function Sharing({ empty = false }: { empty?: boolean }) {
  const [isOpen, setOpen] = useState(true);
  const api = useMemo(
    () =>
      createDemoWorkspaceApi(
        empty
          ? []
          : [
              { user_id: "ada", email: "ada@example.com", app: "ladders", access_level: "editor" },
              { user_id: "ada", email: "ada@example.com", app: "planner", access_level: "viewer" },
            ]
      ),
    [empty]
  );
  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Share workspace
      </button>
      <WorkspaceShareDialog
        isOpen={isOpen}
        onClose={() => setOpen(false)}
        api={api}
        workspace={{ id: "digital", name: "Digital Team" }}
        app="planner"
        labels={getWorkspaceLabels("en")}
      />
    </>
  );
}

export const PerAppAccess: Story = { render: () => <Sharing /> };
export const Empty: Story = { render: () => <Sharing empty /> };

import { useMemo, useRef, useState } from "react";
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

function Sharing({
  empty = false,
  unified = false,
  readOnly = false,
  many = false,
}: {
  empty?: boolean;
  unified?: boolean;
  readOnly?: boolean;
  many?: boolean;
}) {
  const [isOpen, setOpen] = useState(true);
  const api = useMemo(
    () =>
      createDemoWorkspaceApi(
        empty
          ? []
          : many
            ? Array.from({ length: 20 }, (_, index) => ({
                user_id: `person-${index}`,
                email: `person-${index}@example.com`,
                app: "planner" as const,
                access_level: "viewer" as const,
              }))
            : [
                {
                  user_id: "ada",
                  email: "ada@example.com",
                  app: "ladders",
                  access_level: "editor",
                },
                {
                  user_id: "ada",
                  email: "ada@example.com",
                  app: "planner",
                  access_level: "viewer",
                },
              ]
      ),
    [empty, many]
  );
  const token = useRef<string | null>("demo-public-link");
  const sharing = useMemo(() => {
    return {
      readAccess: () => api.listShares("digital"),
      publicLink: {
        load: async () => token.current,
        setEnabled: async (enabled: boolean) => {
          token.current = enabled ? "demo-public-link" : null;
          return token.current;
        },
        getUrl: (value: string) => `https://planner.jordiorriols.cat/#/roadmap/${value}`,
        description:
          "Anyone with the link can view the roadmap. This does not grant workspace access.",
      },
    };
  }, [api]);
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
        canManage={!readOnly}
        sharing={unified ? sharing : undefined}
      />
    </>
  );
}

export const PerAppAccess: Story = { render: () => <Sharing /> };
export const Empty: Story = { render: () => <Sharing empty /> };
export const PeopleAndPublicLink: Story = { render: () => <Sharing unified /> };
export const ReadOnlyAccess: Story = { render: () => <Sharing unified readOnly /> };
export const LargeDirectory: Story = { render: () => <Sharing unified many /> };

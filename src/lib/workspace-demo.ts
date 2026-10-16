import type { WorkspaceApi, WorkspaceShare, WorkspaceSummary } from "./workspaces";

export const DEMO_WORKSPACES: WorkspaceSummary[] = [
  { id: "digital", name: "Digital Team", owner_id: "me", access_level: "owner" },
  { id: "lead", name: "Lead", owner_id: "someone", access_level: "editor" },
];

/** An in-memory workspace API for stories and demos. */
export function createDemoWorkspaceApi(initial: WorkspaceShare[] = []): WorkspaceApi {
  let shares = [...initial];
  let workspaces = [...DEMO_WORKSPACES];
  const userId = (email: string) =>
    shares.find((share) => share.email === email)?.user_id ?? `user-${email}`;
  return {
    listWorkspaces: async () => workspaces,
    createWorkspace: async (name) => {
      const created: WorkspaceSummary = {
        id: `w-${workspaces.length + 1}`,
        name,
        owner_id: "me",
        access_level: "owner",
      };
      workspaces = [...workspaces, created];
      return created;
    },
    listShares: async () => shares,
    share: async (_workspace, email, app, access) => {
      shares = [
        ...shares.filter((share) => !(share.email === email && share.app === app)),
        { user_id: userId(email), email, app, access_level: access },
      ];
    },
    updateShare: async (_workspace, account, app, access) => {
      shares = shares.map((share) =>
        share.user_id === account && share.app === app ? { ...share, access_level: access } : share
      );
    },
    removeShare: async (_workspace, account, app) => {
      shares = shares.filter((share) => !(share.user_id === account && share.app === app));
    },
  };
}

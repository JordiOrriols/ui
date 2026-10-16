import type { SupabaseClient } from "@supabase/supabase-js";
import { PROJECTS, type ProjectId } from "./projects";

export type WorkspaceAccessLevel = "owner" | "editor" | "viewer";
export type WorkspaceShareAccess = Exclude<WorkspaceAccessLevel, "owner">;

export interface WorkspaceSummary {
  id: string;
  name: string;
  owner_id: string;
  access_level: WorkspaceAccessLevel;
}

export interface WorkspaceShare {
  user_id: string;
  email: string;
  app: ProjectId;
  access_level: WorkspaceShareAccess;
}

const APP_IDS: readonly string[] = PROJECTS.map((project) => project.id);
const ACCESS_LEVELS: readonly string[] = ["owner", "editor", "viewer"];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function parseWorkspace(row: unknown): WorkspaceSummary {
  if (
    !isRecord(row) ||
    typeof row.id !== "string" ||
    typeof row.name !== "string" ||
    typeof row.owner_id !== "string" ||
    typeof row.access_level !== "string" ||
    !ACCESS_LEVELS.includes(row.access_level)
  )
    throw new Error("Unexpected workspace row");
  return {
    id: row.id,
    name: row.name,
    owner_id: row.owner_id,
    access_level: row.access_level as WorkspaceAccessLevel,
  };
}

function parseShare(row: unknown): WorkspaceShare {
  if (
    !isRecord(row) ||
    typeof row.user_id !== "string" ||
    typeof row.email !== "string" ||
    typeof row.app !== "string" ||
    !APP_IDS.includes(row.app) ||
    (row.access_level !== "viewer" && row.access_level !== "editor")
  )
    throw new Error("Unexpected workspace share row");
  return {
    user_id: row.user_id,
    email: row.email,
    app: row.app as ProjectId,
    access_level: row.access_level,
  };
}

/** Workspaces and their per-app sharing, shared by every app on the same Supabase project. */
export function createWorkspaceApi(client: SupabaseClient) {
  async function rpc(name: string, args: Record<string, unknown>) {
    const { data, error } = await client.rpc(name, args);
    if (error) throw new Error(error.message);
    return data as unknown;
  }
  function rows(data: unknown) {
    if (!Array.isArray(data)) throw new Error("Unexpected response");
    return data;
  }
  return {
    listWorkspaces: async (app: ProjectId) =>
      rows(await rpc("list_workspaces", { app_name: app })).map(parseWorkspace),
    createWorkspace: async (name: string) =>
      parseWorkspace({
        ...(await rpc("create_workspace", { workspace_name: name }).then((row) =>
          isRecord(row) ? row : {}
        )),
        access_level: "owner",
      }),
    listShares: async (workspace: string) =>
      rows(await rpc("list_workspace_shares", { workspace })).map(parseShare),
    share: (workspace: string, email: string, app: ProjectId, access: WorkspaceShareAccess) =>
      rpc("share_workspace", { workspace, account_email: email, app_name: app, access }),
    updateShare: (
      workspace: string,
      account: string,
      app: ProjectId,
      access: WorkspaceShareAccess
    ) => rpc("update_workspace_share", { workspace, account, app_name: app, access }),
    removeShare: (workspace: string, account: string, app: ProjectId) =>
      rpc("remove_workspace_share", { workspace, account, app_name: app }),
  };
}

export type WorkspaceApi = ReturnType<typeof createWorkspaceApi>;

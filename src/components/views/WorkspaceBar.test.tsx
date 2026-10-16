import { act, render, renderHook, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { SupabaseClient } from "@supabase/supabase-js";
import { WorkspaceBar } from "./WorkspaceBar";
import { useWorkspaceList } from "../../hooks/useWorkspaceList";
import { APP_LANGUAGES } from "../../lib/languages";
import { getWorkspaceLabels } from "../../lib/workspace-labels";
import {
  createWorkspaceApi,
  type WorkspaceApi,
  type WorkspaceShare,
  type WorkspaceSummary,
} from "../../lib/workspaces";

const labels = getWorkspaceLabels("en");
const OWNED: WorkspaceSummary = {
  id: "w1",
  name: "Digital",
  owner_id: "me",
  access_level: "owner",
};
const SHARED: WorkspaceSummary = { id: "w2", name: "Lead", owner_id: "x", access_level: "viewer" };

function fakeApi(initial: WorkspaceShare[] = []) {
  let shares = [...initial];
  const api = {
    listWorkspaces: vi.fn(async () => [OWNED, SHARED]),
    createWorkspace: vi.fn(async (name: string) => ({ ...OWNED, id: "w3", name })),
    listShares: vi.fn(async () => shares),
    share: vi.fn(async (_w: string, email: string, app: WorkspaceShare["app"], access) => {
      shares = [
        ...shares.filter((item) => !(item.email === email && item.app === app)),
        {
          user_id: shares.find((item) => item.email === email)?.user_id ?? `u-${email}`,
          email,
          app,
          access_level: access,
        },
      ];
    }),
    updateShare: vi.fn(async (_w: string, account: string, app: WorkspaceShare["app"], access) => {
      shares = shares.map((item) =>
        item.user_id === account && item.app === app ? { ...item, access_level: access } : item
      );
    }),
    removeShare: vi.fn(async (_w: string, account: string, app: WorkspaceShare["app"]) => {
      shares = shares.filter((item) => !(item.user_id === account && item.app === app));
    }),
  } satisfies WorkspaceApi;
  return api;
}

function renderBar(api: WorkspaceApi, value = OWNED.id) {
  const props = { onValueChange: vi.fn(), onCreated: vi.fn(), onSharesChanged: vi.fn() };
  render(
    <WorkspaceBar
      api={api}
      app="ladders"
      workspaces={[OWNED, SHARED]}
      value={value}
      labels={labels}
      {...props}
    />
  );
  return props;
}

describe("WorkspaceBar", () => {
  it("switches workspaces and only offers sharing to the owner", async () => {
    const props = renderBar(fakeApi());
    const trigger = screen.getByRole("button", { name: "Workspace" });
    expect(trigger).toHaveTextContent("Digital");
    expect(trigger).toHaveTextContent("Owner");
    expect(screen.getByRole("button", { name: "Share" })).toBeInTheDocument();
    await userEvent.click(trigger);
    await userEvent.click(screen.getByRole("menuitemradio", { name: "Lead" }));
    expect(props.onValueChange).toHaveBeenCalledWith("w2");
  });

  it("hides sharing from viewers", () => {
    renderBar(fakeApi(), SHARED.id);
    expect(screen.getByRole("button", { name: "Workspace" })).toHaveTextContent("Viewer");
    expect(screen.queryByRole("button", { name: "Share" })).not.toBeInTheDocument();
  });

  it("creates a workspace from its name", async () => {
    const api = fakeApi();
    const props = renderBar(api);
    await userEvent.click(screen.getByRole("button", { name: "Workspace" }));
    await userEvent.click(screen.getByRole("menuitem", { name: "New workspace" }));
    await userEvent.type(screen.getByLabelText("Name"), "  Growth ");
    await userEvent.click(screen.getByRole("button", { name: "Create" }));
    await waitFor(() =>
      expect(props.onCreated).toHaveBeenCalledWith(expect.objectContaining({ id: "w3" }))
    );
    expect(api.createWorkspace).toHaveBeenCalledWith("Growth");
  });

  it("shares per app, one row per person, and changes or removes each app", async () => {
    const api = fakeApi([
      { user_id: "u1", email: "ana@x.com", app: "planner", access_level: "viewer" },
      { user_id: "u1", email: "ana@x.com", app: "ladders", access_level: "editor" },
    ]);
    const props = renderBar(api);
    await userEvent.click(screen.getByRole("button", { name: "Share" }));
    const dialog = await screen.findByTestId("share-workspace-dialog");
    const row = await within(dialog).findByTestId("share-row");
    expect(within(row).getByLabelText("Ladders access for ana@x.com")).toHaveValue("editor");
    expect(within(row).getByLabelText("Planner access for ana@x.com")).toHaveValue("viewer");
    expect(within(row).getByLabelText("Pulse access for ana@x.com")).toHaveValue("");
    expect(within(dialog).getByLabelText("App")).toHaveValue("ladders");

    await userEvent.selectOptions(
      within(row).getByLabelText("Pulse access for ana@x.com"),
      "viewer"
    );
    await waitFor(() =>
      expect(api.share).toHaveBeenCalledWith("w1", "ana@x.com", "pulse", "viewer")
    );
    await userEvent.selectOptions(
      within(row).getByLabelText("Planner access for ana@x.com"),
      "editor"
    );
    await waitFor(() =>
      expect(api.updateShare).toHaveBeenCalledWith("w1", "u1", "planner", "editor")
    );
    await userEvent.selectOptions(within(row).getByLabelText("Ladders access for ana@x.com"), "");
    await waitFor(() => expect(api.removeShare).toHaveBeenCalledWith("w1", "u1", "ladders"));
    expect(props.onSharesChanged).toHaveBeenCalledTimes(3);

    await userEvent.type(within(dialog).getByLabelText("Email"), "Bo@X.com");
    await userEvent.selectOptions(within(dialog).getByLabelText("App"), "all");
    await userEvent.selectOptions(within(dialog).getByLabelText("Permission"), "editor");
    await userEvent.click(within(dialog).getByRole("button", { name: "Share" }));
    await waitFor(() => expect(within(dialog).getAllByTestId("share-row")).toHaveLength(2));
    for (const app of ["ladders", "planner", "pulse"])
      expect(api.share).toHaveBeenCalledWith("w1", "bo@x.com", app, "editor");

    await userEvent.click(within(dialog).getByRole("button", { name: "Remove bo@x.com" }));
    await waitFor(() => expect(within(dialog).getAllByTestId("share-row")).toHaveLength(1));
  });

  it("shows sharing errors inside the dialog", async () => {
    const api = fakeApi();
    api.share.mockRejectedValueOnce(new Error("No account found for that email"));
    renderBar(api);
    await userEvent.click(screen.getByRole("button", { name: "Share" }));
    const dialog = await screen.findByTestId("share-workspace-dialog");
    await within(dialog).findByText("Not shared with anyone yet.");
    await userEvent.type(within(dialog).getByLabelText("Email"), "nobody@x.com");
    await userEvent.click(within(dialog).getByRole("button", { name: "Share" }));
    expect(await within(dialog).findByRole("alert")).toHaveTextContent("No account found");
  });
});

describe("workspace labels", () => {
  it("ships the same copy in every app language and falls back to English", () => {
    const shape = (value: unknown): unknown =>
      typeof value === "object" && value !== null
        ? Object.fromEntries(Object.entries(value).map(([key, item]) => [key, shape(item)]))
        : typeof value;
    for (const { code } of APP_LANGUAGES)
      expect(shape(getWorkspaceLabels(code))).toEqual(shape(labels));
    expect(getWorkspaceLabels("ca").share).toBe("Compartir");
    expect(getWorkspaceLabels("de-AT").share).toBe("Teilen");
    expect(getWorkspaceLabels("ja")).toBe(labels);
  });
});

describe("createWorkspaceApi", () => {
  function client(data: unknown, error: unknown = null) {
    const rpc = vi.fn(async () => ({ data, error }));
    return { rpc, api: createWorkspaceApi({ rpc } as unknown as SupabaseClient) };
  }

  it("lists the workspaces of one app and shares through the generic RPCs", async () => {
    const { rpc, api } = client([OWNED]);
    await expect(api.listWorkspaces("pulse")).resolves.toEqual([OWNED]);
    expect(rpc).toHaveBeenCalledWith("list_workspaces", { app_name: "pulse" });
    await api.share("w1", "a@x.com", "planner", "editor");
    expect(rpc).toHaveBeenLastCalledWith("share_workspace", {
      workspace: "w1",
      account_email: "a@x.com",
      app_name: "planner",
      access: "editor",
    });
    await api.removeShare("w1", "u1", "ladders");
    expect(rpc).toHaveBeenLastCalledWith("remove_workspace_share", {
      workspace: "w1",
      account: "u1",
      app_name: "ladders",
    });
  });

  it("creates owned workspaces and rejects unexpected rows or errors", async () => {
    const created = { id: "w9", name: "New", owner_id: "me", plan_start_date: "2026-01-05" };
    await expect(client(created).api.createWorkspace("New")).resolves.toEqual({
      id: "w9",
      name: "New",
      owner_id: "me",
      access_level: "owner",
    });
    await expect(client([{ id: "w1" }]).api.listWorkspaces("ladders")).rejects.toThrow(
      "Unexpected workspace row"
    );
    await expect(
      client([{ user_id: "u", email: "e", app: "jira", access_level: "viewer" }]).api.listShares(
        "w1"
      )
    ).rejects.toThrow("Unexpected workspace share row");
    await expect(client(null, { message: "denied" }).api.listShares("w1")).rejects.toThrow(
      "denied"
    );
  });
});

describe("useWorkspaceList", () => {
  it("remembers the selected workspace per app and falls back to the first one", async () => {
    localStorage.clear();
    const api = fakeApi();
    const { result, unmount } = renderHook(() => useWorkspaceList(api, "pulse"));
    await waitFor(() => expect(result.current.workspace?.id).toBe("w1"));
    act(() => result.current.select("w2"));
    expect(result.current.workspace?.id).toBe("w2");
    unmount();
    const again = renderHook(() => useWorkspaceList(api, "pulse"));
    await waitFor(() => expect(again.result.current.workspace?.id).toBe("w2"));
    const ladders = renderHook(() => useWorkspaceList(api, "ladders"));
    await waitFor(() => expect(ladders.result.current.workspace?.id).toBe("w1"));
  });

  it("reports load errors", async () => {
    const api = fakeApi();
    api.listWorkspaces.mockRejectedValueOnce(new Error("offline"));
    const { result } = renderHook(() => useWorkspaceList(api, "planner"));
    await waitFor(() => expect(result.current.error).toBe("offline"));
    expect(result.current.loading).toBe(false);
  });
});

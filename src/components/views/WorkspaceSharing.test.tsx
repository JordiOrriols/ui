import { act, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { WorkspaceBar } from "./WorkspaceBar";
import { WorkspaceShareDialog, type WorkspaceSharingConfig } from "./WorkspaceShareDialog";
import { createDemoWorkspaceApi } from "../../lib/workspace-demo";
import { getWorkspaceLabels } from "../../lib/workspace-labels";
import type { WorkspaceAccessLevel, WorkspaceShare } from "../../lib/workspaces";

const labels = getWorkspaceLabels("en");
const entries: WorkspaceShare[] = [
  { user_id: "one", email: "reader@example.com", app: "planner", access_level: "viewer" },
  { user_id: "two", email: "other-app@example.com", app: "shiplog", access_level: "editor" },
];
function setup(access: WorkspaceAccessLevel = "owner", enabled = true) {
  const api = createDemoWorkspaceApi(entries);
  const listShares = vi.spyOn(api, "listShares");
  const sharing: WorkspaceSharingConfig = {
    readAccess: vi.fn(async () => entries),
    publicLink: {
      load: vi.fn(async () => (enabled ? "token" : null)),
      setEnabled: vi.fn(async (value) => (value ? "new-token" : null)),
      getUrl: (token) => `https://planner.example/#/roadmap/${token}`,
      description: "Anyone with the link can view this roadmap.",
    },
  };
  const view = render(
    <WorkspaceBar
      api={api}
      app="planner"
      workspaces={[{ id: "workspace", name: "Digital", owner_id: "owner", access_level: access }]}
      value="workspace"
      onValueChange={vi.fn()}
      onCreated={vi.fn()}
      labels={labels}
      sharing={sharing}
    />
  );
  return { api, sharing, listShares, ...view };
}
describe("unified workspace sharing", () => {
  it("keeps people-only sharing unchanged when no public link is configured", async () => {
    render(
      <WorkspaceShareDialog
        isOpen
        onClose={vi.fn()}
        api={createDemoWorkspaceApi(entries)}
        workspace={{ id: "workspace", name: "Digital" }}
        app="planner"
        labels={labels}
      />
    );
    expect(await screen.findByText("reader@example.com")).toBeVisible();
    expect(screen.getByLabelText("Email")).toBeVisible();
    expect(screen.queryByRole("tablist")).not.toBeInTheDocument();
  });
  it("supports keyboard tab selection without losing visible footer actions", async () => {
    setup();
    await userEvent.click(screen.getByTestId("workspace-share"));
    screen.getByRole("tab", { name: "Emails", exact: true }).focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "Link", exact: true })).toHaveAttribute(
      "aria-selected",
      "true"
    );
    expect(await screen.findByRole("textbox", { name: "Public link" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Close", exact: true })).toBeVisible();
    await userEvent.keyboard("{ArrowLeft}");
    expect(screen.getByLabelText("Email")).toBeVisible();
  });
  it("reports directory failures and retries without using owner-only access for a viewer", async () => {
    const { sharing, listShares } = setup("viewer");
    vi.mocked(sharing.readAccess).mockRejectedValueOnce(new Error("Cannot read access"));
    await userEvent.click(screen.getByTestId("workspace-share"));
    expect(await screen.findByRole("alert")).toHaveTextContent("Cannot read access");
    await userEvent.click(screen.getByRole("button", { name: "Retry" }));
    expect(await screen.findByText("reader@example.com")).toBeVisible();
    expect(listShares).not.toHaveBeenCalled();
  });
  it("does not report enabling success if the server returns no token", async () => {
    const { sharing } = setup("owner", false);
    vi.mocked(sharing.publicLink.setEnabled).mockResolvedValueOnce(null);
    await userEvent.click(screen.getByTestId("workspace-share"));
    await userEvent.click(screen.getByRole("tab", { name: "Link", exact: true }));
    await userEvent.click(await screen.findByRole("button", { name: "Enable public link" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("The public link is unavailable.");
    expect(screen.queryByRole("textbox", { name: "Public link" })).not.toBeInTheDocument();
  });
  it("defaults to Emails, loads links only in Link, and preserves an email draft across tabs", async () => {
    const { sharing } = setup();
    expect(sharing.publicLink.load).not.toHaveBeenCalled();
    await userEvent.click(screen.getByTestId("workspace-share"));
    const dialog = screen.getByTestId("share-workspace-dialog");
    const people = within(dialog).getByRole("region", { name: "People with access" });
    expect(screen.getByRole("tab", { name: "Emails", exact: true })).toHaveAttribute(
      "aria-selected",
      "true"
    );
    expect(within(people).getByLabelText("Email")).toBeVisible();
    await userEvent.type(within(people).getByLabelText("Email"), "draft@example.com");
    expect(sharing.publicLink.load).not.toHaveBeenCalled();
    expect(within(dialog).queryByRole("region", { name: "Public link" })).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole("tab", { name: "Link", exact: true }));
    const link = within(dialog).getByRole("region", { name: "Public link" });
    expect(await within(link).findByRole("textbox")).toHaveValue(
      "https://planner.example/#/roadmap/token"
    );
    expect(within(link).getByRole("button", { name: "Revoke public link" })).toBeVisible();
    await userEvent.click(screen.getByRole("tab", { name: "Emails", exact: true }));
    expect(screen.getByLabelText("Email")).toHaveValue("draft@example.com");
    await userEvent.click(screen.getByRole("button", { name: "Close", exact: true }));
    await userEvent.click(screen.getByTestId("workspace-share"));
    expect(screen.getByRole("tab", { name: "Emails", exact: true })).toHaveAttribute(
      "aria-selected",
      "true"
    );
  });
  it.each(["editor", "viewer"] as const)(
    "gives a %s read-only current-app access and link copying without mutations",
    async (access) => {
      const user = userEvent.setup();
      const { sharing, listShares } = setup(access);
      const clipboard = vi.spyOn(navigator.clipboard, "writeText").mockResolvedValue();
      await user.click(screen.getByTestId("workspace-share"));
      const dialog = screen.getByTestId("share-workspace-dialog");
      expect(await within(dialog).findByText("reader@example.com")).toBeVisible();
      expect(within(dialog).queryByText("other-app@example.com")).not.toBeInTheDocument();
      expect(within(dialog).queryByLabelText("Email")).not.toBeInTheDocument();
      expect(within(dialog).queryByRole("combobox")).not.toBeInTheDocument();
      expect(
        within(dialog).queryByRole("button", { name: /Remove|Enable|Revoke/ })
      ).not.toBeInTheDocument();
      await user.click(screen.getByRole("tab", { name: "Link", exact: true }));
      await user.click(await within(dialog).findByRole("button", { name: "Copy link" }));
      expect(clipboard).toHaveBeenCalledWith("https://planner.example/#/roadmap/token");
      expect(await within(dialog).findByRole("status")).toHaveTextContent("Link copied");
      expect(sharing.publicLink.setEnabled).not.toHaveBeenCalled();
      expect(listShares).not.toHaveBeenCalled();
      expect(sharing.readAccess).toHaveBeenCalledOnce();
    }
  );
  it("never enables a disabled public link for a viewer", async () => {
    const { sharing } = setup("viewer", false);
    await userEvent.click(screen.getByTestId("workspace-share"));
    await userEvent.click(screen.getByRole("tab", { name: "Link", exact: true }));
    expect(await screen.findByText(/Public access is disabled/)).toBeVisible();
    expect(screen.queryByRole("button", { name: "Enable public link" })).not.toBeInTheDocument();
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
    expect(sharing.publicLink.setEnabled).not.toHaveBeenCalled();
  });
  it("keeps restricted team members out of sharing even when public sharing is configured", () => {
    setup("member");
    expect(screen.queryByTestId("workspace-share")).not.toBeInTheDocument();
  });
  it("hides an open share dialog when switching to a restricted workspace", async () => {
    const { api, sharing, rerender } = setup();
    await userEvent.click(screen.getByTestId("workspace-share"));
    await userEvent.click(screen.getByRole("tab", { name: "Link", exact: true }));
    expect(await screen.findByRole("textbox", { name: "Public link" })).toBeVisible();
    vi.mocked(sharing.publicLink.load).mockClear();
    rerender(
      <WorkspaceBar
        api={api}
        app="planner"
        workspaces={[
          { id: "restricted", name: "Restricted", owner_id: "other", access_level: "member" },
        ]}
        value="restricted"
        onValueChange={vi.fn()}
        onCreated={vi.fn()}
        labels={labels}
        sharing={sharing}
      />
    );
    expect(screen.queryByTestId("workspace-share")).not.toBeInTheDocument();
    expect(screen.queryByTestId("share-workspace-dialog")).not.toBeInTheDocument();
    expect(sharing.readAccess).not.toHaveBeenCalled();
    expect(sharing.publicLink.load).not.toHaveBeenCalled();
  });
  it("lets owners enable, cancel revocation and revoke the public link", async () => {
    const { sharing } = setup("owner", false);
    await userEvent.click(screen.getByTestId("workspace-share"));
    await userEvent.click(screen.getByRole("tab", { name: "Link", exact: true }));
    await userEvent.click(await screen.findByRole("button", { name: "Enable public link" }));
    expect(await screen.findByRole("textbox", { name: "Public link" })).toHaveValue(
      "https://planner.example/#/roadmap/new-token"
    );
    await userEvent.click(screen.getByRole("button", { name: "Revoke public link" }));
    await userEvent.click(
      within(screen.getByTestId("confirm-dialog")).getByRole("button", { name: "Close" })
    );
    expect(sharing.publicLink.setEnabled).toHaveBeenCalledTimes(1);
    await userEvent.click(screen.getByRole("button", { name: "Revoke public link" }));
    await userEvent.click(
      within(screen.getByTestId("confirm-dialog")).getByRole("button", {
        name: "Revoke public link",
      })
    );
    expect(await screen.findByText(/Public access is disabled/)).toBeVisible();
    expect(sharing.publicLink.setEnabled).toHaveBeenLastCalledWith(false);
  });
  it("shows failed loads and allows retry without reporting a disabled link", async () => {
    const { sharing } = setup();
    vi.mocked(sharing.publicLink.load).mockRejectedValueOnce(new Error("Cannot load link"));
    await userEvent.click(screen.getByTestId("workspace-share"));
    await userEvent.click(screen.getByRole("tab", { name: "Link", exact: true }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Cannot load link");
    expect(screen.queryByText(/Public access is disabled/)).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Retry" }));
    expect(await screen.findByRole("textbox", { name: "Public link" })).toBeVisible();
  });
  it("does not claim clipboard success or clear an enabled link on failures", async () => {
    const user = userEvent.setup();
    const { sharing } = setup();
    vi.spyOn(navigator.clipboard, "writeText").mockRejectedValue(new Error("Clipboard denied"));
    await user.click(screen.getByTestId("workspace-share"));
    await user.click(screen.getByRole("tab", { name: "Link", exact: true }));
    await user.click(await screen.findByRole("button", { name: "Copy link" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Clipboard denied");
    expect(screen.queryByText("Link copied")).not.toBeInTheDocument();
    vi.mocked(sharing.publicLink.setEnabled).mockRejectedValueOnce(new Error("Cannot revoke"));
    await user.click(screen.getByRole("button", { name: "Revoke public link" }));
    await user.click(
      within(screen.getByTestId("confirm-dialog")).getByRole("button", {
        name: "Revoke public link",
      })
    );
    expect(await screen.findByRole("alert")).toHaveTextContent("Cannot revoke");
    expect(screen.getByRole("textbox", { name: "Public link" })).toHaveValue(
      "https://planner.example/#/roadmap/token"
    );
  });
  it("ignores an old workspace load when the dialog moves to another workspace", async () => {
    let resolve!: (token: string) => void;
    const config: WorkspaceSharingConfig = {
      readAccess: async () => [],
      publicLink: {
        load: () =>
          new Promise((done) => {
            resolve = done;
          }),
        setEnabled: async () => null,
        getUrl: (token) => `https://example.com/${token}`,
        description: "Read-only link",
      },
    };
    const props = {
      api: createDemoWorkspaceApi(),
      isOpen: true,
      onClose: vi.fn(),
      app: "planner" as const,
      labels,
      canManage: false,
    };
    const { rerender } = render(
      <WorkspaceShareDialog
        {...props}
        workspace={{ id: "first", name: "First" }}
        sharing={config}
      />
    );
    await userEvent.click(screen.getByRole("tab", { name: "Link", exact: true }));
    await waitFor(() => expect(resolve).toBeDefined());
    const next = { ...config, publicLink: { ...config.publicLink, load: async () => "second" } };
    rerender(
      <WorkspaceShareDialog
        {...props}
        workspace={{ id: "second", name: "Second" }}
        sharing={next}
      />
    );
    await userEvent.click(screen.getByRole("tab", { name: "Link", exact: true }));
    expect(await screen.findByRole("textbox", { name: "Public link" })).toHaveValue(
      "https://example.com/second"
    );
    await act(async () => resolve("first"));
    expect(screen.getByRole("textbox", { name: "Public link" })).toHaveValue(
      "https://example.com/second"
    );
  });
});

import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it, vi } from "vitest";
import { createDemoWorkspaceApi } from "../../lib/workspace-demo";
import { WorkspaceSetup } from "./WorkspaceSetup";

it("never creates a workspace automatically and allows waiting or later creation", async () => {
  const api = createDemoWorkspaceApi();
  const create = vi.spyOn(api, "createWorkspace");
  const onCreated = vi.fn();
  const refresh = vi.fn(async () => {});
  render(<WorkspaceSetup api={api} language="en" onCreated={onCreated} onRefresh={refresh} />);
  expect(create).not.toHaveBeenCalled();
  await userEvent.click(screen.getByRole("button", { name: "Wait for an invitation" }));
  expect(screen.getByRole("heading")).toHaveTextContent("Waiting for an invitation");
  await userEvent.click(screen.getByRole("button", { name: "Check invitations" }));
  expect(refresh).toHaveBeenCalledOnce();
  await userEvent.click(screen.getByRole("button", { name: "Create", exact: true }));
  await userEvent.type(screen.getByLabelText("Name"), "My team");
  await userEvent.click(screen.getByTestId("team-name-submit"));
  await waitFor(() => expect(onCreated).toHaveBeenCalled());
  expect(create).toHaveBeenCalledWith("My team");
});

it("polls invitations only after choosing to wait and stops on unmount", async () => {
  const refresh = vi.fn(async () => {});
  vi.useFakeTimers();
  try {
    const view = render(
      <WorkspaceSetup
        api={createDemoWorkspaceApi()}
        language="es"
        onCreated={vi.fn()}
        onRefresh={refresh}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: "Esperar una invitación" }));
    await act(async () => {
      await vi.advanceTimersByTimeAsync(15_000);
    });

    expect(refresh).toHaveBeenCalledOnce();
    view.unmount();
    await vi.advanceTimersByTimeAsync(15_000);
    expect(refresh).toHaveBeenCalledOnce();
  } finally {
    vi.useRealTimers();
  }
});

it("shows invitation refresh failures without creating a workspace", async () => {
  const api = createDemoWorkspaceApi();
  const create = vi.spyOn(api, "createWorkspace");
  render(
    <WorkspaceSetup
      api={api}
      language="en"
      onCreated={vi.fn()}
      onRefresh={async () => {
        throw new Error("Invitation check failed");
      }}
    />
  );
  await userEvent.click(screen.getByRole("button", { name: "Wait for an invitation" }));
  await userEvent.click(screen.getByRole("button", { name: "Check invitations" }));
  expect(await screen.findByRole("alert")).toHaveTextContent("Invitation check failed");
  expect(create).not.toHaveBeenCalled();
});

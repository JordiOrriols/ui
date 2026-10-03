import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { RadarChart } from "./RadarChart";
import { ProfileCard } from "./ProfileCard";
import { CommentGroups } from "./CommentGroups";
import { ShareAccessDialog } from "./ShareAccessDialog";
import { useShareAccessForm } from "../../hooks/useShareAccessForm";
import { LevelSelector, type LevelSelectorProps } from "./LevelSelector";
import { ReferenceDialog } from "./ReferenceDialog";

describe("schema-independent copied views", () => {
  it("supports local expansion and the original whole/half/clear selection cycle", async () => {
    const current = vi.fn(),
      goal = vi.fn(),
      comment = vi.fn();
    const props: LevelSelectorProps = {
      id: "custom",
      title: "Custom",
      options: [{ value: 1, name: "First", description: "Description" }],
      summary: <p>Summary</p>,
      ariaLabel: "Custom levels",
      className: "",
      accentClassName: "",
      currentLevel: 0,
      goalLevel: 0,
      onCurrentChange: current,
      onGoalChange: goal,
      onCommentChange: comment,
      labels: {
        current: "Current",
        currentPlus: "Current+",
        goal: "Goal",
        goalPlus: "Goal+",
        self: "Self",
        comments: "Comments",
        commentsPlaceholder: "Notes",
      },
    };
    const { rerender } = render(<LevelSelector {...props} />);
    expect(screen.queryByText("First")).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Custom levels" }));
    await userEvent.click(screen.getByTestId("level-current-custom-1"));
    expect(current).toHaveBeenLastCalledWith(1);
    rerender(<LevelSelector {...props} currentLevel={1} />);
    await userEvent.click(screen.getByTestId("level-current-custom-1"));
    expect(current).toHaveBeenLastCalledWith(1.5);
    rerender(<LevelSelector {...props} currentLevel={1.5} />);
    await userEvent.click(screen.getByTestId("level-current-custom-1"));
    expect(current).toHaveBeenLastCalledWith(0);
    await userEvent.click(screen.getByTestId("level-goal-custom-1"));
    expect(goal).toHaveBeenLastCalledWith(1);
    await userEvent.type(screen.getByLabelText("Comments"), "A");
    expect(comment).toHaveBeenCalledWith("A");
  });
  it("honors host-controlled expansion and hides goal actions", async () => {
    const toggle = vi.fn();
    render(
      <LevelSelector
        id="custom"
        title="Custom"
        options={[]}
        summary={null}
        ariaLabel="Custom levels"
        className=""
        accentClassName=""
        currentLevel={0}
        goalLevel={0}
        onCurrentChange={() => {}}
        onGoalChange={() => {}}
        expanded={false}
        onToggle={toggle}
        hideGoal
        labels={{
          current: "Current",
          currentPlus: "Current+",
          goal: "Goal",
          goalPlus: "Goal+",
          self: "Self",
          comments: "Comments",
          commentsPlaceholder: "Notes",
        }}
      />
    );
    await userEvent.click(screen.getByRole("button", { name: "Custom levels" }));
    expect(toggle).toHaveBeenCalledOnce();
    expect(screen.getByRole("button")).toHaveAttribute("aria-expanded", "false");
  });
  it("preserves reference layout, content and escape/overlay closing", async () => {
    const close = vi.fn();
    const { rerender } = render(
      <ReferenceDialog isOpen onClose={close} title="Reference" closeLabel="Close">
        <p>Content</p>
      </ReferenceDialog>
    );
    expect(screen.getByRole("dialog")).toHaveAccessibleName("Reference");
    await userEvent.click(screen.getByText("Content"));
    expect(close).not.toHaveBeenCalled();
    await userEvent.keyboard("{Escape}");
    expect(close).toHaveBeenCalledOnce();
    await userEvent.click(screen.getByRole("dialog").parentElement!);
    expect(close).toHaveBeenCalledTimes(2);
    rerender(
      <ReferenceDialog isOpen={false} onClose={close} title="Reference" closeLabel="Close">
        <p>Content</p>
      </ReferenceDialog>
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
  it("renders arbitrary radar axes, orders primary series last, hides empty series and delegates download", async () => {
    const download = vi.fn();
    const { container } = render(
      <RadarChart
        axes={["A", "B", "C"]}
        label="Metrics"
        maxLevel={3}
        downloadLabel="Download"
        onDownload={download}
        series={[
          { id: "main", label: "Main", color: "#10b981", levels: { A: 2 }, primary: true },
          { id: "secondary", label: "Secondary", color: "#fbbf24", levels: { B: 3 }, dashed: true },
          { id: "empty", label: "Empty", color: "#64748b", levels: {} },
        ]}
      />
    );
    expect(screen.getByRole("img")).toHaveAccessibleName("Metrics");
    expect(container.querySelectorAll("path[data-series]")).toHaveLength(2);
    expect(container.querySelectorAll("path[data-series]")[1]).toHaveAttribute(
      "data-series",
      "main"
    );
    expect(screen.queryByText("Empty")).not.toBeInTheDocument();
    expect(screen.getByText("A")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Download" }));
    expect(download).toHaveBeenCalledWith(screen.getByRole("img"), 300);
  });
  it("updates chart geometry when label visibility changes, keeping responsive sizing", () => {
    const { container, rerender } = render(
      <RadarChart axes={["A", "B", "C"]} series={[]} label="Metrics" size={180} />
    );
    const before = container.querySelector("path")?.getAttribute("d");
    rerender(
      <RadarChart
        axes={["A", "B", "C"]}
        series={[]}
        label="Metrics"
        size={180}
        showLabels={false}
      />
    );
    expect(container.querySelector("path")?.getAttribute("d")).not.toBe(before);
    expect(screen.getByRole("img")).toHaveAttribute("viewBox", "0 0 180 180");
  });
  it("stops edit/delete propagation and hides actions for read-only cards", async () => {
    const edit = vi.fn(),
      remove = vi.fn(),
      select = vi.fn();
    const props = {
      id: "one",
      name: "Ada",
      onEdit: edit,
      onDelete: remove,
      onClick: select,
      editLabel: "Edit",
      deleteLabel: "Delete",
    };
    const { rerender } = render(
      <ProfileCard {...props}>
        <p>Card content</p>
      </ProfileCard>
    );
    await userEvent.click(screen.getByRole("button", { name: "Edit" }));
    await userEvent.click(screen.getByRole("button", { name: "Delete" }));
    expect(edit).toHaveBeenCalledOnce();
    expect(remove).toHaveBeenCalledOnce();
    expect(select).not.toHaveBeenCalled();
    rerender(<ProfileCard {...props} readOnly />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
  it("filters blank comments using host-defined categories", () => {
    render(
      <CommentGroups
        title="Notes"
        categories={["Custom", "Blank"]}
        groups={[
          {
            id: "one",
            label: "Author",
            color: "#10b981",
            comments: { Custom: "  A note  ", Blank: "  " },
          },
        ]}
      />
    );
    expect(screen.getByText("Custom")).toBeInTheDocument();
    expect(screen.getByText("A note")).toBeInTheDocument();
    expect(screen.queryByText("Blank")).not.toBeInTheDocument();
  });
  it("hides an empty comment group", () => {
    const { container } = render(
      <CommentGroups title="Notes" categories={["Custom"]} groups={[]} />
    );
    expect(container).toBeEmptyDOMElement();
  });
  it("shares normalized emails with arbitrary access values and delegates access/removal", async () => {
    const share = vi.fn(async () => {}),
      change = vi.fn(async () => {}),
      remove = vi.fn(async () => {});
    function Example() {
      const form = useShareAccessForm<"reader" | "writer">({
        isOpen: true,
        initialAccess: "reader",
        onShare: share,
        onChangeAccess: change,
        onRemove: remove,
      });
      return (
        <ShareAccessDialog
          isOpen
          onClose={() => {}}
          form={form}
          entries={[{ id: "ada", email: "ada@example.com", access: "reader" }]}
          options={[
            { value: "reader", label: "Read" },
            { value: "writer", label: "Write" },
          ]}
          labels={{
            title: "Share",
            description: "Manage access",
            email: "Email",
            permission: "Permission",
            share: "Invite",
            loading: "Loading",
            empty: "Nobody",
            close: "Close",
            permissionFor: (email) => `Permission for ${email}`,
            remove: (email) => `Remove ${email}`,
          }}
        />
      );
    }
    render(<Example />);
    await userEvent.type(screen.getByLabelText("Email"), "NEW@EXAMPLE.COM");
    await userEvent.selectOptions(screen.getByLabelText("Permission"), "writer");
    await userEvent.click(screen.getByRole("button", { name: "Invite" }));
    expect(share).toHaveBeenCalledWith("new@example.com", "writer");
    expect(screen.getByLabelText("Email")).toHaveValue("");
    await userEvent.selectOptions(
      screen.getByLabelText("Permission for ada@example.com"),
      "writer"
    );
    expect(change).toHaveBeenCalledWith("ada", "writer");
    await userEvent.click(screen.getByRole("button", { name: "Remove ada@example.com" }));
    expect(remove).toHaveBeenCalledWith("ada");
  });
});

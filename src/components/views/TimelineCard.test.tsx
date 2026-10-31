import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TimelineBar, TimelineCard } from "./TimelineCard";

const columns = Array.from({ length: 4 }, (_, i) => ({
  id: String(i),
  label: String(i + 1),
  group: i < 2 ? "October" : "November",
}));
describe("TimelineCard", () => {
  it("renders grouped headers, every member including empty rows, and accessible bars", () => {
    render(
      <TimelineCard
        aria-label="Vacations"
        columns={columns}
        labelTitle="Member"
        columnTitle="Day"
        rows={[
          {
            id: "a",
            label: "Anna",
            accessibleLabel: "Anna",
            group: { id: "team", label: "Platform" },
            spans: [{ id: "v", label: "Anna vacation", start: 1, end: 3 }],
          },
          {
            id: "b",
            label: "Jordi",
            accessibleLabel: "Jordi",
            group: { id: "team", label: "Platform" },
            spans: [],
          },
        ]}
      />
    );
    expect(screen.getByRole("region", { name: "Vacations" })).toBeVisible();
    expect(screen.getAllByRole("heading", { name: "Platform" })).toHaveLength(1);
    expect(screen.getByText("Platform")).toHaveClass("sticky", "z-10", "bg-muted");
    expect(screen.getByText("Anna")).toHaveClass("sticky", "z-10", "bg-card");
    expect(screen.getByText("Jordi")).toBeVisible();
    expect(screen.getByText("November")).toBeVisible();
    expect(screen.getByRole("img", { name: "Anna vacation" })).toHaveStyle({
      left: "25%",
      width: "50%",
    });
  });
  it("clips fractional spans and omits out-of-range or zero-length spans", () => {
    const { rerender } = render(
      <TimelineBar columnCount={4} span={{ id: "v", label: "Vacation", start: -1, end: 0.5 }} />
    );
    expect(screen.getByRole("img")).toHaveStyle({ left: "0%", width: "12.5%" });
    rerender(
      <TimelineBar columnCount={4} span={{ id: "v", label: "Vacation", start: 4, end: 5 }} />
    );
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    rerender(
      <TimelineBar columnCount={0} span={{ id: "v", label: "Vacation", start: 0, end: 1 }} />
    );
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });
  it("filters outside markers and preserves custom interactive rows", () => {
    render(
      <TimelineCard
        aria-label="Roadmap"
        columns={columns}
        labelTitle="Feature"
        columnTitle="Week"
        markers={[
          { id: "inside", label: "Today", caption: "Today", position: 1.5 },
          { id: "outside", label: "Outside", caption: "Outside", position: 4 },
        ]}
      >
        <button>Custom feature action</button>
      </TimelineCard>
    );
    expect(screen.getByRole("img", { name: "Today" })).toHaveStyle({ left: "37.5%" });
    expect(screen.queryByRole("img", { name: "Outside" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Custom feature action" })).toBeEnabled();
  });
});

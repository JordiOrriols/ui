import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Button, buttonVariants } from "../button";
import { configureAnalytics, type AnalyticsSink } from "@/utils/analytics";
import { createRef } from "react";

describe("Button", () => {
  let events: Array<{ eventId: string; eventData?: Record<string, unknown> }>;

  beforeEach(() => {
    events = [];
    configureAnalytics((eventId, eventData) => {
      events.push({ eventId, eventData });
    });
  });

  afterEach(() => {
    configureAnalytics();
  });

  describe("rendering", () => {
    it("renders a button element by default", () => {
      render(<Button>Click me</Button>);

      const button = screen.getByRole("button", { name: "Click me" });
      expect(button).toBeInTheDocument();
      expect(button.tagName).toBe("BUTTON");
    });

    it("exposes variant and size as data attributes", () => {
      render(
        <Button variant="outline" size="sm">
          Save
        </Button>
      );

      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("data-slot", "button");
      expect(button).toHaveAttribute("data-variant", "outline");
      expect(button).toHaveAttribute("data-size", "sm");
    });

    it("defaults to the default variant and size", () => {
      render(<Button>Default</Button>);

      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("data-variant", "default");
      expect(button).toHaveAttribute("data-size", "default");
    });

    it("forwards native button props", () => {
      render(
        <Button type="submit" disabled aria-label="Submit form">
          Save
        </Button>
      );

      const button = screen.getByRole("button", { name: "Submit form" });
      expect(button).toHaveAttribute("type", "submit");
      expect(button).toBeDisabled();
    });

    it("accepts a className and merges it last", () => {
      render(<Button className="w-full">Wide</Button>);

      const button = screen.getByRole("button");
      expect(button.className).toContain("w-full");
      expect(button.className).toContain("inline-flex");
    });

    it("does not fire analytics when no eventId is given", async () => {
      const user = userEvent.setup();
      render(<Button>Quiet</Button>);

      await user.click(screen.getByRole("button"));

      expect(events).toHaveLength(0);
    });
  });

  describe("asChild", () => {
    it("shares hover and focus tooltips without adding layout wrappers", async () => {
      const ref = createRef<HTMLButtonElement>();
      const user = userEvent.setup();
      const { container } = render(
        <Button ref={ref} size="icon" aria-label="Edit">
          <svg />
        </Button>
      );
      const button = screen.getByRole("button", { name: "Edit" });
      expect(ref.current).toBe(button);
      expect(container.firstElementChild).toBe(button);
      await user.hover(button);
      expect(await screen.findByRole("tooltip")).toHaveTextContent("Edit");
      await user.keyboard("{Escape}");
      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
      await user.unhover(button);
      await user.tab();
      expect(await screen.findByRole("tooltip")).toHaveTextContent("Edit");
    });

    it("keeps link semantics and tooltips when slotted into anchors", async () => {
      render(
        <Button asChild size="icon" aria-label="Contribute">
          <a href="#repository">
            <svg />
          </a>
        </Button>
      );
      const link = screen.getByRole("link", { name: "Contribute" });
      await userEvent.hover(link);
      expect(await screen.findByRole("tooltip")).toHaveTextContent("Contribute");
      expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });

    it("upgrades icon titles to accessible shared tooltips without native duplicates", async () => {
      render(
        <Button size="icon" title="Download">
          <svg />
        </Button>
      );
      const button = screen.getByRole("button", { name: "Download" });
      expect(button).not.toHaveAttribute("title");
      await userEvent.hover(button);
      expect(await screen.findByRole("tooltip")).toHaveTextContent("Download");
    });

    it("keeps a disabled icon's explanation available without enabling its action", async () => {
      const onClick = vi.fn();
      render(
        <Button
          disabled
          size="icon"
          aria-label="Delete"
          title="Remove its features first"
          onClick={onClick}
        >
          <svg />
        </Button>
      );
      const button = screen.getByRole("button", { name: "Delete" });
      await userEvent.hover(button);
      expect(await screen.findByRole("tooltip")).toHaveTextContent(
        "Delete: Remove its features first"
      );
      await userEvent.click(button);
      expect(onClick).not.toHaveBeenCalled();
      expect(button).toBeDisabled();
    });

    it("preserves accessible names and fires an icon action exactly once", async () => {
      const onClick = vi.fn();
      render(
        <Button
          size="icon"
          aria-label="Approve"
          tooltip="Approve release"
          eventId="approve"
          onClick={onClick}
        >
          <svg />
        </Button>
      );
      const button = screen.getByRole("button", { name: "Approve" });
      await userEvent.hover(button);
      expect(await screen.findByRole("tooltip")).toHaveTextContent("Approve release");
      await userEvent.click(button);
      expect(onClick).toHaveBeenCalledOnce();
      expect(events).toHaveLength(1);
    });

    it("renders the child element instead of a button", () => {
      render(
        <Button asChild>
          <a href="#target">Navigate</a>
        </Button>
      );

      const link = screen.getByRole("link", { name: "Navigate" });
      expect(link).toBeInTheDocument();
      expect(link.tagName).toBe("A");
      expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });

    it("still reports analytics from the child element", async () => {
      const user = userEvent.setup();
      render(
        <Button asChild eventId="link_click">
          <a href="#target">Navigate</a>
        </Button>
      );

      await user.click(screen.getByRole("link"));

      expect(events).toHaveLength(1);
      expect(events[0]?.eventId).toBe("link_click");
    });
  });

  describe("analytics", () => {
    it("reports a button_click tagged event on click", async () => {
      const user = userEvent.setup();
      render(<Button eventId="save_button">Save</Button>);

      await user.click(screen.getByRole("button"));

      expect(events).toHaveLength(1);
      expect(events[0]?.eventId).toBe("save_button");
      expect(events[0]?.eventData).toEqual({ type: "button_click" });
    });

    it("merges eventData into the reported payload", async () => {
      const user = userEvent.setup();
      render(
        <Button eventId="team_publish" eventData={{ teamId: 7, draft: true }}>
          Publish
        </Button>
      );

      await user.click(screen.getByRole("button"));

      expect(events[0]?.eventData).toEqual({
        type: "button_click",
        teamId: 7,
        draft: true,
      });
    });

    it("calls the consumer onClick handler as well", async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      render(
        <Button eventId="save_button" onClick={onClick}>
          Save
        </Button>
      );

      await user.click(screen.getByRole("button"));

      expect(onClick).toHaveBeenCalledTimes(1);
      expect(events).toHaveLength(1);
    });

    it("does not report events for disabled buttons", async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      render(
        <Button eventId="save_button" disabled onClick={onClick}>
          Save
        </Button>
      );

      await user.click(screen.getByRole("button"));

      expect(events).toHaveLength(0);
      expect(onClick).not.toHaveBeenCalled();
    });
  });

  describe("buttonVariants", () => {
    it("produces class names for every variant and size", () => {
      expect(buttonVariants({ variant: "default", size: "default" })).toContain("bg-primary");
      expect(buttonVariants({ variant: "destructive" })).toContain("bg-destructive");
      expect(buttonVariants({ variant: "outline" })).toContain("border");
      expect(buttonVariants({ variant: "secondary" })).toContain("bg-secondary");
      expect(buttonVariants({ variant: "ghost" })).toContain("hover:bg-accent");
      expect(buttonVariants({ variant: "link" })).toContain("underline-offset-4");
    });

    it("maps icon sizes to square dimensions", () => {
      expect(buttonVariants({ size: "icon" })).toContain("size-9");
      expect(buttonVariants({ size: "icon-sm" })).toContain("size-8");
      expect(buttonVariants({ size: "icon-lg" })).toContain("size-10");
    });
  });
});

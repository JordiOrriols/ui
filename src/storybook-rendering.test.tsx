import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import type { ReactNode } from "react";
import * as radix from "./radix";

type RadixStoryModule = {
  Interactive: { render: () => ReactNode };
};

const modules = import.meta.glob<RadixStoryModule>("./radix-stories/*.stories.tsx", {
  eager: true,
});

beforeAll(() => {
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
  );
});

afterAll(() => vi.unstubAllGlobals());

function renderStory(name: keyof typeof radix) {
  const filename = name.replace(/^unstable_/, "");
  const module = modules[`./radix-stories/${filename}.stories.tsx`];
  if (!module) throw new Error(`Missing Radix story for ${name}`);
  return render(<>{module.Interactive.render()}</>);
}

describe("Official Radix story rendering", () => {
  for (const name of Object.keys(radix) as (keyof typeof radix)[]) {
    it(`${name} mounts a real example`, async () => {
      renderStory(name);
      await waitFor(() => {
        expect(
          document.body.textContent?.trim() ||
            document.body.querySelector("input, button, svg, [role]")
        ).toBeTruthy();
      });
    });
  }
});

describe("Official Radix story interactions", () => {
  it("toggles accordion content", async () => {
    renderStory("Accordion");
    const user = userEvent.setup();
    const trigger = screen.getByRole("button", { name: "Account details" });
    await user.click(trigger);
    expect(screen.getByText("Interactive accordion content.")).toBeVisible();
    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("opens and cancels the confirmation dialog", async () => {
    renderStory("AlertDialog");
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Delete item" }));
    expect(screen.getByRole("alertdialog", { name: "Delete this item?" })).toBeVisible();
    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
  });

  it("opens and closes the dialog", async () => {
    renderStory("Dialog");
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Open dialog" }));
    expect(screen.getByRole("dialog", { name: "Project details" })).toBeVisible();
    await user.click(screen.getByRole("button", { name: "Close" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("toggles checkbox state", async () => {
    renderStory("Checkbox");
    const checkbox = screen.getByRole("checkbox", { name: "Accept the terms" });
    expect(checkbox).not.toBeChecked();
    await userEvent.click(checkbox);
    expect(checkbox).toBeChecked();
  });

  it("reveals collapsible content", async () => {
    renderStory("Collapsible");
    await userEvent.click(screen.getByRole("button", { name: "Show more" }));
    expect(screen.getByText("Expanded content is now visible.")).toBeVisible();
  });

  it("switches tab panels", async () => {
    renderStory("Tabs");
    await userEvent.click(screen.getByRole("tab", { name: "Activity" }));
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Recent project activity.");
  });

  it("changes the radio selection", async () => {
    renderStory("RadioGroup");
    await userEvent.click(screen.getByRole("radio", { name: "Express" }));
    expect(screen.getByRole("radio", { name: "Express" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "Standard" })).not.toBeChecked();
  });

  it("changes switch state", async () => {
    renderStory("Switch");
    const control = screen.getByRole("switch", { name: "Notifications" });
    await userEvent.click(control);
    expect(control).toBeChecked();
  });

  it("moves the slider with the keyboard", async () => {
    renderStory("Slider");
    const slider = screen.getByRole("slider", { name: "Volume" });
    slider.focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(slider).toHaveAttribute("aria-valuenow", "36");
  });

  it("focuses the input through its label", async () => {
    renderStory("Label");
    await userEvent.click(screen.getByText("Email address"));
    expect(screen.getByRole("textbox", { name: "Email address" })).toHaveFocus();
  });

  it("shows the tooltip on keyboard focus", async () => {
    renderStory("Tooltip");
    await userEvent.tab();
    expect(await screen.findByRole("tooltip", { name: "Helpful information" })).toBeInTheDocument();
  });

  it("changes toggle state", async () => {
    renderStory("Toggle");
    const toggle = screen.getByRole("button", { name: "Bold" });
    await userEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-pressed", "true");
  });

  it("changes toggle-group selection", async () => {
    renderStory("ToggleGroup");
    await userEvent.click(screen.getByRole("radio", { name: "Align center" }));
    expect(screen.getByRole("radio", { name: "Align center" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "Align left" })).not.toBeChecked();
  });

  it("shows, dismisses and reopens the toast", async () => {
    renderStory("Toast");
    const user = userEvent.setup();
    expect(screen.queryByText("Changes saved")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Show toast" }));
    expect(screen.getByText("Changes saved")).toBeVisible();
    screen.getByRole("button", { name: "Dismiss notification" }).focus();
    await user.keyboard("{Enter}");
    expect(screen.queryByText("Changes saved")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Show toast" }));
    expect(screen.getByText("Changes saved")).toBeVisible();
  });

  it("accepts a complete six-digit code and rejects letters", async () => {
    renderStory("unstable_OneTimePasswordField");
    expect(screen.getAllByRole("textbox")).toHaveLength(6);
    await userEvent.type(screen.getByRole("textbox", { name: "Digit 1" }), "a123456");
    expect(screen.getByLabelText("Entered code")).toHaveTextContent("123456");
    for (let index = 0; index < 6; index++) {
      expect(screen.getByRole("textbox", { name: `Digit ${index + 1}` })).toHaveValue(
        String(index + 1)
      );
    }
  });

  it("reveals and conceals the password", async () => {
    renderStory("unstable_PasswordToggleField");
    const user = userEvent.setup();
    const input = screen.getByLabelText("Password");
    expect(input).toHaveAttribute("type", "password");
    await user.click(screen.getByRole("button", { name: "Show password" }));
    expect(input).toHaveAttribute("type", "text");
    await user.click(screen.getByRole("button", { name: "Hide password" }));
    expect(input).toHaveAttribute("type", "password");
  });
});

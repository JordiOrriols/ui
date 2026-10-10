import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AlertModal } from "./AlertModal";
import { AppFooter } from "./AppFooter";

describe("Shared feedback and footer", () => {
  it("provides an accessible alert with a focused dismissal action", async () => {
    const onClose = vi.fn();
    render(
      <AlertModal
        isOpen
        title="Link copied"
        description="Keep the link private."
        closeLabel="OK"
        onClose={onClose}
      />
    );
    expect(screen.getByRole("alertdialog", { name: "Link copied" })).toHaveAccessibleDescription(
      "Keep the link private."
    );
    await userEvent.click(screen.getByRole("button", { name: "OK" }));
    expect(onClose).toHaveBeenCalledOnce();
  });
  it("does not render a closed alert", () => {
    render(
      <AlertModal
        isOpen={false}
        title="Link copied"
        description="Done"
        closeLabel="OK"
        onClose={vi.fn()}
      />
    );
    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
  });
  it("renders footer attribution and supports host translations", () => {
    const { rerender } = render(<AppFooter />);
    expect(screen.getByRole("contentinfo")).toHaveTextContent("Made with love by Jordi Orriols");
    rerender(<AppFooter text="Fet amb amor per Jordi Orriols" />);
    expect(screen.getByRole("contentinfo")).toHaveTextContent("Fet amb amor per Jordi Orriols");
  });
});

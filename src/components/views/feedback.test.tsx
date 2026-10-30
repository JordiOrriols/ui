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
  it.each(["ladders", "planner", "pulse", "shiplog"] as const)(
    "links the %s footer icon to its repository with a shared tooltip",
    async (projectId) => {
      render(<AppFooter projectId={projectId} />);
      const link = screen.getByRole("link", { name: "Contribute on GitHub" });
      expect(link).toHaveAttribute("href", `https://github.com/JordiOrriols/${projectId}`);
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
      expect(link).toHaveTextContent("");
      await userEvent.hover(link);
      expect(await screen.findByRole("tooltip")).toHaveTextContent("Contribute on GitHub");
    }
  );
  it.each([
    ["ca", "Contribueix a GitHub"],
    ["es", "Contribuir en GitHub"],
    ["fr-FR", "Contribuer sur GitHub"],
    ["de", "Auf GitHub beitragen"],
    ["it", "Contribuisci su GitHub"],
    ["unknown", "Contribute on GitHub"],
  ])("localizes the footer contribution action for %s", (language, label) => {
    render(<AppFooter projectId="planner" language={language} />);
    expect(screen.getByRole("link", { name: label })).toHaveAttribute(
      "href",
      "https://github.com/JordiOrriols/planner"
    );
  });
});

import type { ReactNode } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ErrorBoundary } from "./ErrorBoundary";
import { ErrorState } from "./ErrorState";

function Throw({ error }: { error: unknown }): ReactNode {
  throw error;
}

describe("ErrorBoundary", () => {
  beforeEach(() => vi.spyOn(console, "error").mockImplementation(() => {}));
  afterEach(() => vi.restoreAllMocks());

  it("leaves children mounted normally and does not call the fallback or logger", () => {
    const fallback = vi.fn();
    const onError = vi.fn();
    render(
      <ErrorBoundary fallback={fallback} onError={onError}>
        <p>Working</p>
      </ErrorBoundary>
    );
    expect(screen.getByText("Working")).toBeVisible();
    expect(fallback).not.toHaveBeenCalled();
    expect(onError).not.toHaveBeenCalled();
    expect(console.error).not.toHaveBeenCalled();
  });

  it("reports the original error and component stack to the caller and renders its fallback", () => {
    const error = new Error("Load failed");
    const onError = vi.fn();
    render(
      <ErrorBoundary onError={onError} fallback={(cause) => <ErrorState message={cause.message} />}>
        <Throw error={error} />
      </ErrorBoundary>
    );
    expect(screen.getByRole("alert")).toHaveTextContent("Load failed");
    expect(onError).toHaveBeenCalledWith(
      error,
      expect.objectContaining({
        componentStack: expect.stringContaining("Throw"),
      })
    );
  });

  it("keeps default diagnostics when the caller does not supply a logger", () => {
    const error = new Error("Load failed");
    render(
      <ErrorBoundary componentName="Roadmap" fallback={(cause) => <p>{cause.message}</p>}>
        <Throw error={error} />
      </ErrorBoundary>
    );
    expect(console.error).toHaveBeenCalledWith(
      "Error in Roadmap:",
      error,
      expect.objectContaining({
        componentStack: expect.any(String),
      })
    );
  });

  it("normalizes non-Error throws without returning a success-shaped fallback", () => {
    const onError = vi.fn();
    render(
      <ErrorBoundary onError={onError} fallback={(error) => <ErrorState message={error.message} />}>
        <Throw error="Unexpected response" />
      </ErrorBoundary>
    );
    expect(screen.getByRole("alert")).toHaveTextContent("Unexpected response");
    expect(onError.mock.calls[0]![0]).toBeInstanceOf(Error);
    expect(onError.mock.calls[0]![0].message).toBe("Unexpected response");
  });

  it("recovers only after explicit retry and continues to catch subsequent failures", async () => {
    let failing = true;
    function Content() {
      return failing ? <Throw error={new Error("Unavailable")} /> : <p>Recovered</p>;
    }
    const { rerender } = render(
      <ErrorBoundary
        fallback={(error, reset) => (
          <ErrorState
            message={error.message}
            retryLabel="Retry"
            onRetry={() => {
              failing = false;
              reset();
            }}
          />
        )}
      >
        <Content />
      </ErrorBoundary>
    );
    expect(screen.getByRole("alert")).toBeVisible();
    await userEvent.click(screen.getByRole("button", { name: "Retry" }));
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(screen.getByText("Recovered")).toBeVisible();
    failing = true;
    rerender(
      <ErrorBoundary fallback={(error) => <ErrorState message={error.message} />}>
        <Content />
      </ErrorBoundary>
    );
    expect(screen.getByRole("alert")).toHaveTextContent("Unavailable");
  });
});

describe("ErrorState", () => {
  it("renders caller-localized copy without inventing a recovery action", () => {
    render(<ErrorState title="Erreur" message="Impossible de charger" className="my-4" />);
    expect(screen.getByRole("heading", { name: "Erreur" })).toBeVisible();
    expect(screen.getByRole("alert")).toHaveTextContent("Impossible de charger");
    expect(screen.getByRole("alert")).toHaveClass("my-4");
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("supports labeled keyboard recovery and caller-owned busy state without submitting forms", async () => {
    const retry = vi.fn();
    const { rerender } = render(
      <ErrorState message="Unavailable" retryLabel="Retry" onRetry={retry} retryDisabled />
    );
    expect(screen.getByRole("button", { name: "Retry" })).toBeDisabled();
    rerender(<ErrorState message="Unavailable" retryLabel="Retry" onRetry={retry} />);
    const button = screen.getByRole("button", { name: "Retry" });
    expect(button).toHaveAttribute("type", "button");
    button.focus();
    await userEvent.keyboard("{Enter}");
    expect(retry).toHaveBeenCalledOnce();
  });
});

import { describe, it, expect, vi, afterEach } from "vitest";

import {
  configureAnalytics,
  trackButtonClick,
  trackEvent,
  type AnalyticsEventData,
} from "../analytics";

describe("analytics", () => {
  afterEach(() => {
    configureAnalytics();
    delete window.umami;
    vi.restoreAllMocks();
  });

  it("routes events through the configured sink", () => {
    const sink = vi.fn();
    configureAnalytics(sink);

    trackEvent("custom_event", { a: 1 });

    expect(sink).toHaveBeenCalledWith("custom_event", { a: 1 });
  });

  it("tags button clicks so they can be filtered from other events", () => {
    const sink = vi.fn();
    configureAnalytics(sink);

    trackButtonClick("save_button");

    expect(sink).toHaveBeenCalledWith("save_button", { type: "button_click" });
  });

  it("merges caller data into a button click payload", () => {
    const sink = vi.fn();
    configureAnalytics(sink);

    trackButtonClick("team_publish", { teamId: 7 });

    expect(sink).toHaveBeenCalledWith("team_publish", {
      type: "button_click",
      teamId: 7,
    });
  });

  it("does not throw when the sink throws", () => {
    configureAnalytics(() => {
      throw new Error("network down");
    });

    expect(() => trackEvent("custom_event")).not.toThrow();
  });

  it("falls back to window.umami when no sink is configured", () => {
    const track = vi.fn();
    window.umami = { track };
    configureAnalytics();

    trackEvent("page_view");

    expect(track).toHaveBeenCalledWith("page_view", undefined);
  });

  it("restores the default sink when configureAnalytics is called with no argument", () => {
    const track = vi.fn();
    window.umami = { track };
    configureAnalytics(() => {
      throw new Error("should not be called");
    });

    configureAnalytics();
    trackEvent("after_reset");

    expect(track).toHaveBeenCalledWith("after_reset", undefined);
  });

  it("accepts string, number and boolean payload values", () => {
    const sink = vi.fn();
    configureAnalytics(sink);
    const payload: AnalyticsEventData = { label: "a", count: 2, ok: true };

    trackEvent("typed_event", payload);

    expect(sink).toHaveBeenCalledWith("typed_event", payload);
  });
});

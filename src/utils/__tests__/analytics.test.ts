import { describe, it, expect, vi, afterEach } from "vitest";

import {
  configureAnalytics,
  isAutomatedBrowser,
  loadUmami,
  trackButtonClick,
  trackEvent,
  type AnalyticsEventData,
} from "../analytics";

describe("analytics", () => {
  afterEach(() => {
    configureAnalytics();
    delete window.umami;
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    document.head.querySelectorAll("script[data-website-id]").forEach((script) => script.remove());
  });

  const automate = () =>
    vi.stubGlobal("navigator", { ...window.navigator, webdriver: true } as Navigator);

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

  describe("in automated browsers", () => {
    it("detects test runners through navigator.webdriver", () => {
      expect(isAutomatedBrowser()).toBe(false);
      automate();
      expect(isAutomatedBrowser()).toBe(true);
    });

    it("does not report events to Umami", () => {
      const track = vi.fn();
      window.umami = { track };
      automate();

      trackButtonClick("save_button");

      expect(track).not.toHaveBeenCalled();
    });

    it("does not load the Umami tracker", () => {
      automate();

      expect(loadUmami({ websiteId: "site" })).toBe(false);
      expect(document.querySelector("script[data-website-id]")).toBeNull();
    });
  });

  it("loads the Umami tracker once per website", () => {
    expect(loadUmami({ websiteId: "site" })).toBe(true);
    expect(loadUmami({ websiteId: "site" })).toBe(true);

    const scripts = document.querySelectorAll<HTMLScriptElement>("script[data-website-id]");
    expect(scripts).toHaveLength(1);
    expect(scripts[0].src).toBe("https://cloud.umami.is/script.js");
    expect(scripts[0].defer).toBe(true);
    expect(scripts[0].dataset.websiteId).toBe("site");
  });
});

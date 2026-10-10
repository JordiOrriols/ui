/**
 * Umami Analytics
 *
 * Owns the analytics wiring shared across consuming apps so that components can
 * report events without knowing how the host app collects them. By default it
 * talks to the Umami snippet that the host page loads, which is the setup both
 * projects use. Apps with a different backend can swap the sink at boot.
 *
 * Automated browsers (Playwright, Selenium, Puppeteer…) expose
 * `navigator.webdriver`, so test runs never load Umami nor report events.
 *
 * @see https://umami.is/docs/tracking-functions
 */

declare global {
  interface Window {
    umami?: {
      track: (eventName: string, eventData?: Record<string, unknown>) => void;
    };
  }
}

export type AnalyticsEventData = Record<string, string | number | boolean>;

/**
 * A sink receives every event the library reports. Return `void` and swallow
 * your own errors: analytics must never break the UI.
 */
export type AnalyticsSink = (eventId: string, eventData?: AnalyticsEventData) => void;

const UMAMI_SCRIPT_URL = "https://cloud.umami.is/script.js";

/** True when the page is driven by a test runner such as Playwright. */
export function isAutomatedBrowser(): boolean {
  return typeof navigator !== "undefined" && navigator.webdriver === true;
}

export interface UmamiOptions {
  websiteId: string;
  /** Script URL, for self-hosted Umami instances. */
  src?: string;
}

/**
 * Load the Umami tracker, unless the browser is automated. Use this instead of
 * a `<script>` tag in `index.html`, otherwise test runs record page views.
 *
 * @returns whether the tracker is (or already was) on the page.
 */
export function loadUmami({ websiteId, src = UMAMI_SCRIPT_URL }: UmamiOptions): boolean {
  if (typeof document === "undefined" || isAutomatedBrowser()) return false;
  const loaded = Array.from(
    document.querySelectorAll<HTMLScriptElement>("script[data-website-id]")
  ).some((script) => script.dataset.websiteId === websiteId);
  if (loaded) return true;
  const script = document.createElement("script");
  script.defer = true;
  script.src = src;
  script.dataset.websiteId = websiteId;
  document.head.appendChild(script);
  return true;
}

const defaultSink: AnalyticsSink = (eventId, eventData) => {
  if (typeof window === "undefined" || isAutomatedBrowser()) return;

  if (window.umami) {
    window.umami.track(eventId, eventData);
    return;
  }

  if (import.meta.env?.DEV) {
    // Surface events in development when the Umami snippet is not loaded yet.
    console.debug("[Analytics]", eventId, eventData);
  }
};

let sink: AnalyticsSink = defaultSink;

/**
 * Replace the analytics sink for the whole library.
 *
 * Call this once at app boot, before rendering:
 *
 * ```tsx
 * import { configureAnalytics } from "@jordiorriols/ui";
 *
 * configureAnalytics((eventId, eventData) => myTracker.send(eventId, eventData));
 * ```
 *
 * Passing nothing restores the default Umami sink.
 */
export function configureAnalytics(nextSink?: AnalyticsSink): void {
  sink = nextSink ?? defaultSink;
}

/**
 * Report an event.
 */
export function trackEvent(eventId: string, eventData?: AnalyticsEventData): void {
  try {
    sink(eventId, eventData);
  } catch (error) {
    if (import.meta.env?.DEV) {
      console.warn("[Analytics] sink threw for event", eventId, error);
    }
  }
}

/**
 * Report a button interaction, tagged with `type: "button_click"` so button
 * events can be filtered apart from the rest of the funnel.
 */
export function trackButtonClick(eventId: string, eventData?: AnalyticsEventData): void {
  trackEvent(eventId, {
    type: "button_click",
    ...eventData,
  });
}

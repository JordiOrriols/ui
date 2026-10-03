/**
 * Umami Analytics
 *
 * Owns the analytics wiring shared across consuming apps so that components can
 * report events without knowing how the host app collects them. By default it
 * talks to the Umami snippet that the host page loads, which is the setup both
 * projects use. Apps with a different backend can swap the sink at boot.
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

const defaultSink: AnalyticsSink = (eventId, eventData) => {
  if (typeof window === "undefined") return;

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

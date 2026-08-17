export const ANALYTICS_EVENTS = [
  "enter_clicked",
  "print_completed",
  "product_clicked",
  "line_clicked",
  "video_played",
] as const;

export type AnalyticsEvent = (typeof ANALYTICS_EVENTS)[number];

type AnalyticsAdapter = {
  track: (event: AnalyticsEvent, payload?: Record<string, string>) => void;
};

declare global {
  interface Window {
    haodadaAnalytics?: AnalyticsAdapter;
  }
}

/**
 * Optional first-party event adapter.
 * Production is a no-op unless window.haodadaAnalytics is provided at runtime.
 * Do not add third-party pixels or invented measurement IDs here.
 */
export function track(
  event: AnalyticsEvent,
  payload?: Record<string, string>,
) {
  if (typeof window === "undefined") return;
  try {
    window.haodadaAnalytics?.track(event, payload);
  } catch {
    // never block UI
  }
}

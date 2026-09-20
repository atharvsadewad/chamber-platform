import { track } from "@vercel/analytics";

export type AnalyticsEvent =
  | "search"
  | "content_view"
  | "bookmark"
  | "ai_message"
  | "newspaper_open"
  | "feature_used";

export type AnalyticsProperties = Record<
  string,
  string | number | boolean
>;

export function trackEvent(
  event: AnalyticsEvent,
  properties?: AnalyticsProperties,
) {
  try {
    track(event, properties);
  } catch (error) {
    console.error("Analytics event failed:", error);
  }
}

export function trackSearch(
  properties: AnalyticsProperties = {},
) {
  trackEvent("search", properties);
}

export function trackContentView(
  properties: AnalyticsProperties = {},
) {
  trackEvent("content_view", properties);
}

export function trackBookmark(
  properties: AnalyticsProperties = {},
) {
  trackEvent("bookmark", properties);
}

export function trackAiMessage(
  properties: AnalyticsProperties = {},
) {
  trackEvent("ai_message", properties);
}

export function trackNewspaperOpen(
  properties: AnalyticsProperties = {},
) {
  trackEvent("newspaper_open", properties);
}

export function trackFeatureUse(
  properties: AnalyticsProperties = {},
) {
  trackEvent("feature_used", properties);
}

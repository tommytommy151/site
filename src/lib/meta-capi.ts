import { createHash } from "node:crypto";

const GRAPH_API_VERSION = "v21.0";

function sha256(value: string): string {
  return createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

function normalizePhone(phone: string): string {
  return phone.replace(/[^0-9]/g, "");
}

export interface MetaCapiUserData {
  email?: string;
  phone?: string;
  clientIp?: string;
  userAgent?: string;
  fbp?: string;
  fbc?: string;
}

export interface MetaCapiEventInput {
  eventName: string;
  /** Must match the event_id passed to fbq(...) for the same logical event so Meta dedupes the pair. */
  eventId: string;
  eventSourceUrl?: string;
  customData?: Record<string, unknown>;
  userData?: MetaCapiUserData;
}

let warnedMissingConfig = false;

/**
 * Server-side Meta Conversions API call. Always sent alongside (never instead
 * of) the browser Pixel event, keyed by the same event_id, so Meta's own
 * dedup collapses the pair into a single counted event.
 */
export async function sendMetaCapiEvent(input: MetaCapiEventInput): Promise<void> {
  // Same Pixel ID the client-side pixel uses (see meta-pixel.tsx), so events
  // from both legs land in the same Meta dataset and can be deduped. Falls
  // back to the current production pixel ID if the env var isn't set yet.
  const pixelId = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID || "1389718926685322";
  const accessToken = process.env.META_CONVERSIONS_API_TOKEN;
  if (!pixelId || !accessToken) {
    if (!warnedMissingConfig) {
      warnedMissingConfig = true;
      console.warn(
        "[meta-capi] NEXT_PUBLIC_FACEBOOK_PIXEL_ID / META_CONVERSIONS_API_TOKEN not configured — skipping Conversions API call.",
      );
    }
    return;
  }

  const userData: Record<string, unknown> = {};
  if (input.userData?.email) userData.em = [sha256(input.userData.email)];
  if (input.userData?.phone) userData.ph = [sha256(normalizePhone(input.userData.phone))];
  if (input.userData?.clientIp) userData.client_ip_address = input.userData.clientIp;
  if (input.userData?.userAgent) userData.client_user_agent = input.userData.userAgent;
  if (input.userData?.fbp) userData.fbp = input.userData.fbp;
  if (input.userData?.fbc) userData.fbc = input.userData.fbc;

  const payload = {
    data: [
      {
        event_name: input.eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_id: input.eventId,
        event_source_url: input.eventSourceUrl,
        action_source: "website",
        user_data: userData,
        custom_data: input.customData,
      },
    ],
    ...(process.env.META_TEST_EVENT_CODE ? { test_event_code: process.env.META_TEST_EVENT_CODE } : {}),
  };

  try {
    const res = await fetch(
      `https://graph.facebook.com/${GRAPH_API_VERSION}/${pixelId}/events?access_token=${accessToken}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error("[meta-capi] Graph API error", res.status, text);
    }
  } catch (err) {
    console.error("[meta-capi] request failed", err);
  }
}

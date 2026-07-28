import { NextRequest, NextResponse } from "next/server";
import { sendMetaCapiEvent } from "@/lib/meta-capi";

interface CapiRequestBody {
  eventName?: string;
  eventId?: string;
  eventSourceUrl?: string;
  customData?: Record<string, unknown>;
  userData?: { email?: string; phone?: string };
}

// Called from the browser (see trackMetaEvent in meta-pixel.tsx) right next to
// the fbq(...) call, with the same event_id, so every client-tracked event also
// reaches Meta server-side — this keeps working even when connect.facebook.net
// is blocked by an ad blocker, and lets Meta dedupe the pixel/CAPI pair.
export async function POST(req: NextRequest) {
  let body: CapiRequestBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Corp invalid." }, { status: 400 });
  }

  if (!body.eventName || !body.eventId) {
    return NextResponse.json({ error: "eventName și eventId sunt obligatorii." }, { status: 400 });
  }

  const clientIp =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    undefined;

  await sendMetaCapiEvent({
    eventName: body.eventName,
    eventId: body.eventId,
    eventSourceUrl: body.eventSourceUrl,
    customData: body.customData,
    userData: {
      email: body.userData?.email,
      phone: body.userData?.phone,
      clientIp,
      userAgent: req.headers.get("user-agent") ?? undefined,
      fbp: req.cookies.get("_fbp")?.value,
      fbc: req.cookies.get("_fbc")?.value,
    },
  });

  return NextResponse.json({ ok: true });
}

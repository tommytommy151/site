import { NextRequest, NextResponse } from "next/server";
import { recordPageview } from "@/lib/analytics/server-analytics";

export async function POST(req: NextRequest) {
  let body: { referrer?: string };
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  let source = "direct";
  if (body.referrer) {
    try {
      const referrerHost = new URL(body.referrer).hostname.replace(/^www\./, "");
      const siteHost = req.headers.get("host")?.replace(/^www\./, "");
      if (referrerHost !== siteHost) source = referrerHost;
    } catch {
      source = "direct";
    }
  }

  await recordPageview(source);
  return NextResponse.json({ ok: true });
}

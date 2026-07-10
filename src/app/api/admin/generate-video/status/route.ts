import { NextRequest, NextResponse } from "next/server";
import { GenerateVideosOperation } from "@google/genai";
import { getGenAI } from "@/lib/gemini";

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  let body: { operationName?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Corp de cerere invalid." }, { status: 400 });
  }

  const operationName = body.operationName?.trim();
  if (!operationName) {
    return NextResponse.json({ error: "operationName este obligatoriu." }, { status: 400 });
  }

  try {
    const ai = getGenAI();
    const pending = new GenerateVideosOperation();
    pending.name = operationName;

    const operation = await ai.operations.getVideosOperation({ operation: pending });

    if (operation.error) {
      return NextResponse.json({
        done: true,
        error: String(operation.error.message ?? "Generarea video a eșuat."),
      });
    }

    if (!operation.done) {
      return NextResponse.json({ done: false });
    }

    const video = operation.response?.generatedVideos?.[0]?.video;
    if (!video) {
      return NextResponse.json({ done: true, error: "Niciun video generat." });
    }

    return NextResponse.json({ done: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Verificarea stării a eșuat." },
      { status: 502 },
    );
  }
}

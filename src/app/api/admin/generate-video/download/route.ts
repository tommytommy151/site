import { randomUUID } from "crypto";
import { readFile, unlink } from "fs/promises";
import os from "os";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { GenerateVideosOperation } from "@google/genai";
import { getGenAI } from "@/lib/gemini";

export const maxDuration = 60;

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

  const ai = getGenAI();
  const pending = new GenerateVideosOperation();
  pending.name = operationName;

  const operation = await ai.operations.getVideosOperation({ operation: pending });
  const video = operation.response?.generatedVideos?.[0]?.video;
  if (!operation.done || !video) {
    return NextResponse.json({ error: "Videoul nu este încă disponibil." }, { status: 409 });
  }

  const downloadPath = path.join(os.tmpdir(), `veo-${randomUUID()}.mp4`);
  try {
    await ai.files.download({ file: video, downloadPath });
    const bytes = await readFile(downloadPath);
    return new NextResponse(bytes, {
      headers: {
        "Content-Type": video.mimeType || "video/mp4",
        "Content-Disposition": 'attachment; filename="produs-video.mp4"',
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Descărcarea videoului a eșuat." },
      { status: 502 },
    );
  } finally {
    await unlink(downloadPath).catch(() => {});
  }
}

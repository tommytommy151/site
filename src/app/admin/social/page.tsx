"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Clapperboard, Copy, Download, Loader2, RefreshCw, Search } from "lucide-react";
import { formatPrice } from "@/lib/format";
import { generateCaption, type CaptionTone } from "@/lib/social-caption";
import { useStoreSettingsStore } from "@/lib/store/store-settings-store";
import { useProductStore } from "@/lib/store/product-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Product } from "@/types/product";

const CANVAS_SIZE = 1080;

const TONE_OPTIONS: { value: CaptionTone; label: string }[] = [
  { value: "urgenta", label: "Urgență" },
  { value: "beneficii", label: "Beneficii" },
  { value: "minimal", label: "Minimal" },
];

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
): number {
  const words = text.split(" ");
  let line = "";
  let cursorY = y;

  for (const word of words) {
    const testLine = line ? `${line} ${word}` : word;
    if (ctx.measureText(testLine).width > maxWidth && line) {
      ctx.fillText(line, x, cursorY);
      line = word;
      cursorY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, cursorY);
  return cursorY + lineHeight;
}

export default function AdminSocialPage() {
  const storeName = useStoreSettingsStore((s) => s.settings.storeName);
  const products = useProductStore((s) => s.products);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Product>(products[0]);
  const [tone, setTone] = useState<CaptionTone>("urgenta");
  const [caption, setCaption] = useState(() => generateCaption(products[0], "urgenta"));
  const [imageError, setImageError] = useState(false);
  const [copied, setCopied] = useState(false);

  const [videoState, setVideoState] = useState<"idle" | "starting" | "processing" | "done" | "error">(
    "idle",
  );
  const [videoOperationName, setVideoOperationName] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoError, setVideoError] = useState("");

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.trim().toLowerCase();
    return products.filter((p) => p.name.toLowerCase().includes(q)).slice(0, 8);
  }, [query, products]);

  function selectProduct(product: Product) {
    setSelected(product);
    setQuery("");
    setCaption(generateCaption(product, tone));
    setImageError(false);
    resetVideo();
  }

  function resetVideo() {
    setVideoState("idle");
    setVideoOperationName(null);
    setVideoError("");
    setVideoUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
  }

  async function startVideoGeneration() {
    resetVideo();
    setVideoState("starting");
    try {
      const res = await fetch("/api/admin/generate-video/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productSlug: selected.slug }),
      });
      const data = await res.json();
      if (!res.ok || !data.operationName) {
        throw new Error(data.error || "Generarea video a eșuat.");
      }
      setVideoOperationName(data.operationName);
      setVideoState("processing");
    } catch (err) {
      setVideoError(err instanceof Error ? err.message : "Generarea video a eșuat.");
      setVideoState("error");
    }
  }

  useEffect(() => {
    if (videoState !== "processing" || !videoOperationName) return;

    let cancelled = false;

    async function poll() {
      try {
        const res = await fetch("/api/admin/generate-video/status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ operationName: videoOperationName }),
        });
        const data = await res.json();
        if (cancelled) return;

        if (!res.ok) throw new Error(data.error || "Verificarea stării a eșuat.");
        if (data.error) throw new Error(data.error);
        if (!data.done) return;

        const downloadRes = await fetch("/api/admin/generate-video/download", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ operationName: videoOperationName }),
        });
        if (cancelled) return;
        if (!downloadRes.ok) {
          const errData = await downloadRes.json().catch(() => ({}));
          throw new Error(errData.error || "Descărcarea videoului a eșuat.");
        }
        const blob = await downloadRes.blob();
        setVideoUrl(URL.createObjectURL(blob));
        setVideoState("done");
      } catch (err) {
        if (cancelled) return;
        setVideoError(err instanceof Error ? err.message : "Generarea video a eșuat.");
        setVideoState("error");
      }
    }

    const interval = setInterval(poll, 10_000);
    poll();

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [videoState, videoOperationName]);

  function regenerateCaption() {
    setCaption(generateCaption(selected, tone));
  }

  useEffect(() => {
    setCaption(generateCaption(selected, tone));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tone]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = CANVAS_SIZE;
    canvas.height = CANVAS_SIZE;

    ctx.fillStyle = "#111318";
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => draw(ctx, img);
    img.onerror = () => {
      setImageError(true);
      draw(ctx, null);
    };
    img.src = selected.images[0];

    function draw(context: CanvasRenderingContext2D, image: HTMLImageElement | null) {
      context.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
      context.fillStyle = "#111318";
      context.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

      const imageAreaHeight = CANVAS_SIZE * 0.68;

      if (image) {
        const scale = Math.max(CANVAS_SIZE / image.width, imageAreaHeight / image.height);
        const w = image.width * scale;
        const h = image.height * scale;
        context.drawImage(image, (CANVAS_SIZE - w) / 2, (imageAreaHeight - h) / 2, w, h);
      }

      // top gradient for store name legibility
      const topGrad = context.createLinearGradient(0, 0, 0, 160);
      topGrad.addColorStop(0, "rgba(0,0,0,0.55)");
      topGrad.addColorStop(1, "rgba(0,0,0,0)");
      context.fillStyle = topGrad;
      context.fillRect(0, 0, CANVAS_SIZE, 160);

      // bottom panel gradient
      const bottomGrad = context.createLinearGradient(0, imageAreaHeight - 200, 0, CANVAS_SIZE);
      bottomGrad.addColorStop(0, "rgba(17,19,24,0)");
      bottomGrad.addColorStop(1, "rgba(17,19,24,1)");
      context.fillStyle = bottomGrad;
      context.fillRect(0, imageAreaHeight - 200, CANVAS_SIZE, CANVAS_SIZE - imageAreaHeight + 200);

      // store name pill
      context.font = "600 30px Arial";
      context.fillStyle = "#ffffff";
      context.textBaseline = "top";
      context.fillText(storeName.replace(" SRL", "").replace(" Commerce", ""), 48, 44);

      // discount badge
      const hasDiscount = selected.compareAtPrice && selected.compareAtPrice > selected.price;
      if (hasDiscount) {
        const pct = Math.round((1 - selected.price / selected.compareAtPrice!) * 100);
        const label = `-${pct}%`;
        context.font = "700 34px Arial";
        const badgeWidth = context.measureText(label).width + 48;
        context.fillStyle = "#e0402e";
        roundRect(context, CANVAS_SIZE - badgeWidth - 40, 36, badgeWidth, 58, 16);
        context.fill();
        context.fillStyle = "#ffffff";
        context.fillText(label, CANVAS_SIZE - badgeWidth - 40 + 24, 51);
      }

      // product name
      context.textBaseline = "alphabetic";
      context.font = "700 46px Arial";
      context.fillStyle = "#ffffff";
      const nameBottomY = wrapText(context, selected.name, 48, imageAreaHeight - 40, CANVAS_SIZE - 96, 54);

      // price row
      context.font = "700 56px Arial";
      context.fillStyle = "#7fe0b8";
      const priceText = formatPrice(selected.price, selected.currency);
      context.fillText(priceText, 48, nameBottomY + 50);

      if (hasDiscount) {
        const priceWidth = context.measureText(priceText).width;
        context.font = "400 34px Arial";
        context.fillStyle = "rgba(255,255,255,0.55)";
        const oldPriceText = formatPrice(selected.compareAtPrice!, selected.currency);
        const oldX = 48 + priceWidth + 24;
        context.fillText(oldPriceText, oldX, nameBottomY + 50);
        const oldWidth = context.measureText(oldPriceText).width;
        context.strokeStyle = "rgba(255,255,255,0.55)";
        context.lineWidth = 2;
        context.beginPath();
        context.moveTo(oldX, nameBottomY + 32);
        context.lineTo(oldX + oldWidth, nameBottomY + 32);
        context.stroke();
      }

      // footer url
      context.font = "500 26px Arial";
      context.fillStyle = "rgba(255,255,255,0.7)";
      context.fillText("estelaoferta.ro", 48, CANVAS_SIZE - 40);
    }

    function roundRect(
      context: CanvasRenderingContext2D,
      x: number,
      y: number,
      w: number,
      h: number,
      r: number,
    ) {
      context.beginPath();
      context.moveTo(x + r, y);
      context.arcTo(x + w, y, x + w, y + h, r);
      context.arcTo(x + w, y + h, x, y + h, r);
      context.arcTo(x, y + h, x, y, r);
      context.arcTo(x, y, x + w, y, r);
      context.closePath();
    }
  }, [selected, storeName]);

  async function copyCaption() {
    await navigator.clipboard.writeText(caption);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  function downloadPoster() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      const url = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = url;
      a.download = `${selected.slug}-social.png`;
      a.click();
    } catch {
      setImageError(true);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Generator postări social media</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Alege un produs, generează un poster și un text de postare pentru Facebook/Instagram.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[380px_1fr]">
        <div className="flex flex-col gap-5">
          <div className="rounded-2xl border border-border bg-card p-5">
            <Label htmlFor="product-search" className="mb-1.5">
              Produs
            </Label>
            <div className="relative">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="product-search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Caută un produs..."
                className="pl-9"
              />
            </div>
            {results.length > 0 && (
              <div className="mt-2 flex flex-col gap-1 rounded-lg border border-border bg-surface-sunken p-1">
                {results.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => selectProduct(p)}
                    className="flex items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm hover:bg-muted"
                  >
                    <span className="truncate">{p.name}</span>
                    <span className="ml-auto shrink-0 text-xs text-muted-foreground">
                      {formatPrice(p.price, p.currency)}
                    </span>
                  </button>
                ))}
              </div>
            )}
            <p className="mt-3 text-xs text-muted-foreground">
              Produs selectat: <span className="font-medium text-foreground">{selected.name}</span>
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <Label className="mb-2">Ton mesaj</Label>
            <div className="flex gap-2">
              {TONE_OPTIONS.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setTone(t.value)}
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                    tone === t.value
                      ? "bg-brand-emerald-soft text-brand-emerald"
                      : "text-foreground/70 hover:bg-muted"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between">
              <Label>Text postare</Label>
              <button
                onClick={regenerateCaption}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
              >
                <RefreshCw className="size-3.5" />
                Regenerează
              </button>
            </div>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              rows={8}
              className="mt-2 w-full resize-none rounded-lg border border-border bg-surface-sunken p-3 text-sm text-foreground focus:outline-none"
            />
            <Button variant="outline" className="mt-3 w-full" onClick={copyCaption}>
              <Copy className="size-4" />
              {copied ? "Copiat!" : "Copiază textul"}
            </Button>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4">
          <div className="w-full max-w-[520px] overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <canvas ref={canvasRef} className="block h-auto w-full" />
          </div>
          {imageError && (
            <p className="text-center text-sm text-destructive">
              Imaginea produsului nu a putut fi încărcată din sursa externă — posterul e generat
              fără fotografie. Poți încă descărca și edita manual sau alege alt produs.
            </p>
          )}
          <Button size="lg" onClick={downloadPoster}>
            <Download className="size-4" />
            Descarcă posterul (PNG)
          </Button>

          <div className="w-full max-w-[520px] rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center gap-2">
              <Clapperboard className="size-4 text-brand-emerald" />
              <h2 className="text-sm font-semibold text-foreground">
                Video AI pentru acest produs
              </h2>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Generează un clip video de 8 secunde (format vertical) din poza produsului, folosind
              Google Veo. Poate dura 1-3 minute.
            </p>

            {videoState === "done" && videoUrl ? (
              <div className="mt-4 flex flex-col gap-3">
                <video
                  src={videoUrl}
                  controls
                  className="w-full rounded-xl border border-border"
                />
                <div className="flex gap-2">
                  <a
                    href={videoUrl}
                    download={`${selected.slug}-social.mp4`}
                    className="flex-1"
                  >
                    <Button variant="outline" className="w-full">
                      <Download className="size-4" />
                      Descarcă video
                    </Button>
                  </a>
                  <Button variant="outline" onClick={startVideoGeneration}>
                    <RefreshCw className="size-4" />
                    Regenerează
                  </Button>
                </div>
              </div>
            ) : (
              <div className="mt-4">
                <Button
                  className="w-full"
                  disabled={videoState === "starting" || videoState === "processing"}
                  onClick={startVideoGeneration}
                >
                  {videoState === "starting" || videoState === "processing" ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      {videoState === "starting" ? "Se pornește..." : "Se generează video-ul..."}
                    </>
                  ) : (
                    <>
                      <Clapperboard className="size-4" />
                      Generează video
                    </>
                  )}
                </Button>
                {videoState === "error" && (
                  <p className="mt-2 text-sm text-destructive">{videoError}</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { onSpotlightMove } from "@/lib/use-spotlight";
import { cn } from "@/lib/utils";

export function SpotlightTile({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div onMouseMove={onSpotlightMove} className={cn("spotlight", className)}>
      {children}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";

function getTimeParts(target: number) {
  const diff = Math.max(0, target - Date.now());
  return {
    hours: Math.floor(diff / (1000 * 60 * 60)),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export function Countdown({ hoursFromNow = 18 }: { hoursFromNow?: number }) {
  const [target] = useState(() => Date.now() + hoursFromNow * 60 * 60 * 1000);
  const [parts, setParts] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setParts(getTimeParts(target));
    const id = setInterval(() => setParts(getTimeParts(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  const segments = [
    { label: "ORE", value: parts.hours },
    { label: "MIN", value: parts.minutes },
    { label: "SEC", value: parts.seconds },
  ];

  return (
    <div className="flex items-center gap-2">
      {segments.map((seg) => (
        <div
          key={seg.label}
          className="flex min-w-[3.25rem] flex-col items-center rounded-xl bg-foreground px-3 py-2 text-background"
        >
          <span className="font-mono text-lg leading-none font-semibold tabular-nums">
            {mounted ? String(seg.value).padStart(2, "0") : "00"}
          </span>
          <span className="mt-0.5 text-[9px] tracking-wider text-background/60">{seg.label}</span>
        </div>
      ))}
    </div>
  );
}

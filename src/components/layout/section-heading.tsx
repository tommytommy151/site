import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";

export function SectionHeading({
  eyebrow,
  title,
  description,
  href,
  hrefLabel = "Vezi tot",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  href?: string;
  hrefLabel?: string;
}) {
  return (
    <Reveal className="mb-10 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
      <div>
        {eyebrow && (
          <span className="mb-3 inline-block text-xs font-semibold tracking-[0.18em] text-brand-emerald uppercase">
            {eyebrow}
          </span>
        )}
        <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">{title}</h2>
        {description && (
          <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {href && (
        <Link
          href={href}
          className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-foreground transition-colors hover:text-brand-emerald"
        >
          {hrefLabel}
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
        </Link>
      )}
    </Reveal>
  );
}

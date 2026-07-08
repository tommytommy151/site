import Link from "next/link";

export function AuthShell({
  eyebrow,
  title,
  subtitle,
  children,
  footer,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="gradient-mesh relative flex min-h-screen items-center justify-center px-5 py-12">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-8 flex items-center justify-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-lg bg-gradient-to-br from-brand-emerald to-brand-indigo">
            <span className="size-3 rounded-full bg-white" />
          </span>
          <span className="font-heading text-xl font-semibold tracking-tight">
            Estela<span className="text-brand-emerald">Oferta</span>
          </span>
        </Link>

        <div className="inset-highlight rounded-3xl border border-border bg-card p-8 shadow-xl">
          <span className="mb-2 inline-block text-xs font-semibold tracking-[0.18em] text-brand-emerald uppercase">
            {eyebrow}
          </span>
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p>

          <div className="mt-7">{children}</div>
        </div>

        {footer && <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div>}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { useAuthStore } from "@/lib/store/auth-store";
import { useCheckoutStore } from "@/lib/store/checkout-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type Mode = "login" | "register" | "guest";

const MODES: { id: Mode; label: string }[] = [
  { id: "login", label: "Autentificare" },
  { id: "register", label: "Cont nou" },
  { id: "guest", label: "Continuă ca vizitator" },
];

export function AccountStep({ onDone }: { onDone: () => void }) {
  const login = useAuthStore((s) => s.login);
  const register = useAuthStore((s) => s.register);
  const setContact = useCheckoutStore((s) => s.setContact);

  const [mode, setMode] = useState<Mode>("guest");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (mode === "guest") {
      if (!name.trim() || !email.trim()) {
        setError("Introdu numele și adresa de email.");
        return;
      }
      setContact(name.trim(), email.trim());
      onDone();
      return;
    }

    if (!email.trim() || !password.trim() || (mode === "register" && !name.trim())) {
      setError("Completează toate câmpurile.");
      return;
    }

    if (mode === "login") {
      login(email.trim(), password);
    } else {
      register(name.trim(), email.trim(), password);
    }
    onDone();
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-2">
        {MODES.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => {
              setMode(m.id);
              setError("");
            }}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
              mode === m.id
                ? "border-brand-emerald bg-brand-emerald-soft text-brand-emerald"
                : "border-border text-foreground/70 hover:border-foreground/30",
            )}
          >
            {m.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex max-w-md flex-col gap-4">
        {mode !== "login" && (
          <div>
            <Label htmlFor="checkout-name" className="mb-1.5">
              Nume complet
            </Label>
            <div className="relative">
              <User className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="checkout-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ioana Petrescu"
                className="pl-9"
              />
            </div>
          </div>
        )}

        <div>
          <Label htmlFor="checkout-email" className="mb-1.5">
            Email
          </Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="checkout-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@exemplu.com"
              className="pl-9"
            />
          </div>
        </div>

        {mode !== "guest" && (
          <div>
            <Label htmlFor="checkout-password" className="mb-1.5">
              Parolă
            </Label>
            <div className="relative">
              <Lock className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="checkout-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="pr-9 pl-9"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>
        )}

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button type="submit" size="lg" className="mt-1 h-11 w-full">
          {mode === "login"
            ? "Autentificare"
            : mode === "register"
              ? "Creează cont și continuă"
              : "Continuă fără cont"}
        </Button>
      </form>
    </div>
  );
}

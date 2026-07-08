"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { AppleIcon, FacebookIcon, GoogleIcon } from "@/components/icons/social-icons";
import { useAuthStore } from "@/lib/store/auth-store";

export default function RegisterPage() {
  const router = useRouter();
  const register = useAuthStore((s) => s.register);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError("Completează toate câmpurile.");
      return;
    }
    if (!agreed) {
      setError("Trebuie să accepți termenii și condițiile.");
      return;
    }
    register(name, email, password);
    router.push("/account");
  }

  return (
    <AuthShell
      eyebrow="Cont nou"
      title="Creează-ți contul"
      subtitle="Durează sub un minut și primești 10% reducere la prima comandă"
      footer={
        <>
          Ai deja cont?{" "}
          <Link href="/login" className="font-medium text-brand-emerald hover:underline">
            Autentifică-te
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <Label htmlFor="name" className="mb-1.5">
            Nume complet
          </Label>
          <div className="relative">
            <User className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ioana Petrescu"
              className="pl-9"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="email" className="mb-1.5">
            Email
          </Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@exemplu.com"
              className="pl-9"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="password" className="mb-1.5">
            Parolă
          </Label>
          <div className="relative">
            <Lock className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 8 caractere"
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

        <label className="flex cursor-pointer items-start gap-2.5 text-sm">
          <Checkbox checked={agreed} onCheckedChange={(v) => setAgreed(Boolean(v))} className="mt-0.5" />
          <span className="text-muted-foreground">
            Sunt de acord cu{" "}
            <Link href="/terms" className="text-foreground underline-offset-2 hover:underline">
              Termenii și condițiile
            </Link>{" "}
            și{" "}
            <Link href="/privacy" className="text-foreground underline-offset-2 hover:underline">
              Politica de confidențialitate
            </Link>
          </span>
        </label>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button type="submit" size="lg" className="mt-1 h-11 w-full">
          Creează cont
        </Button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="text-xs text-muted-foreground">sau continuă cu</span>
        <Separator className="flex-1" />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <button className="flex h-11 items-center justify-center rounded-lg border border-border transition-colors hover:bg-muted">
          <GoogleIcon className="size-4.5" />
        </button>
        <button className="flex h-11 items-center justify-center rounded-lg border border-border transition-colors hover:bg-muted">
          <FacebookIcon className="size-4.5 text-[#1877F2]" />
        </button>
        <button className="flex h-11 items-center justify-center rounded-lg border border-border transition-colors hover:bg-muted">
          <AppleIcon className="size-4.5" />
        </button>
      </div>
    </AuthShell>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { AppleIcon, FacebookIcon, GoogleIcon } from "@/components/icons/social-icons";
import { useAuthStore, ADMIN_USERNAME, verifyAdminPassword } from "@/lib/store/auth-store";

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const loginAsAdmin = useAuthStore((s) => s.loginAsAdmin);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const identifier = email.trim();
    if (!identifier || !password.trim()) {
      setError("Introdu adresa de email și parola.");
      return;
    }

    if (identifier.toLowerCase() === ADMIN_USERNAME.toLowerCase()) {
      const ok = await verifyAdminPassword(password);
      if (!ok) {
        setError("Date de autentificare invalide.");
        return;
      }
      loginAsAdmin(identifier, password);
      router.push("/admin");
      return;
    }

    login(email, password);
    router.push("/account");
  }

  return (
    <AuthShell
      eyebrow="Autentificare"
      title="Bine ai revenit"
      subtitle="Conectează-te la contul tău EstelaOferta"
      footer={
        <>
          Nu ai cont încă?{" "}
          <Link href="/register" className="font-medium text-brand-emerald hover:underline">
            Creează unul gratuit
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <Label htmlFor="email" className="mb-1.5">
            Email sau utilizator
          </Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@exemplu.com"
              className="pl-9"
            />
          </div>
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <Label htmlFor="password">Parolă</Label>
            <Link href="/forgot-password" className="text-xs text-brand-emerald hover:underline">
              Ai uitat parola?
            </Link>
          </div>
          <div className="relative">
            <Lock className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="password"
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

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button type="submit" size="lg" className="mt-1 h-11 w-full">
          Autentificare
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

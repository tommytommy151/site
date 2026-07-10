"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, ShieldCheck, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore, ADMIN_USERNAME, verifyAdminPassword } from "@/lib/store/auth-store";

export default function AdminLoginPage() {
  const router = useRouter();
  const loginAsAdmin = useAuthStore((s) => s.loginAsAdmin);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const identifier = username.trim();
    if (!identifier || !password.trim()) {
      setError("Introdu utilizatorul și parola de administrator.");
      return;
    }

    if (identifier.toLowerCase() !== ADMIN_USERNAME.toLowerCase()) {
      setError("Date de autentificare invalide.");
      return;
    }

    setLoading(true);
    const ok = await verifyAdminPassword(password);
    setLoading(false);

    if (!ok) {
      setError("Date de autentificare invalide.");
      return;
    }

    loginAsAdmin(identifier, password);
    router.push("/admin");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-sunken px-4">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-surface p-8 shadow-sm">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-brand-emerald/10 text-brand-emerald">
            <ShieldCheck className="size-6" />
          </div>
          <h1 className="text-xl font-semibold text-foreground">Acces administrator</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Zonă restricționată. Doar personal autorizat.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <Label htmlFor="username" className="mb-1.5">
              Utilizator
            </Label>
            <div className="relative">
              <User className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="username"
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admintom"
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
                autoComplete="current-password"
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

          <Button type="submit" size="lg" className="mt-1 h-11 w-full" disabled={loading}>
            {loading ? "Se verifică..." : "Autentificare"}
          </Button>
        </form>
      </div>
    </div>
  );
}

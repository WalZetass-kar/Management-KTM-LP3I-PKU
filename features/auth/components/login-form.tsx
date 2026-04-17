"use client";

import { useActionState, useState } from "react";
import { Lock, Mail } from "lucide-react";
import { loginAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { initialFormActionState } from "@/types/action-state";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [state, formAction, isPending] = useActionState(loginAction, initialFormActionState);

  return (
    <div className="w-full max-w-md">
      <div className="rounded-[2rem] border border-white/20 bg-white/96 p-8 shadow-[0_30px_120px_rgba(15,23,42,0.28)] backdrop-blur-md sm:p-10">
        <div className="text-center">
          <div className="mx-auto flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/20">
            <Lock className="h-8 w-8" />
          </div>
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.24em] text-primary/80">Secure Access</p>
          <h1 className="mt-3 text-3xl font-semibold text-foreground">KTM Management</h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">Masuk untuk mengelola data mahasiswa, verifikasi, dan penerbitan kartu identitas kampus.</p>
        </div>

        <form action={formAction} className="mt-8 space-y-5">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-foreground">
              Email
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="h-12 pl-10"
                placeholder="admin@politekniklp3i.ac.id"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-foreground">
              Kata Sandi
            </label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="h-12 pl-10"
                placeholder="Masukkan kata sandi"
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-muted-foreground">
              <input type="checkbox" className="h-4 w-4 rounded border-border accent-primary" />
              Ingat saya
            </label>
            <button type="button" className="font-medium text-primary transition hover:text-primary/80">
              Lupa kata sandi?
            </button>
          </div>

          {state.status === "error" ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {state.message}
            </div>
          ) : null}

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Memproses..." : "Masuk ke Dashboard"}
          </Button>
        </form>

        <div className="mt-8 rounded-2xl bg-secondary/70 px-4 py-3 text-sm text-muted-foreground">
          Sistem ini dirancang untuk pengelolaan data mahasiswa, penerbitan KTM, dan verifikasi identitas secara terpusat.
        </div>
      </div>
    </div>
  );
}

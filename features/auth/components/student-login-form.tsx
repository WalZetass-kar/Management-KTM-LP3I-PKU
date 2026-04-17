"use client";

import { useActionState, useState } from "react";
import { KeyRound, UserRound } from "lucide-react";
import { studentLoginAction } from "@/actions/student-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { initialFormActionState } from "@/types/action-state";

export function StudentLoginForm() {
  const [nim, setNim] = useState("");
  const [password, setPassword] = useState("");
  const [state, formAction, isPending] = useActionState(studentLoginAction, initialFormActionState);

  return (
    <div className="w-full max-w-md">
      <div className="rounded-[2rem] border border-white/20 bg-white/96 p-8 shadow-[0_30px_120px_rgba(15,23,42,0.28)] backdrop-blur-md sm:p-10">
        <div className="text-center">
          <div className="mx-auto flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/20">
            <UserRound className="h-8 w-8" />
          </div>
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.24em] text-primary/80">
            Student Access
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-foreground">Portal Mahasiswa</h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Masuk menggunakan NIM dan kata sandi untuk melihat data akun mahasiswa Anda.
          </p>
        </div>

        <form action={formAction} className="mt-8 space-y-5">
          <div className="space-y-2">
            <label htmlFor="nim" className="text-sm font-medium text-foreground">
              NIM
            </label>
            <div className="relative">
              <UserRound className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="nim"
                name="nim"
                value={nim}
                onChange={(event) => setNim(event.target.value)}
                className="h-12 pl-10"
                placeholder="Masukkan NIM Anda"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-foreground">
              Kata Sandi
            </label>
            <div className="relative">
              <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="h-12 pl-10"
                placeholder="Masukkan kata sandi mahasiswa"
                required
              />
            </div>
          </div>

          {state.status === "error" ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {state.message}
            </div>
          ) : null}

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Memproses..." : "Masuk ke Portal Mahasiswa"}
          </Button>
        </form>

        <div className="mt-8 rounded-2xl bg-secondary/70 px-4 py-3 text-sm text-muted-foreground">
          Gunakan akun pada tabel `student_accounts`. Jika login tetap gagal, cek kembali NIM,
          password hash, dan schema project Supabase yang sedang aktif.
        </div>
      </div>
    </div>
  );
}

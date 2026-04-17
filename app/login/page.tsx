import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { LoginForm } from "@/features/auth/components/login-form";

export default async function LoginPage() {
  const currentUser = await getCurrentUser();

  if (currentUser) {
    redirect("/dashboard");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.16),_transparent_32%),linear-gradient(135deg,#0f1f4a,#1e3a8a_52%,#2563eb)] px-4 py-10">
      <LoginForm />
    </main>
  );
}

import { redirect } from "next/navigation";
import { ensureAuthenticatedAdmin } from "@/lib/auth";
import { AdminProfilePanel } from "@/features/admin-profile/components/admin-profile-panel";

export default async function ProfilePage() {
  try {
    const admin = await ensureAuthenticatedAdmin();

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profil Admin</h1>
          <p className="mt-2 text-muted-foreground">
            Kelola informasi profil dan pengaturan akun Anda
          </p>
        </div>

        <AdminProfilePanel admin={admin} />
      </div>
    );
  } catch (error) {
    redirect("/login");
  }
}

import { AlumniDashboard } from "@/features/alumni/components/alumni-dashboard";
import { getAlumniStats, getAlumniList } from "@/lib/alumni";

export const dynamic = "force-dynamic";

export default async function AlumniPage() {
  const [statsResult, alumniResult] = await Promise.all([
    getAlumniStats(),
    getAlumniList(),
  ]);

  return (
    <AlumniDashboard
      stats={statsResult.data}
      alumni={alumniResult.data}
      errorMessage={statsResult.error || alumniResult.error}
    />
  );
}

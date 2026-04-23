import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { ensureAuthenticatedAdmin } from "@/lib/auth";

export async function GET() {
  try {
    await ensureAuthenticatedAdmin();
    
    const supabase = await createServerSupabaseClient();
    
    const { data, error } = await supabase
      .from("mahasiswa")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    // Convert to CSV
    const headers = ["ID", "Nama", "NIM", "Jurusan", "Angkatan", "Alamat", "No HP", "Status", "Foto URL", "Created At"];
    const csvRows = [headers.join(",")];

    data.forEach((row) => {
      const values = [
        row.id,
        `"${row.nama}"`,
        row.nim,
        `"${row.jurusan}"`,
        row.angkatan || "",
        `"${row.alamat}"`,
        row.no_hp,
        row.status,
        row.foto_url || "",
        row.created_at,
      ];
      csvRows.push(values.join(","));
    });

    const csvContent = csvRows.join("\n");

    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="mahasiswa-${new Date().toISOString().split("T")[0]}.csv"`,
      },
    });
  } catch (error) {
    console.error("Error exporting mahasiswa:", error);
    return NextResponse.json(
      { error: "Gagal export data mahasiswa" },
      { status: 500 }
    );
  }
}

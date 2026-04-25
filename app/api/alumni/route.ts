import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleSupabaseClient } from "@/lib/supabase/admin";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const nim = searchParams.get("nim");

    if (!nim) {
      return NextResponse.json(
        { error: "NIM is required" },
        { status: 400 }
      );
    }

    // Use service role client to bypass RLS for public API
    const supabase = createServiceRoleSupabaseClient();

    const { data: mahasiswa, error } = await supabase
      .from("mahasiswa")
      .select("nim, nama, jurusan, angkatan, status, foto_url, tahun_lulus, pekerjaan_saat_ini, perusahaan_saat_ini, lokasi_saat_ini, created_at")
      .eq("nim", nim)
      .eq("status", "Lulus")
      .maybeSingle();

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to fetch alumni data" },
        { status: 500 }
      );
    }

    if (!mahasiswa) {
      return NextResponse.json(
        { error: "Alumni tidak ditemukan atau belum berstatus lulus" },
        { status: 404 }
      );
    }

    const graduationYear = mahasiswa.tahun_lulus || 
      (mahasiswa.angkatan ? (parseInt(mahasiswa.angkatan) + 3).toString() : new Date().getFullYear().toString());

    const alumniData = {
      nim: mahasiswa.nim,
      fullName: mahasiswa.nama,
      studyProgram: mahasiswa.jurusan,
      graduationYear,
      photoUrl: mahasiswa.foto_url,
      currentJob: mahasiswa.pekerjaan_saat_ini,
      currentCompany: mahasiswa.perusahaan_saat_ini,
      location: mahasiswa.lokasi_saat_ini || "Pekanbaru, Riau",
    };

    return NextResponse.json({ alumni: alumniData });
  } catch (error) {
    console.error("Error in alumni API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

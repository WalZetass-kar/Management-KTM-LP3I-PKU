import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const nim = searchParams.get("nim");

    if (!nim) {
      return NextResponse.json(
        { error: "NIM tidak boleh kosong" },
        { status: 400 }
      );
    }

    const supabase = await createServerSupabaseClient();
    
    const { data, error } = await supabase
      .from("mahasiswa")
      .select("*")
      .eq("nim", nim)
      .maybeSingle();

    if (error) {
      console.error("Error fetching student:", error);
      return NextResponse.json(
        { error: "Terjadi kesalahan saat mengambil data" },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: "Mahasiswa dengan NIM tersebut tidak ditemukan" },
        { status: 404 }
      );
    }

    // Map to StudentRecord format
    const student = {
      id: data.id,
      fullName: data.nama,
      nim: data.nim,
      studyProgram: data.jurusan,
      address: data.alamat,
      phoneNumber: data.no_hp,
      photoUrl: data.foto_url,
      status: data.status,
      angkatan: data.angkatan,
      createdAt: data.created_at,
    };

    return NextResponse.json({ student });
  } catch (error) {
    console.error("Error in student-ktm API:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}

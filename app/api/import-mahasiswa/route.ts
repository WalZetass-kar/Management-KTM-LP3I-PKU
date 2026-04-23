import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { ensureAuthenticatedAdmin } from "@/lib/auth";
import * as XLSX from "xlsx";

interface MahasiswaRow {
  nama: string;
  nim: string;
  jurusan: string;
  angkatan: string;
  alamat: string;
  no_hp: string;
  status: string;
}

export async function POST(request: NextRequest) {
  try {
    await ensureAuthenticatedAdmin();
    
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "File tidak ditemukan" },
        { status: 400 }
      );
    }

    // Read file
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: "array" });
    
    // Get first sheet
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    
    // Convert to JSON
    const data = XLSX.utils.sheet_to_json<MahasiswaRow>(sheet);

    if (data.length === 0) {
      return NextResponse.json(
        { error: "File kosong atau format tidak valid" },
        { status: 400 }
      );
    }

    // Validate required columns
    const requiredColumns = ["nama", "nim", "jurusan", "angkatan", "alamat", "no_hp", "status"];
    const firstRow = data[0];
    const missingColumns = requiredColumns.filter(col => !(col in firstRow));

    if (missingColumns.length > 0) {
      return NextResponse.json(
        { error: `Kolom wajib tidak ditemukan: ${missingColumns.join(", ")}` },
        { status: 400 }
      );
    }

    const supabase = await createServerSupabaseClient();

    // Get existing jurusan and angkatan for validation
    const [jurusanResult, angkatanResult] = await Promise.all([
      supabase.from("jurusan").select("nama_jurusan"),
      supabase.from("angkatan").select("tahun"),
    ]);

    const validJurusan = new Set(jurusanResult.data?.map(j => j.nama_jurusan) || []);
    const validAngkatan = new Set(angkatanResult.data?.map(a => a.tahun) || []);

    // Prepare data for insert
    const mahasiswaData = data.map((row, index) => {
      // Validate jurusan
      if (!validJurusan.has(row.jurusan)) {
        throw new Error(`Baris ${index + 2}: Jurusan "${row.jurusan}" tidak terdaftar di sistem`);
      }

      // Validate angkatan
      if (!validAngkatan.has(row.angkatan)) {
        throw new Error(`Baris ${index + 2}: Angkatan "${row.angkatan}" tidak terdaftar di sistem`);
      }

      // Validate status
      const validStatus = ["Aktif", "Menunggu", "Tidak Aktif", "Lulus", "Cuti"];
      if (!validStatus.includes(row.status)) {
        throw new Error(`Baris ${index + 2}: Status "${row.status}" tidak valid. Gunakan: ${validStatus.join(", ")}`);
      }

      return {
        nama: row.nama,
        nim: row.nim,
        jurusan: row.jurusan,
        angkatan: row.angkatan,
        alamat: row.alamat,
        no_hp: row.no_hp,
        status: row.status,
        foto_url: null,
      };
    });

    // Insert to database
    const { data: insertedData, error } = await supabase
      .from("mahasiswa")
      .insert(mahasiswaData)
      .select();

    if (error) {
      console.error("Error inserting mahasiswa:", error);
      
      // Check for duplicate NIM error
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "NIM sudah terdaftar. Pastikan semua NIM unik." },
          { status: 400 }
        );
      }

      throw error;
    }

    return NextResponse.json({
      success: true,
      imported: insertedData?.length || 0,
      message: `Berhasil import ${insertedData?.length || 0} mahasiswa`,
    });
  } catch (error) {
    console.error("Error importing mahasiswa:", error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : "Gagal import data mahasiswa" 
      },
      { status: 500 }
    );
  }
}

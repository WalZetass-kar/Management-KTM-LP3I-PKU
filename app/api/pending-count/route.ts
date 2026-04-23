import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();

    const { count, error } = await supabase
      .from("mahasiswa")
      .select("*", { count: "exact", head: true })
      .eq("status", "Menunggu");

    if (error) {
      throw error;
    }

    return NextResponse.json({ count: count || 0 });
  } catch (error) {
    console.error("Error fetching pending count:", error);
    return NextResponse.json({ count: 0 }, { status: 500 });
  }
}

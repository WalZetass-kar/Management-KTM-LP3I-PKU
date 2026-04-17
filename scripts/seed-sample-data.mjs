import { createClient } from "@supabase/supabase-js";

const requiredEnv = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
];

for (const name of requiredEnv) {
  if (!process.env[name]) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
);

console.log("🌱 Seeding sample data...\n");

// Sample mahasiswa data
const sampleStudents = [
  {
    nama: "Ahmad Fadli",
    nim: "2024010101",
    jurusan: "Teknik Informatika",
    alamat: "Jl. Harapan No. 10, Pekanbaru",
    no_hp: "081234567890",
    status: "Aktif",
    foto_url: null,
  },
  {
    nama: "Siti Nurhaliza",
    nim: "2024010102",
    jurusan: "Akuntansi",
    alamat: "Jl. Melati No. 18, Pekanbaru",
    no_hp: "081234567891",
    status: "Aktif",
    foto_url: null,
  },
  {
    nama: "Budi Santoso",
    nim: "2024010103",
    jurusan: "Manajemen",
    alamat: "Jl. Garuda No. 6, Pekanbaru",
    no_hp: "081234567892",
    status: "Aktif",
    foto_url: null,
  },
  {
    nama: "Dewi Lestari",
    nim: "2024010104",
    jurusan: "Teknik Informatika",
    alamat: "Jl. Anggrek No. 24, Pekanbaru",
    no_hp: "081234567893",
    status: "Menunggu",
    foto_url: null,
  },
  {
    nama: "Rudi Hermawan",
    nim: "2024010105",
    jurusan: "Akuntansi",
    alamat: "Jl. Rajawali No. 2, Pekanbaru",
    no_hp: "081234567894",
    status: "Aktif",
    foto_url: null,
  },
  {
    nama: "Rina Wijaya",
    nim: "2024010106",
    jurusan: "Manajemen",
    alamat: "Jl. Sudirman No. 88, Pekanbaru",
    no_hp: "081234567895",
    status: "Aktif",
    foto_url: null,
  },
  {
    nama: "Andi Pratama",
    nim: "2024010107",
    jurusan: "Administrasi Bisnis",
    alamat: "Jl. Diponegoro No. 45, Pekanbaru",
    no_hp: "081234567896",
    status: "Aktif",
    foto_url: null,
  },
  {
    nama: "Maya Sari",
    nim: "2024010108",
    jurusan: "Teknik Informatika",
    alamat: "Jl. Veteran No. 12, Pekanbaru",
    no_hp: "081234567897",
    status: "Menunggu",
    foto_url: null,
  },
  {
    nama: "Doni Setiawan",
    nim: "2024010109",
    jurusan: "Akuntansi",
    alamat: "Jl. Imam Bonjol No. 33, Pekanbaru",
    no_hp: "081234567898",
    status: "Aktif",
    foto_url: null,
  },
  {
    nama: "Lina Marlina",
    nim: "2024010110",
    jurusan: "Manajemen",
    alamat: "Jl. Jendral Sudirman No. 67, Pekanbaru",
    no_hp: "081234567899",
    status: "Aktif",
    foto_url: null,
  },
];

console.log("1️⃣ Checking existing data...");
const { data: existingData, error: checkError } = await supabase
  .from("mahasiswa")
  .select("nim");

if (checkError) {
  console.error("❌ Error checking existing data:", checkError);
  process.exit(1);
}

console.log(`   Found ${existingData.length} existing students\n`);

if (existingData.length > 0) {
  console.log("⚠️  Database already has data. Do you want to:");
  console.log("   1. Skip seeding (keep existing data)");
  console.log("   2. Add sample data anyway");
  console.log("   3. Clear all data and reseed\n");
  console.log("   Running option 2 (Add sample data anyway)...\n");
}

console.log("2️⃣ Inserting sample students...");

let successCount = 0;
let skipCount = 0;
let errorCount = 0;

for (const student of sampleStudents) {
  // Check if NIM already exists
  const { data: existing } = await supabase
    .from("mahasiswa")
    .select("nim")
    .eq("nim", student.nim)
    .single();

  if (existing) {
    console.log(`   ⏭️  Skipped ${student.nama} (${student.nim}) - already exists`);
    skipCount++;
    continue;
  }

  const { error: insertError } = await supabase
    .from("mahasiswa")
    .insert(student);

  if (insertError) {
    console.error(`   ❌ Failed to insert ${student.nama}:`, insertError.message);
    errorCount++;
  } else {
    console.log(`   ✅ Inserted ${student.nama} (${student.nim})`);
    successCount++;
  }
}

console.log("\n3️⃣ Summary:");
console.log(`   ✅ Successfully inserted: ${successCount}`);
console.log(`   ⏭️  Skipped (already exists): ${skipCount}`);
console.log(`   ❌ Failed: ${errorCount}`);

console.log("\n4️⃣ Final check:");
const { data: finalData, error: finalError } = await supabase
  .from("mahasiswa")
  .select("*")
  .order("created_at", { ascending: false });

if (finalError) {
  console.error("❌ Error fetching final data:", finalError);
} else {
  console.log(`   Total students in database: ${finalData.length}`);
  console.log(`   - Aktif: ${finalData.filter((s) => s.status === "Aktif").length}`);
  console.log(`   - Menunggu: ${finalData.filter((s) => s.status === "Menunggu").length}`);
}

console.log("\n✨ Seeding complete!");
console.log("\n💡 Now you can:");
console.log("   1. Restart your dev server: npm run dev");
console.log("   2. Refresh the dashboard to see real data");

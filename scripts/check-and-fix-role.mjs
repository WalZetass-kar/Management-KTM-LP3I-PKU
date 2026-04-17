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

console.log("🔍 Checking current roles...\n");

// Check current profiles
const { data: profiles, error: profilesError } = await supabase
  .from("user_profiles")
  .select("*");

if (profilesError) {
  console.error("❌ Error fetching profiles:", profilesError);
  process.exit(1);
}

console.log("Current profiles:");
profiles.forEach((profile) => {
  console.log(`   - ${profile.username}: ${profile.role}`);
  console.log(`     ID: ${profile.id}`);
});

console.log("\n🔧 Updating all profiles to super_admin...\n");

// Update all profiles to super_admin
for (const profile of profiles) {
  const { error: updateError } = await supabase
    .from("user_profiles")
    .update({ role: "super_admin" })
    .eq("id", profile.id);

  if (updateError) {
    console.error(`❌ Failed to update ${profile.username}:`, updateError);
  } else {
    console.log(`✅ Updated ${profile.username} to super_admin`);
  }
  
  // Also update app_metadata
  const { error: metadataError } = await supabase.auth.admin.updateUserById(
    profile.id,
    {
      app_metadata: { role: "super_admin" },
    }
  );
  
  if (metadataError) {
    console.error(`❌ Failed to update metadata for ${profile.username}:`, metadataError);
  } else {
    console.log(`✅ Updated metadata for ${profile.username}`);
  }
}

console.log("\n✅ Final check:");
const { data: finalProfiles } = await supabase
  .from("user_profiles")
  .select("*");

finalProfiles?.forEach((profile) => {
  console.log(`   - ${profile.username}: ${profile.role}`);
});

console.log("\n✨ Done! Please logout and login again.");

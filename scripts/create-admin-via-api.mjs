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

console.log("🚀 Creating super admin via Supabase API...\n");
console.log(`📍 Supabase URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL}\n`);

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

const email = "admin@politeknik.ac.id";
const password = "Admin2024Secure!";
const username = "admin.politeknik";

console.log("1️⃣ Creating user in auth.users...");

try {
  // Create user
  const { data: userData, error: userError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      username,
    },
    app_metadata: {
      role: "super_admin",
    },
  });

  if (userError) {
    if (userError.message.includes("already registered")) {
      console.log("⚠️  User already exists. Updating profile...\n");
      
      // Get existing user
      const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
      
      if (listError) throw listError;
      
      const existingUser = users.find((u) => u.email === email);
      
      if (!existingUser) {
        throw new Error("User exists but cannot be found");
      }
      
      console.log(`✅ Found existing user: ${existingUser.id}\n`);
      
      // Update or create profile
      console.log("2️⃣ Creating/updating profile...");
      
      const { error: profileError } = await supabase
        .from("user_profiles")
        .upsert({
          id: existingUser.id,
          username,
          role: "super_admin",
        });
      
      if (profileError) throw profileError;
      
      console.log("✅ Profile updated successfully!\n");
      
    } else {
      throw userError;
    }
  } else {
    if (!userData.user) {
      throw new Error("User creation failed - no user data returned");
    }
    
    console.log(`✅ User created: ${userData.user.id}\n`);
    
    // Create profile
    console.log("2️⃣ Creating profile in user_profiles...");
    
    const { error: profileError } = await supabase
      .from("user_profiles")
      .upsert({
        id: userData.user.id,
        username,
        role: "super_admin",
      });
    
    if (profileError) throw profileError;
    
    console.log("✅ Profile created successfully!\n");
  }
  
  // Verify
  console.log("3️⃣ Verifying super admin...");
  
  const { data: verifyData, error: verifyError } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("username", username)
    .single();
  
  if (verifyError) throw verifyError;
  
  console.log("✅ Verification successful!\n");
  console.log("📋 Super Admin Details:");
  console.log(`   Email: ${email}`);
  console.log(`   Username: ${verifyData.username}`);
  console.log(`   Role: ${verifyData.role}`);
  console.log(`   Created: ${verifyData.created_at}\n`);
  
  console.log("🎉 Super admin created successfully!\n");
  console.log("💡 You can now login with:");
  console.log(`   Email: ${email}`);
  console.log(`   Password: ${password}\n`);
  
} catch (error) {
  console.error("❌ Error:", error.message);
  console.error("\nFull error:", error);
  process.exit(1);
}

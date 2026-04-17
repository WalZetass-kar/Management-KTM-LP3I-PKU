import { createClient } from "@supabase/supabase-js";

const requiredEnv = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
  "SUPABASE_SUPER_ADMIN_EMAIL",
  "SUPABASE_SUPER_ADMIN_PASSWORD",
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

const username = process.env.SUPABASE_SUPER_ADMIN_USERNAME ?? "wal.superadmin";

const { data: userData, error: userError } = await supabase.auth.admin.createUser({
  email: process.env.SUPABASE_SUPER_ADMIN_EMAIL,
  password: process.env.SUPABASE_SUPER_ADMIN_PASSWORD,
  email_confirm: true,
  user_metadata: {
    username,
  },
  app_metadata: {
    role: "super_admin",
  },
});

if (userError) {
  throw userError;
}

if (!userData.user) {
  throw new Error("Supabase did not return the created super-admin user.");
}

const { error: profileError } = await supabase.from("user_profiles").upsert({
  id: userData.user.id,
  username,
  role: "super_admin",
});

if (profileError) {
  throw profileError;
}

console.log(`Super admin created: ${process.env.SUPABASE_SUPER_ADMIN_EMAIL}`);

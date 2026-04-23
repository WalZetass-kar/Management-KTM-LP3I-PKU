type SupabaseEnvName =
  | "NEXT_PUBLIC_SUPABASE_URL"
  | "NEXT_PUBLIC_SUPABASE_ANON_KEY"
  | "SUPABASE_SERVICE_ROLE_KEY";

function readEnv(name: SupabaseEnvName) {
  return process.env[name]?.trim() ?? "";
}

function isPlaceholderValue(value: string) {
  return value.toLowerCase().startsWith("your_");
}

function isValidHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function requireEnv(name: SupabaseEnvName) {
  const value = readEnv(name);

  if (!value) {
    // In browser, try to get from window object as fallback
    if (typeof window !== "undefined" && name.startsWith("NEXT_PUBLIC_")) {
      const windowValue = (window as any)[name];
      if (windowValue) return windowValue;
    }
    
    throw new Error(`Missing required Supabase environment variable: ${name}`);
  }

  if (isPlaceholderValue(value)) {
    throw new Error(
      `Supabase environment variable ${name} is still using a placeholder value. Update .env.local with your real project credentials.`,
    );
  }

  return value;
}

export function getSupabasePublicConfig() {
  const url = requireEnv("NEXT_PUBLIC_SUPABASE_URL");
  const anonKey = requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");

  if (!isValidHttpUrl(url)) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL must be a valid HTTP or HTTPS URL. Check your .env.local Supabase configuration.",
    );
  }

  return {
    url,
    anonKey,
  };
}

export function hasValidSupabasePublicConfig() {
  try {
    getSupabasePublicConfig();
    return true;
  } catch {
    return false;
  }
}

export function getSupabaseUrl() {
  return getSupabasePublicConfig().url;
}

export function getSupabaseAnonKey() {
  return getSupabasePublicConfig().anonKey;
}

export function getSupabaseServiceRoleKey() {
  return requireEnv("SUPABASE_SERVICE_ROLE_KEY");
}

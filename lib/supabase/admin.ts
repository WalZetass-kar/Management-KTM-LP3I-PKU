import "server-only";

import { createClient } from "@supabase/supabase-js";
import { getSupabaseServiceRoleKey, getSupabaseUrl } from "@/lib/supabase/config";
import type { Database } from "@/types/supabase";

let adminClient: ReturnType<typeof createClient<Database>> | undefined;

export function createServiceRoleSupabaseClient() {
  if (!adminClient) {
    adminClient = createClient<Database>(getSupabaseUrl(), getSupabaseServiceRoleKey(), {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  return adminClient;
}

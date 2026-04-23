"use client";

import { useEffect, useState, useCallback } from "react";
import { deriveAdminProfileFromUser } from "@/lib/auth-profile";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

interface UserProfile {
  username: string;
  role: "admin" | "super_admin";
  photoUrl?: string | null;
}

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = useCallback(() => {
    setRefreshKey((prev) => prev + 1);
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Check if we're in browser environment
        if (typeof window === "undefined") {
          setIsLoading(false);
          return;
        }

        const supabase = createBrowserSupabaseClient();
        
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setProfile(null);
          setIsLoading(false);
          return;
        }

        const metadataProfile = deriveAdminProfileFromUser(user);

        // Get user profile with cache busting
        const { data, error } = await supabase
          .from("user_profiles")
          .select("username, role, photo_url")
          .eq("id", user.id)
          .maybeSingle();

        if (error) {
          console.error("Error fetching user profile:", error);
          setProfile(metadataProfile);
        } else if (data) {
          console.log("Fetched profile data:", data); // Debug log
          setProfile({
            username: data.username,
            role: data.role,
            photoUrl: data.photo_url,
          });
        } else {
          setProfile(metadataProfile);
        }
      } catch (error) {
        console.error("Error in useUserProfile:", error);
        setProfile(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [refreshKey]);

  return { profile, isLoading, refresh };
}

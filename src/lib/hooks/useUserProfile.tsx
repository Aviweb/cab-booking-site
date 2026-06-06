/**
 * User Profile Hook
 * Replaces direct cookie reading with secure API calls
 * Implements caching and automatic refresh
 */

"use client";

import React, { useState, useEffect, useCallback } from "react";

export interface UserProfile {
  userId: string;
  role: "driver" | "passenger";
  name: string;
  email: string;
}

export interface UseUserProfileReturn {
  user: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
}

const USER_PROFILE_CACHE_KEY = "user_profile_cache";
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

interface CachedProfile {
  data: UserProfile;
  timestamp: number;
}

export function useUserProfile(): UseUserProfileReturn {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get cached profile from localStorage
  const getCachedProfile = useCallback((): UserProfile | null => {
    if (typeof window === "undefined") return null;
    
    try {
      const cached = localStorage.getItem(USER_PROFILE_CACHE_KEY);
      if (!cached) return null;

      const { data, timestamp }: CachedProfile = JSON.parse(cached);
      
      // Check if cache is still valid
      if (Date.now() - timestamp > CACHE_DURATION) {
        localStorage.removeItem(USER_PROFILE_CACHE_KEY);
        return null;
      }

      return data;
    } catch {
      localStorage.removeItem(USER_PROFILE_CACHE_KEY);
      return null;
    }
  }, []);

  // Cache profile in localStorage
  const setCachedProfile = useCallback((profile: UserProfile): void => {
    if (typeof window === "undefined") return;
    
    try {
      const cached: CachedProfile = {
        data: profile,
        timestamp: Date.now(),
      };
      localStorage.setItem(USER_PROFILE_CACHE_KEY, JSON.stringify(cached));
    } catch {
      // localStorage might be full or disabled, ignore error
    }
  }, []);

  // Clear cached profile
  const clearCachedProfile = useCallback((): void => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(USER_PROFILE_CACHE_KEY);
  }, []);

  // Fetch user profile from API
  const fetchProfile = useCallback(async (): Promise<UserProfile | null> => {
    try {
      const response = await fetch("/api/user/profile", {
        method: "GET",
        credentials: "include", // Include httpOnly cookies
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 401) {
        // User is not authenticated
        return null;
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || "Failed to fetch profile");
      }

      return result.data;
    } catch (err) {
      console.error("Failed to fetch user profile:", err);
      throw err;
    }
  }, []);

  // Refresh user profile (public method)
  const refresh = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const profile = await fetchProfile();
      setUser(profile);
      
      if (profile) {
        setCachedProfile(profile);
      } else {
        clearCachedProfile();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setUser(null);
      clearCachedProfile();
    } finally {
      setIsLoading(false);
    }
  }, [fetchProfile, setCachedProfile, clearCachedProfile]);

  // Logout function
  const logout = useCallback(async (): Promise<void> => {
    try {
      // Clear cookies by calling a logout endpoint or manually expiring them
      document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      
      // Clear state and cache
      setUser(null);
      clearCachedProfile();
      setError(null);
      
      // Optionally redirect to login page
      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
    } catch (err) {
      console.error("Logout failed:", err);
      // Force clear even if logout fails
      setUser(null);
      clearCachedProfile();
    }
  }, [clearCachedProfile]);

  // Initialize profile on mount
  useEffect(() => {
    const initializeProfile = async () => {
      // Try to get cached profile first
      const cachedProfile = getCachedProfile();
      
      if (cachedProfile) {
        setUser(cachedProfile);
        setIsLoading(false);
        // Refresh in background to ensure data is current
        refresh();
      } else {
        // No cache, fetch from server
        await refresh();
      }
    };

    initializeProfile();
  }, [getCachedProfile, refresh]);

  return {
    user,
    isLoading,
    isAuthenticated: user !== null,
    error,
    refresh,
    logout,
  };
}

// Optional: Create a context provider for app-wide user state
export const UserProfileContext = React.createContext<UseUserProfileReturn | null>(null);

export function UserProfileProvider({ children }: { children: React.ReactNode }) {
  const userProfile = useUserProfile();
  
  return (
    <UserProfileContext.Provider value={userProfile}>
      {children}
    </UserProfileContext.Provider>
  );
}

export function useUserContext(): UseUserProfileReturn {
  const context = React.useContext(UserProfileContext);
  if (!context) {
    throw new Error("useUserContext must be used within UserProfileProvider");
  }
  return context;
}
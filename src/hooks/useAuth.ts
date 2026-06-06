"use client";

import { useEffect, useState } from "react";

interface UserProfile {
  userId: string;
  role: "driver" | "passenger";
  name: string;
  email: string;
}

interface AuthState {
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

export function useAuth(): AuthState {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
    isAuthenticated: false,
  });

  const fetchUserProfile = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const response = await fetch("/api/user/profile", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Important: includes httpOnly cookies
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          // User not authenticated
          setState({
            user: null,
            loading: false,
            error: null,
            isAuthenticated: false,
          });
          return;
        }
        throw new Error(data.error || "Failed to fetch user profile");
      }

      if (!data.success || !data.data) {
        throw new Error("Invalid response format");
      }

      setState({
        user: data.data,
        loading: false,
        error: null,
        isAuthenticated: true,
      });
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setState({
        user: null,
        loading: false,
        error: error instanceof Error ? error.message : "Failed to fetch user profile",
        isAuthenticated: false,
      });
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  return state;
}

export default useAuth;
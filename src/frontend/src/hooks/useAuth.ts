import { useEffect, useState } from "react";

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AUTH_STORAGE_KEY = "malik_bank_admin_session";
const VALID_USERNAME = "Admin";
const VALID_PASSWORD = "Admin123";

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    // Check for existing session on mount
    const session = localStorage.getItem(AUTH_STORAGE_KEY);
    setAuthState({
      isAuthenticated: session === "authenticated",
      isLoading: false,
    });
  }, []);

  const login = (username: string, password: string): boolean => {
    // Validate credentials
    if (username === VALID_USERNAME && password === VALID_PASSWORD) {
      localStorage.setItem(AUTH_STORAGE_KEY, "authenticated");
      setAuthState({
        isAuthenticated: true,
        isLoading: false,
      });
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setAuthState({
      isAuthenticated: false,
      isLoading: false,
    });
  };

  return {
    isAuthenticated: authState.isAuthenticated,
    isLoading: authState.isLoading,
    login,
    logout,
  };
}

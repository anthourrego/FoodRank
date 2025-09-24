import { useEffect, useState, type ReactNode } from "react";
import {
  getUser,
  login as loginService,
  logout as logoutService,
} from "../../service/authService";
import {
  AuthContext,
  type AuthContextType,
  type User,
  type LoginResponse,
} from "./AuthContext";
import { Loading } from "@/components/ui/loading";

interface AuthProviderProps {
  children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async (): Promise<void> => {
      const storedToken = localStorage.getItem("foodranktoken");
      if (storedToken) {
        try {
          const validation = await validateToken();
          if (validation.valid) {
            setToken(storedToken);
            setUser(validation.user);
            if (location.pathname == "/login") {
              location.assign("/rate-product");
            }
          } else {
            localStorage.removeItem("foodranktoken");
            location.assign("/login");
          }
        } catch (error) {
          console.error("Error validating token:", error);
          localStorage.removeItem("foodranktoken");
        }
      } else {
        if (location.pathname != "/login") {
          location.assign("/login");
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const validateToken = async () => {
    try {
      const response = await getUser();
      return { valid: response.success, user: response.data.user ?? null };
    } catch (error: unknown) {
      console.log(error);
      return { valid: false };
    }
  };

  const login = async (
    email: string,
    password: string
  ): Promise<LoginResponse> => {
    try {
      const response = await loginService(email, password);
      const { user, token } = response.data;

      setUser(user);
      setToken(token);
      localStorage.setItem("foodranktoken", token);
      location.assign("/rate-product");

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await logoutService();
      setUser(null);
      setToken(null);
      localStorage.removeItem("foodranktoken");
      location.assign("/login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    logout,
    isAuthenticated: user?.id && token ? true : false,
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <Loading
          classNameLoader="w-12 h-12"
          className="min-h-screen flex items-center justify-center"
        />
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}

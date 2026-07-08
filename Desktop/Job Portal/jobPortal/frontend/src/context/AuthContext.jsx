import { createContext, useContext, useState, useCallback } from "react";
import { authApi } from "../api/endpoints";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("jp_user");
    return raw ? JSON.parse(raw) : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await authApi.login(email, password);
      localStorage.setItem("jp_token", data.token);
      const u = { name: data.name, email: data.email, role: data.role };
      localStorage.setItem("jp_user", JSON.stringify(u));
      setUser(u);
      return u;
    } catch (e) {
      const msg = e?.response?.data?.message || e?.response?.data || "Invalid credentials";
      setError(typeof msg === "string" ? msg : "Login failed");
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await authApi.register(payload);
      return data;
    } catch (e) {
      const msg = e?.response?.data?.message || e?.response?.data || "Registration failed";
      setError(typeof msg === "string" ? msg : "Registration failed");
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("jp_token");
    localStorage.removeItem("jp_user");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, error, setError }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

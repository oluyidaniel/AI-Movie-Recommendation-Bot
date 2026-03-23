import { useState, useCallback, useEffect } from "react";
import { auth, token } from "@/lib/api";

export function useAuth() {
  const [user,        setUser]        = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Re-hydrate session on mount
  useEffect(() => {
    const savedToken = token.get();
    if (!savedToken) { setAuthLoading(false); return; }

    auth.me()
      .then(({ user }) => setUser(user))
      .catch(() => token.clear())
      .finally(() => setAuthLoading(false));
  }, []);

  const login = useCallback(async (username, password) => {
    const data = await auth.login(username, password);
    token.set(data.token);
    setUser(data.user);
    return data.user;
  }, []);

  const register = useCallback(async (username, password) => {
    const data = await auth.register(username, password);
    token.set(data.token);
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(() => {
    token.clear();
    setUser(null);
  }, []);

  return { user, authLoading, login, register, logout };
}

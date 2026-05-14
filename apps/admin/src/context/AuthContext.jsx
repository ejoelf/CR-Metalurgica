import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { authService } from '../services/authService.js';

const AuthContext = createContext(null);

const ACCESS_KEY = 'cfmp_access_token';
const REFRESH_KEY = 'cfmp_refresh_token';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(() => localStorage.getItem(ACCESS_KEY));
  const [refreshToken, setRefreshToken] = useState(() => localStorage.getItem(REFRESH_KEY));
  const [loading, setLoading] = useState(Boolean(localStorage.getItem(ACCESS_KEY)));

  useEffect(() => {
    async function loadMe() {
      if (!accessToken) {
        setLoading(false);
        return;
      }

      try {
        const data = await authService.me(accessToken);
        setUser(data);
      } catch (error) {
        logout();
      } finally {
        setLoading(false);
      }
    }

    loadMe();
  }, [accessToken]);

  async function login(credentials) {
    const data = await authService.login(credentials);

    localStorage.setItem(ACCESS_KEY, data.accessToken);
    localStorage.setItem(REFRESH_KEY, data.refreshToken);

    setAccessToken(data.accessToken);
    setRefreshToken(data.refreshToken);
    setUser(data.user);

    return data;
  }

  function logout() {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);

    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
    setLoading(false);
  }

  const value = useMemo(
    () => ({
      user,
      accessToken,
      refreshToken,
      loading,
      isAuthenticated: Boolean(user && accessToken),
      login,
      logout,
    }),
    [user, accessToken, refreshToken, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }

  return context;
}
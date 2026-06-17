import React, { createContext, useState, useEffect } from 'react';
import storageModule, { getItem, setItem, removeItem } from './storage';
import * as service from './service';

const AuthContext = createContext({ user: null, loading: false, signup: async () => {}, login: async () => {}, logout: async () => {} });

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const raw = await getItem('@imw_user');
        if (raw) setUser(JSON.parse(raw));
      } catch (e) {
        // surface storage errors to console to help debugging
        // eslint-disable-next-line no-console
        console.warn('authContext: failed to read storage', e && e.message ? e.message : e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function signup(data) {
    const res = await service.signup(data);
    const toStore = { id: res.id, nome: res.nome, email: res.email };
    setUser(toStore);
    try {
      await setItem('@imw_user', JSON.stringify(toStore));
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('authContext: failed to write storage (signup)', e && e.message ? e.message : e);
    }
    return toStore;
  }

  async function login(creds) {
    const res = await service.login(creds);
    const toStore = { id: res.id, nome: res.nome, email: res.email, isAdmin: res.isAdmin };
    setUser(toStore);
    try {
      await setItem('@imw_user', JSON.stringify(toStore));
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('authContext: failed to write storage (login)', e && e.message ? e.message : e);
    }
    return toStore;
  }

  async function logout() {
    setUser(null);
    try {
      await removeItem('@imw_user');
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('authContext: failed to remove storage (logout)', e && e.message ? e.message : e);
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

import { createContext, useState, useEffect } from 'react';
import api from '../api/client';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Check token on load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.get('/api/v1/current_user')
        .then(res => setUser(res.data))
        .catch(() => setUser(null));
    }
  }, []);

  const login = (userData, token) => {
    localStorage.setItem('token', token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

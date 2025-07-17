import { createContext, useContext, useEffect, useState } from 'react';
import { authAPI } from '../utils/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Always check with backend for authentication status
    authAPI.me()
      .then(data => {
        if (data.user) {
          setUser(data.user);
          // Store user info in localStorage for UI purposes (not for auth)
          localStorage.setItem('user', JSON.stringify(data.user));
        }
        setLoading(false);
      })
      .catch((error) => {
        console.log('Auth check failed:', error.message);
        setUser(null);
        localStorage.removeItem('user');
        setLoading(false);
      });
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
} 
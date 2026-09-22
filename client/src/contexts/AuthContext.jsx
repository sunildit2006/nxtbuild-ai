import { createContext, useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { getMe } from '../services/authService.js';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const token = Cookies.get('token');

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const userData = await getMe();
        setUser(userData);
      } catch (error) {
        Cookies.remove('token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = (token, userData) => {
    Cookies.set('token', token, { expires: 7 });
    setUser(userData);
  };

  const logout = () => {
    Cookies.remove('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
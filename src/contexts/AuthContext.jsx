import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

// Hook para usar autenticación
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
}

// Proveedor de autenticación
export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar si hay sesión guardada al cargar
  useEffect(() => {
    const savedAuth = localStorage.getItem('marie-admin-auth');
    if (savedAuth === 'authenticated') {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  // Función de login
  const login = (username, password) => {
    const adminUsername = import.meta.env.VITE_ADMIN_USERNAME;
    const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD;

    if (username === adminUsername && password === adminPassword) {
      setIsAuthenticated(true);
      localStorage.setItem('marie-admin-auth', 'authenticated');
      return { success: true, message: '✅ Acceso concedido' };
    } else {
      return { success: false, message: '❌ Credenciales incorrectas' };
    }
  };

  // Función de logout
  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('marie-admin-auth');
  };

  const value = {
    isAuthenticated,
    isLoading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

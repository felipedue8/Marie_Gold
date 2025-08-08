import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './AdminLogin.css';

export function AdminLogin() {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const result = login(formData.username, formData.password);
      setMessage(result.message);
      
      if (!result.success) {
        // Limpiar formulario en caso de error
        setFormData({ username: '', password: '' });
      }
    } catch (error) {
      setMessage('❌ Error de conexión');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-box">
        <div className="admin-login-header">
          <h2>🔐 Panel Administrativo</h2>
          <p>Marie Golden - Acceso Restringido</p>
        </div>
        
        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="form-group">
            <label htmlFor="username">Usuario:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Ingresa tu usuario"
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Ingresa tu contraseña"
              required
              disabled={isLoading}
            />
          </div>

          <button 
            type="submit" 
            className="admin-login-btn"
            disabled={isLoading}
          >
            {isLoading ? '🔄 Verificando...' : '🚪 Iniciar Sesión'}
          </button>

          {message && (
            <div className={`admin-message ${message.includes('✅') ? 'success' : 'error'}`}>
              {message}
            </div>
          )}
        </form>

        <div className="admin-login-footer">
          <p>⚠️ Solo personal autorizado</p>
        </div>
      </div>
    </div>
  );
}

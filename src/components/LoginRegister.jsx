import React, { useState } from 'react';

export default function LoginRegister({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensaje('');
    if (isLogin) {
      // Login
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (res.ok) {
        const data = await res.json();
        setMensaje('¡Login exitoso!');
        onLogin && onLogin(data.usuario);
      } else {
        setMensaje(await res.text());
      }
    } else {
      // Registro
      const res = await fetch('/api/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, email, password })
      });
      if (res.ok) {
        setMensaje('¡Registro exitoso! Ahora puedes iniciar sesión.');
        setIsLogin(true);
        window.location.href = '/login';
      } else {
        setMensaje(await res.text());
      }
    }
    setLoading(false);
  };

  return (
    <div className="login-register-container" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(120deg,#FFD700 0%,#FFB347 100%)' }}>
      <div style={{ background: '#fff', borderRadius: 24, boxShadow: '0 4px 24px rgba(0,0,0,0.10)', padding: '40px 32px', maxWidth: 400, width: '100%' }}>
        <h2 style={{ textAlign: 'center', marginBottom: 24, fontWeight: 'bold', color: '#a0522d', letterSpacing: '1px' }}>{isLogin ? 'Iniciar sesión' : 'Registrarse'}</h2>
        <form onSubmit={handleSubmit} className="login-register-form" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {!isLogin && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontWeight: 'bold', color: '#a0522d' }}>Nombre:</label>
              <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} required style={{ padding: '10px', borderRadius: 8, border: '1px solid #FFD700', fontSize: 16 }} />
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontWeight: 'bold', color: '#a0522d' }}>Email:</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={{ padding: '10px', borderRadius: 8, border: '1px solid #FFD700', fontSize: 16 }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontWeight: 'bold', color: '#a0522d' }}>Contraseña:</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required style={{ padding: '10px', borderRadius: 8, border: '1px solid #FFD700', fontSize: 16 }} />
          </div>
          <button type="submit" disabled={loading} style={{ marginTop: 12, padding: '12px', borderRadius: 24, background: 'linear-gradient(90deg,#FFD700,#FFB347)', color: '#a0522d', fontWeight: 'bold', fontSize: 18, border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.10)', cursor: 'pointer', letterSpacing: '1px', transition: 'background 0.3s' }}>
            {loading ? 'Procesando...' : isLogin ? 'Entrar' : 'Registrarse'}
          </button>
        </form>
        <div style={{ marginTop: 18, textAlign: 'center' }}>
          <button onClick={() => { setIsLogin(!isLogin); setMensaje(''); }} style={{ background: 'none', border: 'none', color: '#a0522d', fontWeight: 'bold', fontSize: 16, cursor: 'pointer', textDecoration: 'underline' }}>
            {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
          </button>
        </div>
        {mensaje && <div className="login-register-message" style={{ marginTop: 18, textAlign: 'center', color: mensaje.includes('exitoso') ? '#28a745' : '#d9534f', fontWeight: 'bold', fontSize: 16 }}>{mensaje}</div>}
      </div>
    </div>
  );
}

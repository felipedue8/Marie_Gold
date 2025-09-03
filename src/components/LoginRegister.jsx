import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function LoginRegister({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  
  // Estados para verificación de email
  const [showVerification, setShowVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [emailToVerify, setEmailToVerify] = useState('');
  const [canResendCode, setCanResendCode] = useState(true);
  const [resendTimer, setResendTimer] = useState(0);

  // Obtener la URL de redirección de los parámetros de consulta
  const getRedirectUrl = () => {
    const params = new URLSearchParams(location.search);
    return params.get('redirect') || '/';
  };

  // Función para enviar código de verificación
  const sendVerificationCode = async (emailToSend) => {
    try {
      const res = await fetch('/api/send-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailToSend })
      });
      
      if (res.ok) {
        const data = await res.json();
        setShowVerification(true);
        setEmailToVerify(emailToSend);
        startResendTimer();
        
        // Para desarrollo: mostrar el código en consola si no hay servicio de email
        if (data.code) {
          console.log('Código de verificación para desarrollo:', data.code);
          setMensaje(`📧 Código enviado. Para desarrollo: ${data.code}`);
        } else {
          // Email real enviado
          setMensaje(`📧 Código de verificación enviado a ${emailToSend}. Revisa tu bandeja de entrada y spam.`);
        }
      } else {
        // Manejar errores específicos
        let errorMsg = 'Error al enviar código de verificación';
        
        try {
          const errorData = await res.json();
          errorMsg = errorData.message || errorMsg;
        } catch {
          // Si no es JSON, obtener texto
          errorMsg = await res.text() || errorMsg;
        }
        
        if (res.status === 500) {
          errorMsg = 'Error del servidor. Por favor, inténtalo más tarde.';
        }
        
        setMensaje(errorMsg);
      }
    } catch (error) {
      console.error('Error en sendVerificationCode:', error);
      setMensaje('Error de conexión. Verifica tu internet e inténtalo nuevamente.');
    }
  };

  // Función para verificar el código
  const verifyCode = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setMensaje('Ingresa un código de 6 dígitos');
      return false;
    }

    try {
      const res = await fetch('/api/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: emailToVerify, 
          code: verificationCode 
        })
      });
      
      if (res.ok) {
        setMensaje('✅ Email verificado correctamente');
        return true;
      } else {
        const errorText = await res.text();
        setMensaje(errorText);
        return false;
      }
    } catch (error) {
      setMensaje('Error al verificar código');
      return false;
    }
  };

  // Timer para reenvío de código
  const startResendTimer = () => {
    setCanResendCode(false);
    setResendTimer(60);
    
    const interval = setInterval(() => {
      setResendTimer(prev => {
        if (prev <= 1) {
          setCanResendCode(true);
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensaje('');
    
    if (isLogin) {
      // Proceso de Login (sin cambios)
      try {
        const res = await fetch('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        
        if (res.ok) {
          const data = await res.json();
          // Guardar usuario en localStorage
          localStorage.setItem('usuario', JSON.stringify(data.usuario));
          // Disparar evento personalizado para que otros componentes se enteren
          window.dispatchEvent(new CustomEvent('userLogin', { detail: data.usuario }));
          
          setMensaje('¡Login exitoso!');
          onLogin && onLogin(data.usuario);
          
          // Redireccionar a la URL especificada o a home
          const redirectUrl = getRedirectUrl();
          window.location.href = redirectUrl;
        } else {
          // Manejar errores específicos
          try {
            const errorData = await res.json();
            if (errorData.needsVerification) {
              setMensaje(`🚫 ${errorData.message}`);
            } else {
              setMensaje(errorData.message || await res.text());
            }
          } catch {
            // Si no es JSON, usar texto plano
            const errorText = await res.text();
            setMensaje(errorText);
          }
        }
      } catch (error) {
        setMensaje('Error de conexión');
      }
    } else {
      // Proceso de Registro con verificación
      if (!showVerification) {
        // Paso 1: Enviar código de verificación
        if (!nombre || !email || !password) {
          setMensaje('Completa todos los campos');
          setLoading(false);
          return;
        }
        
        await sendVerificationCode(email);
      } else {
        // Paso 2: Verificar código y registrar usuario
        const isCodeValid = await verifyCode();
        
        if (isCodeValid) {
          try {
            const res = await fetch('/api/registro', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                nombre, 
                email: emailToVerify, 
                password, 
                verificationCode 
              })
            });
            
            if (res.ok) {
              setMensaje('🎉 ¡Registro exitoso! Ahora puedes iniciar sesión.');
              setShowVerification(false);
              setIsLogin(true);
              // Limpiar campos
              setNombre('');
              setPassword('');
              setVerificationCode('');
            } else {
              const errorData = await res.text();
              setMensaje(errorData);
            }
          } catch (error) {
            setMensaje('Error en el registro');
          }
        }
      }
    }
    setLoading(false);
  };

  // Función para volver al paso anterior o cambiar modo
  const handleBackOrToggle = () => {
    if (!isLogin && showVerification) {
      // Volver al formulario de registro
      setShowVerification(false);
      setMensaje('');
      setVerificationCode('');
    } else {
      // Cambiar entre login y registro
      setIsLogin(!isLogin);
      setShowVerification(false);
      setMensaje('');
      setVerificationCode('');
      setEmailToVerify('');
    }
  };

  return (
    <div className="login-register-container" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(120deg,#FFD700 0%,#FFB347 100%)' }}>
      <div style={{ background: '#fff', borderRadius: 24, boxShadow: '0 4px 24px rgba(0,0,0,0.10)', padding: '40px 32px', maxWidth: 400, width: '100%' }}>
        
        {/* Título dinámico */}
        <h2 style={{ textAlign: 'center', marginBottom: 24, fontWeight: 'bold', color: '#a0522d', letterSpacing: '1px' }}>
          {isLogin 
            ? 'Iniciar sesión' 
            : showVerification 
              ? 'Verificar Email' 
              : 'Registrarse'
          }
        </h2>

        <form onSubmit={handleSubmit} className="login-register-form" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          
          {/* Campos de registro (solo si no es login y no está en verificación) */}
          {!isLogin && !showVerification && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontWeight: 'bold', color: '#a0522d' }}>Nombre:</label>
              <input 
                type="text" 
                value={nombre} 
                onChange={e => setNombre(e.target.value)} 
                required 
                style={{ padding: '10px', borderRadius: 8, border: '1px solid #FFD700', fontSize: 16 }} 
              />
            </div>
          )}

          {/* Campo de email (solo si no está en verificación) */}
          {!showVerification && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontWeight: 'bold', color: '#a0522d' }}>Email:</label>
              <input 
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                required 
                style={{ padding: '10px', borderRadius: 8, border: '1px solid #FFD700', fontSize: 16 }} 
              />
            </div>
          )}

          {/* Campo de contraseña (solo si no está en verificación) */}
          {!showVerification && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontWeight: 'bold', color: '#a0522d' }}>Contraseña:</label>
              <input 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                required 
                style={{ padding: '10px', borderRadius: 8, border: '1px solid #FFD700', fontSize: 16 }} 
              />
            </div>
          )}

          {/* Paso de verificación */}
          {showVerification && (
            <>
              <div style={{ textAlign: 'center', marginBottom: 16, padding: 12, background: '#f8f9fa', borderRadius: 8 }}>
                <p style={{ margin: 0, color: '#666', fontSize: 14 }}>
                  Hemos enviado un código de 6 dígitos a:
                </p>
                <strong style={{ color: '#a0522d' }}>{emailToVerify}</strong>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontWeight: 'bold', color: '#a0522d' }}>Código de verificación:</label>
                <input 
                  type="text" 
                  value={verificationCode} 
                  onChange={e => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))} 
                  placeholder="Ingresa los 6 dígitos"
                  maxLength={6}
                  style={{ 
                    padding: '12px', 
                    borderRadius: 8, 
                    border: '1px solid #FFD700', 
                    fontSize: 18, 
                    textAlign: 'center',
                    letterSpacing: '2px',
                    fontFamily: 'monospace'
                  }} 
                />
              </div>

              {/* Botón para reenviar código */}
              <div style={{ textAlign: 'center', marginTop: 8 }}>
                <button 
                  type="button"
                  onClick={() => sendVerificationCode(emailToVerify)}
                  disabled={!canResendCode}
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    color: canResendCode ? '#a0522d' : '#ccc', 
                    fontSize: 14, 
                    cursor: canResendCode ? 'pointer' : 'not-allowed',
                    textDecoration: canResendCode ? 'underline' : 'none'
                  }}
                >
                  {canResendCode 
                    ? '📧 Reenviar código' 
                    : `⏱️ Espera ${resendTimer}s`
                  }
                </button>
              </div>
            </>
          )}

          {/* Botón principal */}
          <button 
            type="submit" 
            disabled={loading || (showVerification && verificationCode.length !== 6)} 
            style={{ 
              marginTop: 12, 
              padding: '12px', 
              borderRadius: 24, 
              background: (loading || (showVerification && verificationCode.length !== 6)) 
                ? '#ccc' 
                : 'linear-gradient(90deg,#FFD700,#FFB347)', 
              color: '#a0522d', 
              fontWeight: 'bold', 
              fontSize: 18, 
              border: 'none', 
              boxShadow: '0 2px 8px rgba(0,0,0,0.10)', 
              cursor: (loading || (showVerification && verificationCode.length !== 6)) 
                ? 'not-allowed' 
                : 'pointer', 
              letterSpacing: '1px', 
              transition: 'background 0.3s' 
            }}
          >
            {loading 
              ? 'Procesando...' 
              : isLogin 
                ? 'Entrar' 
                : showVerification 
                  ? 'Completar registro'
                  : 'Enviar código de verificación'
            }
          </button>
        </form>

        {/* Botón para cambiar modo o volver */}
        <div style={{ marginTop: 18, textAlign: 'center' }}>
          <button 
            onClick={handleBackOrToggle} 
            style={{ 
              background: 'none', 
              border: 'none', 
              color: '#a0522d', 
              fontWeight: 'bold', 
              fontSize: 16, 
              cursor: 'pointer', 
              textDecoration: 'underline' 
            }}
          >
            {!isLogin && showVerification 
              ? '← Volver al registro'
              : isLogin 
                ? '¿No tienes cuenta? Regístrate' 
                : '¿Ya tienes cuenta? Inicia sesión'
            }
          </button>
        </div>

        {/* Mensaje de estado */}
        {mensaje && (
          <div 
            className="login-register-message" 
            style={{ 
              marginTop: 18, 
              textAlign: 'center', 
              color: mensaje.includes('exitoso') || mensaje.includes('✅') || mensaje.includes('📧') || mensaje.includes('🎉') 
                ? '#28a745' 
                : '#d9534f', 
              fontWeight: 'bold', 
              fontSize: 16,
              padding: 12,
              background: mensaje.includes('exitoso') || mensaje.includes('✅') || mensaje.includes('📧') || mensaje.includes('🎉')
                ? '#d4edda'
                : '#f8d7da',
              borderRadius: 8
            }}
          >
            {mensaje}
          </div>
        )}
      </div>
    </div>
  );
}

export default LoginRegister;

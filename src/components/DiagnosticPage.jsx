import React from 'react';

export function DiagnosticPage() {
  const envVars = {
    VITE_GITHUB_REPO: import.meta.env.VITE_GITHUB_REPO,
    VITE_GITHUB_TOKEN: import.meta.env.VITE_GITHUB_TOKEN ? '***CONFIGURADO***' : 'NO CONFIGURADO',
    VITE_ADMIN_USERNAME: import.meta.env.VITE_ADMIN_USERNAME ? '***CONFIGURADO***' : 'NO CONFIGURADO',
    VITE_ADMIN_PASSWORD: import.meta.env.VITE_ADMIN_PASSWORD ? '***CONFIGURADO***' : 'NO CONFIGURADO'
  };

  return (
    <div style={{ 
      padding: '40px', 
      fontFamily: 'monospace', 
      background: '#f5f5f5', 
      minHeight: '100vh' 
    }}>
      <h1>🔧 Diagnóstico de Variables de Entorno</h1>
      
      <div style={{ 
        background: 'white', 
        padding: '20px', 
        borderRadius: '8px', 
        marginBottom: '20px',
        border: '1px solid #ddd'
      }}>
        <h2>Variables de Entorno Detectadas:</h2>
        {Object.entries(envVars).map(([key, value]) => (
          <div key={key} style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            padding: '8px 0',
            borderBottom: '1px solid #eee'
          }}>
            <strong>{key}:</strong>
            <span style={{ 
              color: value.includes('NO CONFIGURADO') ? 'red' : 'green',
              fontWeight: 'bold'
            }}>
              {value}
            </span>
          </div>
        ))}
      </div>

      <div style={{ 
        background: '#fff3cd', 
        padding: '15px', 
        borderRadius: '8px', 
        border: '1px solid #ffeaa7',
        marginBottom: '20px'
      }}>
        <h3>⚠️ Instrucciones para Cloudflare Pages:</h3>
        <ol style={{ margin: 0 }}>
          <li>Ve a tu dashboard de Cloudflare Pages</li>
          <li>Selecciona el proyecto Marie_Gold</li>
          <li>Ve a Settings → Environment Variables</li>
          <li>Agrega las 4 variables mostradas arriba</li>
          <li>Haz redeploy del sitio</li>
        </ol>
      </div>

      <div style={{ 
        background: '#d4edda', 
        padding: '15px', 
        borderRadius: '8px', 
        border: '1px solid #c3e6cb' 
      }}>
        <h3>✅ Estado del Sistema:</h3>
        <p>
          <strong>Entorno:</strong> {import.meta.env.MODE}<br/>
          <strong>Build:</strong> {import.meta.env.PROD ? 'Producción' : 'Desarrollo'}<br/>
          <strong>Base URL:</strong> {import.meta.env.BASE_URL}
        </p>
      </div>

      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <button 
          onClick={() => window.history.back()}
          style={{
            padding: '10px 20px',
            background: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          ← Volver
        </button>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';

let toastId = 0;

export function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  // Función global para mostrar toasts
  window.showToast = (mensaje, tipo = 'success') => {
    const id = ++toastId;
    const toast = { id, mensaje, tipo };
    
    setToasts(prev => [...prev, toast]);
    
    // Auto remover después de 3 segundos
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  const removerToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '10px'
    }}>
      {toasts.map(toast => (
        <Toast 
          key={toast.id} 
          toast={toast} 
          onClose={() => removerToast(toast.id)} 
        />
      ))}
    </div>
  );
}

function Toast({ toast, onClose }) {
  const getBackgroundColor = () => {
    switch (toast.tipo) {
      case 'success': return '#4CAF50';
      case 'error': return '#f44336';
      case 'warning': return '#ff9800';
      case 'info': return '#2196F3';
      default: return '#4CAF50';
    }
  };

  const getIcon = () => {
    switch (toast.tipo) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return '✅';
    }
  };

  return (
    <div style={{
      background: getBackgroundColor(),
      color: 'white',
      padding: '12px 16px',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      minWidth: '300px',
      maxWidth: '400px',
      animation: 'slideInRight 0.3s ease-out',
      cursor: 'pointer'
    }}
    onClick={onClose}
    >
      <span style={{ fontSize: '16px' }}>{getIcon()}</span>
      <span style={{ flex: 1, fontSize: '14px', fontWeight: '500' }}>
        {toast.mensaje}
      </span>
      <button 
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        style={{
          background: 'rgba(255,255,255,0.2)',
          border: 'none',
          color: 'white',
          borderRadius: '4px',
          padding: '4px 8px',
          cursor: 'pointer',
          fontSize: '12px'
        }}
      >
        ×
      </button>
    </div>
  );
}

// Funciones helper para usar en cualquier parte
export const showSuccessToast = (mensaje) => window.showToast?.(mensaje, 'success');
export const showErrorToast = (mensaje) => window.showToast?.(mensaje, 'error');
export const showWarningToast = (mensaje) => window.showToast?.(mensaje, 'warning');
export const showInfoToast = (mensaje) => window.showToast?.(mensaje, 'info');

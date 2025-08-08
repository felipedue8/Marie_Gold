import React from 'react';
import './ImageStats.css';

export function ImageStats({ stats, show, onClose }) {
  if (!show || !stats) return null;

  const { original, optimized } = stats;
  
  return (
    <div className="image-stats-overlay" onClick={onClose}>
      <div className="image-stats-modal" onClick={e => e.stopPropagation()}>
        <div className="image-stats-header">
          <h3>📊 Estadísticas de Optimización</h3>
          <button onClick={onClose} className="close-btn">✕</button>
        </div>
        
        <div className="image-stats-content">
          <div className="stats-comparison">
            <div className="stat-column original">
              <h4>🖼️ Original</h4>
              <div className="stat-item">
                <span className="label">Tamaño:</span>
                <span className="value">{original.sizeFormatted}</span>
              </div>
              <div className="stat-item">
                <span className="label">Formato:</span>
                <span className="value">{original.format}</span>
              </div>
              <div className="stat-item">
                <span className="label">Dimensiones:</span>
                <span className="value">{original.width} × {original.height}</span>
              </div>
              <div className="stat-item">
                <span className="label">Relación:</span>
                <span className="value">{original.aspectRatio}:1</span>
              </div>
            </div>

            <div className="stats-arrow">
              <div className="arrow">→</div>
              <div className="optimization-badge">
                <strong>{optimized.compressionRatio}%</strong>
                <br />reducción
              </div>
            </div>

            <div className="stat-column optimized">
              <h4>✨ Optimizado</h4>
              <div className="stat-item">
                <span className="label">Tamaño:</span>
                <span className="value success">{optimized.sizeFormatted}</span>
              </div>
              <div className="stat-item">
                <span className="label">Formato:</span>
                <span className="value success">{optimized.format}</span>
              </div>
              <div className="stat-item">
                <span className="label">Calidad:</span>
                <span className="value">Alta</span>
              </div>
              <div className="stat-item">
                <span className="label">Compatibilidad:</span>
                <span className="value">Moderna</span>
              </div>
            </div>
          </div>

          {stats.thumbnail && (
            <div className="thumbnail-stats">
              <h4>🖼️ Thumbnail Generado</h4>
              <div className="stat-item">
                <span className="label">Tamaño:</span>
                <span className="value">{stats.thumbnail.sizeFormatted}</span>
              </div>
            </div>
          )}

          <div className="benefits">
            <h4>🚀 Beneficios de la Optimización</h4>
            <ul>
              <li>✅ Carga {Math.round(100 / (100 - optimized.compressionRatio))}x más rápida</li>
              <li>✅ Menos consumo de datos móviles</li>
              <li>✅ Mejor SEO y experiencia de usuario</li>
              <li>✅ Formato WebP para navegadores modernos</li>
              <li>✅ Calidad visual mantenida</li>
            </ul>
          </div>
        </div>

        <div className="image-stats-footer">
          <button onClick={onClose} className="ok-btn">
            👍 Entendido
          </button>
        </div>
      </div>
    </div>
  );
}

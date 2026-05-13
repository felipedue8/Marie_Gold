import React, { useRef, useEffect, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls } from '@react-three/drei';
import './PersonalizadorPatos.css';

// Componente del pato 3D usando modelo GLB
function PatoModel({ customizations, cameraControlsRef }) {
  const groupRef = useRef();
  const { scene } = useGLTF('/pato.glb');
  
  useFrame((state) => {
    try {
      if (groupRef.current) {
        groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
      }
    } catch (error) {
      console.warn('Error en animación:', error);
    }
  });

  useEffect(() => {
    if (scene) {
      // Aplicar colores y propiedades de material al modelo
      scene.traverse((child) => {
        if (child.isMesh && child.material) {
          // Configurar shadows
          child.castShadow = true;
          child.receiveShadow = true;
          
          // Clonar el material para poder modificarlo individualmente
          child.material = child.material.clone();
          
          // Aplicar propiedades avanzadas
          if (child.material.metalness !== undefined) {
            child.material.metalness = customizations.metalness;
          }
          if (child.material.roughness !== undefined) {
            child.material.roughness = customizations.roughness;
          }
          
          // Aplicar colores basado en el nombre del material o mesh
          const name = child.name.toLowerCase();
          const materialName = child.material.name ? child.material.name.toLowerCase() : '';
          
          // Solo cambiar color del cuerpo y cabeza, mantener colores naturales para otras partes
          if (name.includes('body') || name.includes('cuerpo') || materialName.includes('body') ||
              name.includes('head') || name.includes('cabeza') || materialName.includes('head')) {
            child.material.color.setHex(customizations.mainColor.replace('#', '0x'));
          }
          // Mantener colores originales para pico, ojos, alas, cola
          // No aplicamos cambios a estas partes para conservar el realismo
          
          // Forzar actualización del material
          child.material.needsUpdate = true;
        }
      });
    }
  }, [scene, customizations]);

  return (
    <group ref={groupRef} scale={[0.5, 0.5, 0.5]} position={[0, -0.5, 0]}>
      <primitive object={scene} position={[0, 0, 0]} />
      
      {/* Accesorios adicionales */}
      {customizations.showHat && (
        <group position={[0, 1.5, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.5, 0.6, 0.3, 16]} />
            <meshStandardMaterial color={customizations.hatColor || '#FF0000'} />
          </mesh>
          {/* Ala del sombrero */}
          <mesh position={[0, -0.2, 0]} castShadow>
            <cylinderGeometry args={[0.8, 0.8, 0.05, 16]} />
            <meshStandardMaterial color={customizations.hatColor || '#FF0000'} />
          </mesh>
        </group>
      )}

      {customizations.showBowtie && (
        <group position={[0, 0.3, 0.5]}>
          <mesh castShadow>
            <boxGeometry args={[0.6, 0.3, 0.1]} />
            <meshStandardMaterial color={customizations.bowtieColor || '#000080'} />
          </mesh>
          {/* Centro del moño */}
          <mesh castShadow>
            <cylinderGeometry args={[0.1, 0.1, 0.15, 8]} />
            <meshStandardMaterial color="#8B4513" />
          </mesh>
        </group>
      )}
    </group>
  );
}

// Precargar el modelo GLB
useGLTF.preload('/pato.glb');

// Componente de carga mejorado para modelos 3D
function LoadingFallback() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      textAlign: 'center',
      color: '#6c757d',
      fontSize: '1.2rem',
      zIndex: 10,
      background: 'rgba(255,255,255,0.9)',
      padding: '2rem',
      borderRadius: '15px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
    }}>
      <div style={{
        fontSize: '3rem',
        marginBottom: '1rem',
        animation: 'bounce 2s infinite'
      }}>🦆</div>
      <div style={{ marginBottom: '1rem' }}>Cargando tu modelo 3D personalizado...</div>
      <div style={{
        width: '200px',
        height: '8px',
        background: '#e0e0e0',
        borderRadius: '4px',
        overflow: 'hidden',
        margin: '0 auto'
      }}>
        <div style={{
          width: `${Math.min(progress, 100)}%`,
          height: '100%',
          background: 'linear-gradient(90deg, #007bff, #28a745)',
          borderRadius: '4px',
          transition: 'width 0.3s ease'
        }} />
      </div>
      <div style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
        {Math.round(Math.min(progress, 100))}%
      </div>
    </div>
  );
}

// Componente principal mejorado
export function PersonalizadorPatos() {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const cameraControlsRef = useRef();
  const [customizations, setCustomizations] = useState({
    mainColor: '#FFD700',
    hatColor: '#FF0000',
    bowtieColor: '#000080',
    showHat: false,
    showBowtie: false,
    metalness: 0.1,
    roughness: 0.0
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleColorChange = (property, color) => {
    try {
      setCustomizations(prev => ({
        ...prev,
        [property]: color
      }));
    } catch (error) {
      console.error('Error changing color:', error);
      setError('Error al cambiar color');
    }
  };

  const toggleAccessory = (accessory) => {
    try {
      setCustomizations(prev => ({
        ...prev,
        [accessory]: !prev[accessory]
      }));
    } catch (error) {
      console.error('Error toggling accessory:', error);
      setError('Error al cambiar accesorio');
    }
  };

  const resetCustomizations = () => {
    try {
      setCustomizations({
        mainColor: '#FFD700',
        hatColor: '#FF0000',
        bowtieColor: '#000080',
        showHat: false,
        showBowtie: false,
        metalness: 0.1,
        roughness: 0.0
      });
    } catch (error) {
      console.error('Error resetting:', error);
      setError('Error al resetear');
    }
  };

  const resetCamera = () => {
    if (cameraControlsRef.current) {
      // Resetear a la posición inicial centrada para el modelo más pequeño
      cameraControlsRef.current.setPosition(0, 0, 3, true);
      cameraControlsRef.current.setTarget(0, -0.25, 0, true);
    }
  };

  const exportPato = () => {
    try {
      const patoConfig = {
        ...customizations,
        timestamp: new Date().toISOString(),
        version: '2.0',
        model: 'custom_glb'
      };
      
      console.log('🦆 Configuración del pato personalizado:', patoConfig);
      
      // Crear descarga del archivo JSON
      const dataStr = JSON.stringify(patoConfig, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `pato_personalizado_${Date.now()}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      alert('¡Pato guardado exitosamente! 🦆✨\n\n' + 
            '📂 Se ha descargado la configuración como archivo JSON\n' +
            '🎨 Puedes usar este archivo para restaurar tu pato personalizado\n' +
            '💾 Configuración también disponible en la consola del navegador');
    } catch (error) {
      console.error('Error exporting:', error);
      setError('Error al exportar');
    }
  };

  if (error) {
    return (
      <div className="personalizador-patos">
        <div className="personalizador-header">
          <h1>🦆 Personalizador de Patos Marie Gold</h1>
          <p>Ups! Algo salió mal</p>
        </div>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '400px',
          color: '#dc3545',
          textAlign: 'center',
          padding: '2rem'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>⚠️</div>
          <h3>Error en el Personalizador</h3>
          <p>{error}</p>
          <button 
            onClick={() => {
              setError(null);
              window.location.reload();
            }}
            style={{
              padding: '1rem 2rem',
              border: 'none',
              borderRadius: '8px',
              background: '#007bff',
              color: 'white',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 'bold'
            }}
          >
            🔄 Recargar Página
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="personalizador-patos">
      <div className="personalizador-header">
        <h1>🦆 Personalizador de Patos Marie Gold</h1>
        <p>En desarrollo es experimental   </p>
      </div>

      <div className="personalizador-content">
        <div className="visor-3d">
          <Canvas 
            shadows
            camera={{ position: [0, 0, 3], fov: 50 }}
            style={{ background: 'linear-gradient(135deg, #87CEEB 0%, #98D8E8 100%)' }}
            onError={(err) => {
              console.error('Canvas error:', err);
              setError('Error en el renderizado 3D');
            }}
            gl={{ 
              preserveDrawingBuffer: true, 
              antialias: true,
              alpha: false,
              powerPreference: "high-performance"
            }}
          >
            <Suspense fallback={<LoadingFallback />}>
              {/* Controles de cámara */}
              <OrbitControls 
                ref={cameraControlsRef}
                enablePan={true}
                enableZoom={true}
                enableRotate={true}
                minDistance={1.5}
                maxDistance={6}
                minPolarAngle={0}
                maxPolarAngle={Math.PI}
                target={[0, -0.25, 0]}
                autoRotate={false}
                enableDamping={true}
                dampingFactor={0.05}
              />
              
              <ambientLight intensity={0.4} />
              <directionalLight 
                position={[5, 5, 5]} 
                intensity={1}
                castShadow 
                shadow-mapSize-width={1024}
                shadow-mapSize-height={1024}
                shadow-camera-far={50}
                shadow-camera-left={-5}
                shadow-camera-right={5}
                shadow-camera-top={5}
                shadow-camera-bottom={-5}
                target-position={[0, 0, 0]}
              />
              <pointLight position={[-3, 3, 3]} intensity={0.3} />
              <pointLight position={[3, 2, -3]} intensity={0.2} />

              <PatoModel customizations={customizations} cameraControlsRef={cameraControlsRef} />
              
              <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.2, 0]} receiveShadow>
                <planeGeometry args={[8, 8]} />
                <meshStandardMaterial 
                  color="#90EE90" 
                  transparent 
                  opacity={0.3}
                />
              </mesh>
            </Suspense>
          </Canvas>
          
          {/* Panel de controles de vista */}
          <div className="controles-vista">
            <div className="control-vista-item">
              <span>🖱️ Rotar: </span>Click izquierdo + arrastrar
            </div>
            <div className="control-vista-item">
              <span>🔍 Zoom: </span>Rueda del ratón
            </div>
            <div className="control-vista-item">
              <span>↔️ Mover: </span>Click derecho + arrastrar
            </div>
            <button 
              onClick={resetCamera}
              className="btn-reset-camera"
              title="Resetear vista de la cámara al centro"
            >
              🎯 Centrar Pato
            </button>
          </div>
          
          {isLoading && <LoadingFallback />}
        </div>

        <div className="panel-controles">
          <div className="controles-secciones">
            
            <div className="seccion-controles">
              <h3>🎨 Color del Pato</h3>
              
              <div className="control-grupo-colores">
                <label>🦆 Elige un Color:</label>
                <div className="color-buttons">
                  <button 
                    className={`color-btn ${customizations.mainColor === '#FFD700' ? 'active' : ''}`}
                    style={{backgroundColor: '#FFD700'}}
                    onClick={() => handleColorChange('mainColor', '#FFD700')}
                    title="Amarillo"
                  >
                    💛
                  </button>
                  <button 
                    className={`color-btn ${customizations.mainColor === '#2C2C2C' ? 'active' : ''}`}
                    style={{backgroundColor: '#2C2C2C'}}
                    onClick={() => handleColorChange('mainColor', '#2C2C2C')}
                    title="Negro"
                  >
                    🖤
                  </button>
                  <button 
                    className={`color-btn ${customizations.mainColor === '#DDA0DD' ? 'active' : ''}`}
                    style={{backgroundColor: '#DDA0DD'}}
                    onClick={() => handleColorChange('mainColor', '#DDA0DD')}
                    title="Morado Claro"
                  >
                    💜
                  </button>
                  <button 
                    className={`color-btn ${customizations.mainColor === '#87CEEB' ? 'active' : ''}`}
                    style={{backgroundColor: '#87CEEB'}}
                    onClick={() => handleColorChange('mainColor', '#87CEEB')}
                    title="Azul Claro"
                  >
                    💙
                  </button>
                  <button 
                    className={`color-btn ${customizations.mainColor === '#90EE90' ? 'active' : ''}`}
                    style={{backgroundColor: '#90EE90'}}
                    onClick={() => handleColorChange('mainColor', '#90EE90')}
                    title="Verde"
                  >
                    💚
                  </button>
                </div>
              </div>
              
              <div className="color-info">
                <small>Selecciona uno de los colores disponibles para tu pato</small>
              </div>
            </div>

            <div className="seccion-controles">
              <h3>👒 Accesorios Exclusivos</h3>
              
              <div className="control-grupo">
                <label>
                  <input 
                    type="checkbox"
                    checked={customizations.showHat}
                    onChange={() => toggleAccessory('showHat')}
                  />
                  🎩 Sombrero Elegante
                </label>
                {customizations.showHat && (
                  <input 
                    type="color" 
                    value={customizations.hatColor}
                    onChange={(e) => handleColorChange('hatColor', e.target.value)}
                    title="Color del sombrero"
                  />
                )}
              </div>
              
              <div className="control-grupo">
                <label>
                  <input 
                    type="checkbox"
                    checked={customizations.showBowtie}
                    onChange={() => toggleAccessory('showBowtie')}
                  />
                  🎀 Corbatín de Gala
                </label>
                {customizations.showBowtie && (
                  <input 
                    type="color" 
                    value={customizations.bowtieColor}
                    onChange={(e) => handleColorChange('bowtieColor', e.target.value)}
                    title="Color del corbatín"
                  />
                )}
              </div>
            </div>

            <div className="seccion-controles acciones">
              <button onClick={resetCustomizations} className="btn-reset">
                🔄 Resetear Todo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PersonalizadorPatos;
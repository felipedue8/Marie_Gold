import React, { useRef, useEffect, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import './PersonalizadorPatos.css';

// Componente del pato 3D (versión ultra simple)
function PatoSimple({ customizations }) {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <group>
      {/* Cuerpo del pato */}
      <mesh ref={meshRef} position={[0, 0, 0]} castShadow>
        <sphereGeometry args={[1, 32, 16]} />
        <meshStandardMaterial color={customizations.bodyColor} />
      </mesh>
        
      {/* Cabeza del pato */}
      <mesh position={[0, 1.5, 0.5]} castShadow>
        <sphereGeometry args={[0.7, 32, 16]} />
        <meshStandardMaterial color={customizations.headColor} />
        
        {/* Pico */}
        <mesh position={[0, -0.2, 0.7]} rotation={[Math.PI / 6, 0, 0]} castShadow>
          <coneGeometry args={[0.15, 0.4, 8]} />
          <meshStandardMaterial color={customizations.beakColor} />
        </mesh>
        
        {/* Ojos */}
        <mesh position={[-0.3, 0.2, 0.5]}>
          <sphereGeometry args={[0.1, 16, 8]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
        <mesh position={[0.3, 0.2, 0.5]}>
          <sphereGeometry args={[0.1, 16, 8]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
      </mesh>

      {/* Alas */}
      <mesh position={[-0.8, 0.3, -0.2]} rotation={[0, 0, -0.3]} castShadow>
        <sphereGeometry args={[0.4, 16, 8]} />
        <meshStandardMaterial color={customizations.wingColor} />
      </mesh>
      <mesh position={[0.8, 0.3, -0.2]} rotation={[0, 0, 0.3]} castShadow>
        <sphereGeometry args={[0.4, 16, 8]} />
        <meshStandardMaterial color={customizations.wingColor} />
      </mesh>

      {/* Cola */}
      <mesh position={[0, 0.5, -1.3]} rotation={[0.5, 0, 0]} castShadow>
        <coneGeometry args={[0.3, 0.6, 8]} />
        <meshStandardMaterial color={customizations.tailColor} />
      </mesh>

      {/* Accesorios */}
      {customizations.showHat && (
        <mesh position={[0, 2.4, 0.5]} castShadow>
          <cylinderGeometry args={[0.5, 0.6, 0.3, 16]} />
          <meshStandardMaterial color={customizations.hatColor} />
        </mesh>
      )}

      {customizations.showBowtie && (
        <mesh position={[0, 0.8, 1.2]} castShadow>
          <boxGeometry args={[0.6, 0.3, 0.1]} />
          <meshStandardMaterial color={customizations.bowtieColor} />
        </mesh>
      )}
    </group>
  );
}

export function PersonalizadorPatosSimple() {
  const [customizations, setCustomizations] = useState({
    bodyColor: '#FFD700',
    headColor: '#FFD700',
    beakColor: '#FFA500',
    wingColor: '#FFD700',
    tailColor: '#FFD700',
    hatColor: '#FF0000',
    bowtieColor: '#000080',
    showHat: false,
    showBowtie: false,
  });

  const handleColorChange = (property, color) => {
    setCustomizations(prev => ({ ...prev, [property]: color }));
  };

  const toggleAccessory = (accessory) => {
    setCustomizations(prev => ({ ...prev, [accessory]: !prev[accessory] }));
  };

  return (
    <div className="personalizador-patos">
      <div className="personalizador-header">
        <h1>🦆 Personalizador de Patos (Versión Simple)</h1>
        <p>Versión simplificada sin dependencias complejas</p>
      </div>

      <div className="personalizador-content">
        <div className="visor-3d">
          <Canvas 
            shadows
            camera={{ position: [0, 2, 5], fov: 50 }}
            style={{ background: '#87CEEB' }}
          >
            <Suspense fallback={null}>
              <ambientLight intensity={0.6} />
              <directionalLight 
                position={[10, 10, 5]} 
                intensity={1}
                castShadow 
              />
              <pointLight position={[-10, 0, -10]} intensity={0.3} />
              
              <PatoSimple customizations={customizations} />
              
              <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
                <planeGeometry args={[20, 20]} />
                <meshStandardMaterial color="#90EE90" transparent opacity={0.5} />
              </mesh>
            </Suspense>
          </Canvas>
        </div>

        <div className="panel-controles">
          <div className="controles-secciones">
            <div className="seccion-controles">
              <h3>🎨 Colores</h3>
              
              <div className="control-grupo">
                <label>Cuerpo:</label>
                <input 
                  type="color" 
                  value={customizations.bodyColor}
                  onChange={(e) => handleColorChange('bodyColor', e.target.value)}
                />
              </div>
              
              <div className="control-grupo">
                <label>Cabeza:</label>
                <input 
                  type="color" 
                  value={customizations.headColor}
                  onChange={(e) => handleColorChange('headColor', e.target.value)}
                />
              </div>
              
              <div className="control-grupo">
                <label>Pico:</label>
                <input 
                  type="color" 
                  value={customizations.beakColor}
                  onChange={(e) => handleColorChange('beakColor', e.target.value)}
                />
              </div>
              
              <div className="control-grupo">
                <label>Alas:</label>
                <input 
                  type="color" 
                  value={customizations.wingColor}
                  onChange={(e) => handleColorChange('wingColor', e.target.value)}
                />
              </div>
            </div>

            <div className="seccion-controles">
              <h3>👒 Accesorios</h3>
              
              <div className="control-grupo">
                <label>
                  <input 
                    type="checkbox"
                    checked={customizations.showHat}
                    onChange={() => toggleAccessory('showHat')}
                  />
                  Sombrero
                </label>
                {customizations.showHat && (
                  <input 
                    type="color" 
                    value={customizations.hatColor}
                    onChange={(e) => handleColorChange('hatColor', e.target.value)}
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
                  Corbatín
                </label>
                {customizations.showBowtie && (
                  <input 
                    type="color" 
                    value={customizations.bowtieColor}
                    onChange={(e) => handleColorChange('bowtieColor', e.target.value)}
                  />
                )}
              </div>
            </div>

            <div className="seccion-controles">
              <button 
                onClick={() => alert('¡Pato guardado! 🦆')}
                className="btn-export"
              >
                💾 Guardar Pato Simple
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PersonalizadorPatosSimple;
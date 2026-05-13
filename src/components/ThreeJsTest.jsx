import React from 'react';
import { Canvas } from '@react-three/fiber';

function SimpleBox() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
}

export function ThreeJsTest() {
  return (
    <div style={{ width: '100%', height: '500px', border: '1px solid #ccc' }}>
      <Canvas>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} />
        <SimpleBox />
      </Canvas>
    </div>
  );
}

import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import Brain from './brain-scene/Brain';
import { RotateCw, Pause } from 'lucide-react';

// Main scene component
const BrainScene = () => {
  const [autoRotate, setAutoRotate] = useState(false);

  const toggleAutoRotate = () => {
    setAutoRotate(prev => !prev);
  };

  return (
    <div style={{ width: '100%', height: '100vh', overflow: 'hidden' }}>
      <Canvas>
        <ambientLight intensity={0.5} />
        <directionalLight position={[1, 1, 1]} intensity={0.5} />
        <pointLight position={[0, 10, 0]} intensity={0.5} color="#D946EF" />
        
        <PerspectiveCamera makeDefault position={[0, 5, 50]} />
        <OrbitControls 
          enableDamping 
          dampingFactor={0.05} 
          enableZoom={true}
          autoRotate={autoRotate}
          autoRotateSpeed={1}
        />
        
        <fog attach="fog" args={['#000000', 25, 40]} />
        <Brain autoRotate={autoRotate} />
      </Canvas>

      <button 
        onClick={toggleAutoRotate}
        className="absolute bottom-4 right-4 bg-gray-800 bg-opacity-60 text-white p-2 rounded-full flex items-center justify-center z-10 hover:bg-gray-700 transition-colors"
        aria-label={autoRotate ? "Pause rotation" : "Auto-rotate"}
      >
        {autoRotate ? <Pause size={24} /> : <RotateCw size={24} />}
      </button>
    </div>
  );
};

export default BrainScene;

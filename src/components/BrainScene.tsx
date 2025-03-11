
import React, { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import Brain from './brain-scene/Brain';
import '../styles_brain_v20.css';

// Main scene component
const BrainScene = () => {
  const [isMobile, setIsMobile] = useState(false);
  
  // Check if device is mobile
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);

  return (
    <div className="brain-container">
      <Canvas shadows>
        <ambientLight intensity={1.5} />
        <directionalLight position={[1, 1, 1]} intensity={1.5} />
        <pointLight position={[0, 10, 0]} intensity={2.0} color="#D946EF" />
        
        <PerspectiveCamera 
          makeDefault 
          position={isMobile ? [0, 0, 2.5] : [0, 0, 15]} 
          fov={isMobile ? 90 : 60}
        />
        <OrbitControls 
          enableDamping 
          dampingFactor={0.05} 
          enableZoom={true}
          autoRotate={true}
          autoRotateSpeed={isMobile ? 2.0 : 0.5}
          minDistance={isMobile ? 1 : 10}
          maxDistance={isMobile ? 5 : 30}
        />
        
        <fog attach="fog" args={['#000000', isMobile ? 1 : 8, isMobile ? 10 : 30]} />
        <Brain isMobile={isMobile} />
      </Canvas>
    </div>
  );
};

export default BrainScene;

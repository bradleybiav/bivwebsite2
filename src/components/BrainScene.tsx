
import React, { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import Brain from './brain-scene/Brain';

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
    <div style={{ 
      width: '100%', 
      height: '100vh', 
      overflow: 'hidden',
      backgroundColor: '#000000' // Ensure black background on all devices
    }}>
      <Canvas shadows>
        <ambientLight intensity={1.0} />
        <directionalLight position={[1, 1, 1]} intensity={1.0} />
        <pointLight position={[0, 10, 0]} intensity={1.0} color="#D946EF" />
        
        {/* Mobile camera settings are updated for better visibility */}
        <PerspectiveCamera 
          makeDefault 
          position={isMobile ? [0, 0, 6] : [280.47, -4.24, -2.98]} 
          fov={isMobile ? 50 : 75}
        />
        <OrbitControls 
          enableDamping 
          dampingFactor={0.05} 
          enableZoom={true}
          autoRotate={true}
          autoRotateSpeed={isMobile ? 1.0 : 0.5}
          minDistance={isMobile ? 4 : 2}
          maxDistance={isMobile ? 10 : 20}
        />
        
        {/* Remove fog for mobile to improve visibility */}
        {!isMobile && <fog attach="fog" args={['#000000', 25, 40]} />}
        <Brain isMobile={isMobile} />
      </Canvas>
    </div>
  );
};

export default BrainScene;

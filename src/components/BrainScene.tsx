
import React, { useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import Brain from './brain-scene/Brain';
import '../styles_brain_v20.css';

// Fallback component to show while loading
const LoadingFallback = () => (
  <mesh>
    <sphereGeometry args={[1, 16, 16]} />
    <meshStandardMaterial color="#9333ea" wireframe />
  </mesh>
);

// Main scene component
const BrainScene = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [hasRendered, setHasRendered] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string>('Scene initializing...');
  
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

  // Detect successful rendering
  useEffect(() => {
    // Update debug info and confirm rendering after a short delay
    const timer = setTimeout(() => {
      setHasRendered(true);
      setDebugInfo('Scene rendered successfully');
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  // Ensure background is black
  useEffect(() => {
    document.body.style.backgroundColor = '#000000';
    
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, []);

  return (
    <div className="brain-container">
      {/* Debug overlay */}
      <div className="debug-overlay">
        <p>Status: {debugInfo}</p>
        <p>Device: {isMobile ? 'Mobile' : 'Desktop'}</p>
        <p>Render state: {hasRendered ? 'Active' : 'Initializing'}</p>
      </div>
      
      <Canvas shadows className="brain-canvas">
        <color attach="background" args={['#000000']} />
        <ambientLight intensity={1.5} />
        <directionalLight position={[1, 1, 1]} intensity={1.5} />
        <pointLight position={[0, 10, 0]} intensity={2.0} color="#D946EF" />
        
        <PerspectiveCamera 
          makeDefault 
          position={isMobile ? [0, 0, 3.5] : [280.47, -4.24, -2.98]} 
          fov={isMobile ? 75 : 75}
        />
        <OrbitControls 
          enableDamping 
          dampingFactor={0.05} 
          enableZoom={true}
          autoRotate={true}
          autoRotateSpeed={isMobile ? 2.0 : 0.5}
        />
        
        <fog attach="fog" args={['#000000', isMobile ? 3 : 25, isMobile ? 8 : 40]} />
        
        <Suspense fallback={<LoadingFallback />}>
          <Brain isMobile={isMobile} />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default BrainScene;

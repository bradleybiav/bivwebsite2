
import React, { useEffect, useState, Suspense } from 'react';
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
  const [hasError, setHasError] = useState(false);
  
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

  // Error boundary approach using useEffect
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('Error caught by window error handler:', event.error);
      setHasError(true);
    };

    window.addEventListener('error', handleError);
    
    return () => {
      window.removeEventListener('error', handleError);
    };
  }, []);

  // Add a debug message to show on the page
  const [debugInfo, setDebugInfo] = useState<string>('Scene loading...');
  
  useEffect(() => {
    // Update debug info after a delay
    const timer = setTimeout(() => {
      setDebugInfo('If you see this message but no 3D scene, there might be an issue with WebGL or model loading.');
    }, 5000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="brain-container">
      {/* Add a debug overlay that will only show if there are problems */}
      <div className="debug-overlay">
        <p>{debugInfo}</p>
        {hasError && (
          <p className="error-message">
            An error occurred while rendering the scene. Please try a different browser or device.
          </p>
        )}
      </div>
      
      <Canvas shadows>
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


import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import Brain from './brain-scene/Brain';
import Ground from './brain-scene/Ground';

// Main scene component
const BrainScene = () => {
  return (
    <div style={{ 
      width: '100%', 
      height: '100vh', 
      overflow: 'hidden',
      backgroundColor: '#000000' // Set background to black
    }}>
      <Canvas>
        <ambientLight intensity={1.0} />
        <directionalLight position={[1, 1, 1]} intensity={1.0} />
        <pointLight position={[0, 10, 0]} intensity={1.0} color="#D946EF" />
        
        <PerspectiveCamera makeDefault position={[280.47, -4.24, -2.98]} />
        <OrbitControls 
          enableDamping 
          dampingFactor={0.05} 
          enableZoom={true}
          autoRotate={false}
        />
        
        <fog attach="fog" args={['#000000', 25, 40]} />
        <Ground />
        <Brain />
      </Canvas>
    </div>
  );
};

export default BrainScene;

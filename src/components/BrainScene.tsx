
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import Brain from './brain-scene/Brain';
import PositionTool from './brain-scene/PositionTool';

// Main scene component
const BrainScene = () => {
  return (
    <div style={{ width: '100%', height: '100vh', overflow: 'hidden', background: 'black' }}>
      <Canvas shadows>
        <ambientLight intensity={1.0} />
        <directionalLight position={[1, 1, 1]} intensity={1.0} />
        <pointLight position={[0, 10, 0]} intensity={1.0} color="#D946EF" />
        
        {/* Camera positioned for a good view of the brain */}
        <PerspectiveCamera makeDefault position={[0, 0, 10]} />
        <OrbitControls 
          enableDamping 
          dampingFactor={0.05} 
          enableZoom={true}
          autoRotate={false}
        />
        
        <fog attach="fog" args={['#000000', 25, 40]} />
        <Brain />
      </Canvas>
      <PositionTool />
    </div>
  );
};

export default BrainScene;

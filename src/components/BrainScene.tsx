
import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import Brain from './brain-scene/Brain';
import CoordinatesDisplay from './brain-scene/CoordinatesDisplay';

// Main scene component
const BrainScene = () => {
  const [brainPosition, setBrainPosition] = useState<[number, number, number]>([0, 1, 0]);
  const [brainRotation, setBrainRotation] = useState<[number, number, number]>([0, 0, 0]);
  const [brainScale, setBrainScale] = useState<number>(3.5);

  const handlePositionChange = (
    position: [number, number, number],
    rotation: [number, number, number],
    scale: number
  ) => {
    setBrainPosition(position);
    setBrainRotation(rotation);
    setBrainScale(scale);
  };

  return (
    <div style={{ width: '100%', height: '100vh', overflow: 'hidden', position: 'relative' }}>
      <Canvas>
        <ambientLight intensity={1.0} />
        <directionalLight position={[1, 1, 1]} intensity={1.0} />
        <pointLight position={[0, 10, 0]} intensity={1.0} color="#D946EF" />
        
        {/* Positioned camera further back for a more zoomed-out view */}
        <PerspectiveCamera makeDefault position={[0, 0, 40]} />
        <OrbitControls 
          enableDamping 
          dampingFactor={0.05} 
          enableZoom={true}
          autoRotate={false}
        />
        
        <fog attach="fog" args={['#000000', 25, 40]} />
        <Brain onPositionChange={handlePositionChange} />
      </Canvas>
      <CoordinatesDisplay 
        position={brainPosition}
        rotation={brainRotation}
        scale={brainScale}
      />
    </div>
  );
};

export default BrainScene;

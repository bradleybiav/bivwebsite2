
import React, { useState, useRef } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import Brain from './brain-scene/Brain';
import * as THREE from 'three';

// Camera and brain position tracker
const CameraTracker = ({ onCameraChange }) => {
  const { camera, scene } = useThree();
  const brainRef = useRef(null);
  
  // Find brain object in scene
  useFrame(() => {
    // This runs every frame to update camera position
    onCameraChange(camera.position.clone());
    
    // Try to find the brain object in the scene if we haven't found it yet
    if (!brainRef.current) {
      scene.traverse((object) => {
        if (object.name === 'Brain' || (object.type === 'Group' && object.children.length > 0)) {
          brainRef.current = object;
        }
      });
    }
  });
  
  return null;
};

// Main scene component
const BrainScene = () => {
  const [brainPosition, setBrainPosition] = useState<[number, number, number]>([0, 1, 0]);
  const [brainRotation, setBrainRotation] = useState<[number, number, number]>([0, 0, 0]);
  const [brainScale, setBrainScale] = useState<number>(3.5);
  const [cameraPosition, setCameraPosition] = useState<THREE.Vector3>(new THREE.Vector3(0, 0, 10));
  
  // This is the position you'll want to use as the starting point
  // The brain component will pick this up and use it
  const idealPosition: [number, number, number] = [0, 0.97, 0];
  const idealRotation: [number, number, number] = [0, 0, 0];
  const idealScale = 3.43;

  const handlePositionChange = (
    position: [number, number, number],
    rotation: [number, number, number],
    scale: number
  ) => {
    setBrainPosition(position);
    setBrainRotation(rotation);
    setBrainScale(scale);
  };

  const handleCameraChange = (position: THREE.Vector3) => {
    setCameraPosition(position);
  };

  return (
    <div style={{ width: '100%', height: '100vh', overflow: 'hidden', position: 'relative', background: '#000' }}>
      <Canvas shadows>
        {/* Enhanced lighting for better visibility */}
        <ambientLight intensity={2.5} />
        <directionalLight position={[5, 5, 5]} intensity={2.5} />
        <directionalLight position={[-5, -5, -5]} intensity={2.0} />
        <pointLight position={[0, 5, 0]} intensity={3.0} color="#D946EF" />
        <pointLight position={[0, -5, 0]} intensity={2.0} color="#0EA5E9" />
        
        {/* Updated camera position based on user's preference */}
        <PerspectiveCamera makeDefault position={[0, 0, 10]} />
        <OrbitControls 
          enableDamping 
          dampingFactor={0.05} 
          enableZoom={true}
          autoRotate={false}
        />
        
        <CameraTracker onCameraChange={handleCameraChange} />
        
        <fog attach="fog" args={['#000000', 25, 40]} />
        <Brain onPositionChange={handlePositionChange} />
      </Canvas>
    </div>
  );
};

export default BrainScene;

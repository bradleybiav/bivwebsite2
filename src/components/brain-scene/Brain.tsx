
import React, { useRef, useEffect, useState } from 'react';
import { useFrame, useLoader, extend } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'three';
import ScreamShaderMaterial from './ScreamShaderMaterial';

// Register the custom shader
extend({ ScreamShaderMaterial });

interface BrainProps {
  onPositionChange?: (position: [number, number, number], rotation: [number, number, number], scale: number) => void;
}

const Brain: React.FC<BrainProps> = ({ onPositionChange }) => {
  const brainRef = useRef<THREE.Group>();
  const gltf = useLoader(GLTFLoader, './brainBBBBB.glb');
  const [shaderMaterialRef] = useState(() => new ScreamShaderMaterial());
  
  // Updated values based on user's preferred position
  const basePosition: [number, number, number] = [0, 0.97, 0];
  const baseRotation: [number, number, number] = [0, 0, 0];
  const baseScale = 3.43;
  
  // Apply shader material to brain model
  useEffect(() => {
    if (brainRef.current) {
      console.log("Applying ScreamShaderMaterial to brain model");
      
      brainRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.material = shaderMaterialRef;
          console.log("Applied ScreamShaderMaterial to mesh:", child.name);
        }
      });
    }
  }, [shaderMaterialRef]);
  
  // Animation loop
  useFrame(({ clock }) => {
    if (brainRef.current) {
      const time = clock.getElapsedTime();
      
      // Update shader uniforms
      if (shaderMaterialRef.uniforms) {
        shaderMaterialRef.uniforms.time.value = time;
        shaderMaterialRef.uniforms.seed.value = Math.sin(time * 0.1) * 0.5 + 0.5;
      }
      
      // Simple rotation
      brainRef.current.rotation.y += 0.003;
      
      // Floating animation
      brainRef.current.position.y = basePosition[1] + Math.sin(time * 0.5) * 0.2;
      
      // Breathing animation
      const breathScale = baseScale + Math.sin(time * 0.8) * 0.1;
      brainRef.current.scale.set(breathScale, breathScale, breathScale);
      
      // Call the callback with current position and rotation
      if (onPositionChange) {
        onPositionChange(
          [
            brainRef.current.position.x, 
            brainRef.current.position.y, 
            brainRef.current.position.z
          ],
          [
            brainRef.current.rotation.x, 
            brainRef.current.rotation.y, 
            brainRef.current.rotation.z
          ],
          breathScale
        );
      }
    }
  });

  // Debug logging
  console.log("Brain model loaded, object count:", gltf.scene.children.length);

  return (
    <primitive 
      object={gltf.scene.clone()} 
      ref={brainRef} 
      position={basePosition} 
      rotation={baseRotation}
      scale={[baseScale, baseScale, baseScale]} 
      name="Brain"
    />
  );
};

export default Brain;

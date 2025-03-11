
import React, { useRef, useEffect } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'three';

interface BrainProps {
  onPositionChange?: (position: [number, number, number], rotation: [number, number, number], scale: number) => void;
}

const Brain: React.FC<BrainProps> = ({ onPositionChange }) => {
  const brainRef = useRef<THREE.Group>();
  const gltf = useLoader(GLTFLoader, './brainBBBBB.glb');
  
  // Updated values based on user's preferred position
  const basePosition: [number, number, number] = [0, 0.97, 0];
  const baseRotation: [number, number, number] = [0, 0, 0];
  const baseScale = 3.43;
  
  // Create colorful material for the brain
  useEffect(() => {
    if (brainRef.current) {
      console.log("Applying materials to brain model");
      
      brainRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          // Create a vibrant material that will definitely be visible
          const material = new THREE.MeshPhongMaterial({
            color: new THREE.Color(0.8, 0.2, 0.8),
            emissive: new THREE.Color(0.2, 0.0, 0.3),
            specular: new THREE.Color(1, 1, 1),
            shininess: 100,
            transparent: true,
            opacity: 0.9,
            side: THREE.DoubleSide
          });
          
          // Apply the material to the mesh
          child.material = material;
          console.log("Applied material to mesh:", child.name);
        }
      });
    }
  }, []);
  
  // Animation loop
  useFrame(({ clock }) => {
    if (brainRef.current) {
      const time = clock.getElapsedTime();
      
      // Simple rotation
      brainRef.current.rotation.y += 0.003;
      
      // Floating animation
      brainRef.current.position.y = basePosition[1] + Math.sin(time * 0.5) * 0.2;
      
      // Breathing animation
      const breathScale = baseScale / 3.5 + Math.sin(time * 0.8) * 0.02;
      const currentScale = baseScale * breathScale;
      brainRef.current.scale.set(currentScale, currentScale, currentScale);
      
      // Colorful animation
      brainRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshPhongMaterial) {
          // Animate colors over time
          const r = 0.5 + 0.5 * Math.sin(time / 2);
          const g = 0.5 + 0.5 * Math.sin(time / 3);
          const b = 0.5 + 0.5 * Math.sin(time / 4);
          child.material.color.setRGB(r, g, b);
          child.material.emissive.setRGB(r * 0.2, g * 0.2, b * 0.2);
        }
      });
      
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
          currentScale
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
    />
  );
};

export default Brain;

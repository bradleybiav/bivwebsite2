
import React, { useRef, useEffect, useState } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'three';
import ScreamShaderMaterial from './ScreamShaderMaterial';

interface BrainProps {
  onPositionChange?: (position: [number, number, number], rotation: [number, number, number], scale: number) => void;
}

const Brain: React.FC<BrainProps> = ({ onPositionChange }) => {
  const brainRef = useRef<THREE.Group>();
  const materialRef = useRef<ScreamShaderMaterial>();
  const gltf = useLoader(GLTFLoader, './brainBBBBB.glb');
  
  // Updated values based on user's preferred position
  const basePosition: [number, number, number] = [0, 0.97, 0];
  const baseRotation: [number, number, number] = [0, 0, 0];
  const baseScale = 3.43;
  
  // Create shader material outside the animation loop
  useEffect(() => {
    if (brainRef.current) {
      const shaderMaterial = new ScreamShaderMaterial();
      materialRef.current = shaderMaterial;
      
      brainRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          // Apply the shader material to each mesh
          child.material = shaderMaterial;
          
          // Important: Enable transparency for the material
          child.material.transparent = true;
          child.material.side = THREE.DoubleSide;
          
          // Store original geometry normals if needed
          if (!child.userData.originalNormals) {
            const normals = child.geometry.attributes.normal.array;
            child.userData.originalNormals = [...normals];
          }
        }
      });
    }
  }, []);
  
  // Animation loop
  useFrame(({ clock }) => {
    if (materialRef.current) {
      // Update shader uniforms for animation
      materialRef.current.uniforms.time.value = clock.getElapsedTime();
      materialRef.current.uniforms.seed.value = Math.sin(clock.getElapsedTime() / 3) * 3;
      
      // Animate color with more variance
      const r = 0.5 + 0.5 * Math.sin(clock.getElapsedTime() / 7);
      const g = 0.5 + 0.5 * Math.sin(clock.getElapsedTime() / 8);
      const b = 0.5 + 0.5 * Math.sin(clock.getElapsedTime() / 5);
      materialRef.current.uniforms.color.value.set(r, g, b);
      
      // Modify scale value for noise pattern size
      materialRef.current.uniforms.scale.value = 1.0 + 0.2 * Math.sin(clock.getElapsedTime() / 10);
    }
    
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

  // Add console logging to help debug
  console.log("Brain model loaded:", gltf);

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

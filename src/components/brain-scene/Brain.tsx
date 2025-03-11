import React, { useRef, useEffect } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as THREE from 'three';
import ScreamShaderMaterial from './ScreamShaderMaterial';

const Brain = () => {
  // Define orbit parameters
  const orbitRadius = 20; // Distance from center/camera
  const orbitHeight = 0.97; // Height of the brain from the ground
  const baseRotation: [number, number, number] = [0, 0, 0];
  const baseScale = 3.43;

  const brainRef = useRef<THREE.Group>();
  const materialRef = useRef<any>();
  const gltf = useLoader(GLTFLoader, '/brainBBBBB.glb');
  
  // Animation loop
  useFrame(({ clock }) => {
    if (materialRef.current) {
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
      // Calculate orbit position
      const time = clock.getElapsedTime();
      const speed = 0.003 * 1.65; // Keep the same rotation speed
      const angle = time * speed;
      
      // Calculate new position in orbit
      const x = Math.sin(angle) * orbitRadius;
      const z = Math.cos(angle) * orbitRadius;
      
      // Set position (maintain y value for vertical floating)
      brainRef.current.position.x = x;
      brainRef.current.position.z = z;
      brainRef.current.position.y = orbitHeight + Math.sin(time * 0.5) * 0.2;
      
      // Make brain always face the center/camera
      brainRef.current.rotation.y = angle + Math.PI; // Add PI to face the center
      
      // Breathing animation based on the baseScale
      const breathScale = 1 + Math.sin(time * 0.8) * 0.02;
      const finalScale = baseScale * breathScale;
      brainRef.current.scale.set(finalScale, finalScale, finalScale);
    }
  });
  
  // Apply shader material to all brain meshes
  useEffect(() => {
    if (brainRef.current) {
      // Create a single instance of the shader material
      const shaderMaterial = new ScreamShaderMaterial();
      materialRef.current = shaderMaterial;
      
      // Apply to all meshes in the model
      brainRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.material = shaderMaterial;
        }
      });
    }
  }, []);

  // Starting position needs to be on the orbit path
  const initialX = Math.sin(0) * orbitRadius;
  const initialZ = Math.cos(0) * orbitRadius;
  const initialPosition: [number, number, number] = [initialX, orbitHeight, initialZ];

  return (
    <primitive 
      object={gltf.scene.clone()} 
      ref={brainRef} 
      position={initialPosition} 
      rotation={baseRotation}
      scale={[baseScale, baseScale, baseScale]} 
    />
  );
};

export default Brain;


import React, { useRef, useEffect } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as THREE from 'three';
import ScreamShaderMaterial from './ScreamShaderMaterial';

const Brain = () => {
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
      // Simple rotation
      brainRef.current.rotation.y += 0.003;
      
      // Floating animation
      const time = clock.getElapsedTime();
      brainRef.current.position.y = 1 + Math.sin(time * 0.5) * 0.2;
      
      // Breathing animation
      const breathScale = 1 + Math.sin(time * 0.8) * 0.02;
      brainRef.current.scale.set(4 * breathScale, 4 * breathScale, 4 * breathScale);
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

  return (
    <primitive 
      object={gltf.scene.clone()} 
      ref={brainRef} 
      position={[0, 1, 0]} 
      scale={[4, 4, 4]} 
    />
  );
};

export default Brain;

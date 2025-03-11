
import React, { useRef, useEffect } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as THREE from 'three';
import ScreamShaderMaterial from './ScreamShaderMaterial';

interface BrainProps {
  isMobile?: boolean;
}

const Brain = ({ isMobile = false }: BrainProps) => {
  // Significantly different position for mobile to ensure visibility
  const basePosition: [number, number, number] = isMobile ? [0, 0, 0] : [0, 0.97, 0];
  const baseRotation: [number, number, number] = [0, 0, 0];
  const baseScale = isMobile ? 2.5 : 4.5; // Larger scale for mobile

  const brainRef = useRef<THREE.Group>();
  const materialRef = useRef<any>();
  const gltf = useLoader(GLTFLoader, '/brainBBBBB.glb');
  
  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = clock.getElapsedTime();
      materialRef.current.uniforms.seed.value = Math.sin(clock.getElapsedTime() / 3) * 3;
      
      const r = 0.5 + 0.5 * Math.sin(clock.getElapsedTime() / 7);
      const g = 0.5 + 0.5 * Math.sin(clock.getElapsedTime() / 8);
      const b = 0.5 + 0.5 * Math.sin(clock.getElapsedTime() / 5);
      materialRef.current.uniforms.color.value.set(r, g, b);
      
      materialRef.current.uniforms.scale.value = 1.0 + 0.2 * Math.sin(clock.getElapsedTime() / 10);
    }
    
    if (brainRef.current) {
      // Faster rotation for mobile for more visibility
      brainRef.current.rotation.y += isMobile ? 0.02 : 0.003;
      
      // Adjust vertical position animation - smaller oscillation for mobile
      const time = clock.getElapsedTime();
      const verticalOffset = Math.sin(time * 0.5) * (isMobile ? 0.1 : 0.2);
      brainRef.current.position.y = basePosition[1] + verticalOffset;
      
      // More pronounced breathing effect for mobile
      const breathScale = 1 + Math.sin(time * 0.8) * (isMobile ? 0.05 : 0.02);
      const finalScale = baseScale * breathScale;
      brainRef.current.scale.set(finalScale, finalScale, finalScale);
    }
  });
  
  useEffect(() => {
    if (brainRef.current) {
      const shaderMaterial = new ScreamShaderMaterial();
      materialRef.current = shaderMaterial;
      
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
      position={basePosition} 
      rotation={baseRotation}
      scale={[baseScale, baseScale, baseScale]} 
    />
  );
};

export default Brain;

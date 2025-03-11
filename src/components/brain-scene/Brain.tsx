
import React, { useRef, useEffect, useState } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as THREE from 'three';
import ScreamShaderMaterial from './ScreamShaderMaterial';

interface BrainProps {
  isMobile?: boolean;
}

const Brain = ({ isMobile = false }: BrainProps) => {
  // Center the brain vertically on mobile, keep desktop position
  const basePosition: [number, number, number] = isMobile ? [0, -0.5, 0] : [0, 0.97, 0];
  const baseRotation: [number, number, number] = [0, 0, 0];
  const baseScale = isMobile ? 1.5 : 4.5; // Smaller scale for mobile

  const brainRef = useRef<THREE.Group>();
  const materialRef = useRef<any>();
  const [modelError, setModelError] = useState<string | null>(null);
  
  // Try multiple paths to find the model
  const possiblePaths = [
    '/brainBBBBB.glb',        // Absolute path for development
    './brainBBBBB.glb',       // Relative path for production
    '../brainBBBBB.glb',      // One directory up
    'brainBBBBB.glb'          // Just the filename
  ];
  
  // Use the first path for initial loading
  let modelPath = possiblePaths[0];
  
  // If we're not on localhost, start with the relative path
  if (window.location.hostname !== 'localhost') {
    modelPath = possiblePaths[1];
  }
  
  // Use error handling with the loader
  const gltf = useLoader(
    GLTFLoader, 
    modelPath, 
    undefined,
    (error) => {
      console.error('Error loading model:', error);
      // Fix: Don't try to access .message on ProgressEvent
      setModelError(`Failed to load model: ${error.type || 'Unknown error'}`);
    }
  );
  
  useEffect(() => {
    // Log successful loading
    if (gltf) {
      console.log('Model loaded successfully from:', modelPath);
    }
    
    // If we have an error and there are more paths to try, we could implement
    // fallback loading here in a more complex app
  }, [gltf, modelPath]);
  
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
      
      // Adjust vertical position animation
      const time = clock.getElapsedTime();
      const verticalOffset = Math.sin(time * 0.5) * (isMobile ? 0.1 : 0.2);
      brainRef.current.position.y = basePosition[1] + verticalOffset;
      
      const breathScale = 1 + Math.sin(time * 0.8) * 0.02;
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

  // If there's an error loading the model, we still return null to not break the scene
  if (modelError) {
    console.error(modelError);
    return null;
  }

  return (
    <primitive 
      object={gltf?.scene.clone()} 
      ref={brainRef} 
      position={basePosition} 
      rotation={baseRotation}
      scale={[baseScale, baseScale, baseScale]} 
    />
  );
};

export default Brain;

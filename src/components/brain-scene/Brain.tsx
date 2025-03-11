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
  const [loadAttempt, setLoadAttempt] = useState(0);
  
  // Try multiple paths to find the model
  const possiblePaths = [
    '/brainBBBBB.glb',
    './brainBBBBB.glb',
    '../brainBBBBB.glb',
    'brainBBBBB.glb',
    'public/brainBBBBB.glb',
    '/public/brainBBBBB.glb'
  ];
  
  // Use the current attempt index to determine which path to try
  const modelPath = possiblePaths[loadAttempt % possiblePaths.length];
  
  // Log attempts for debugging
  useEffect(() => {
    console.log(`Attempting to load model from: ${modelPath} (attempt ${loadAttempt + 1}/${possiblePaths.length})`);
  }, [modelPath, loadAttempt]);
  
  // Use error handling with the loader
  const model = useLoader(
    GLTFLoader, 
    modelPath, 
    undefined,
    (error) => {
      console.error('Error loading model:', error);
      setModelError(`Failed to load model from ${modelPath}: ${error.type || 'Unknown error'}`);
      
      // Try the next path if we haven't tried all of them yet
      if (loadAttempt < possiblePaths.length - 1) {
        setTimeout(() => {
          setLoadAttempt(loadAttempt + 1);
        }, 500); // Small delay before trying next path
      } else {
        console.error('All model loading attempts failed');
      }
    }
  );
  
  // Check if the model loaded correctly
  useEffect(() => {
    if (model) {
      console.log('Model loaded successfully from:', modelPath);
      setModelError(null); // Clear any previous errors
    }
  }, [model, modelPath]);
  
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

  // If we've tried all paths and still have an error, render a fallback sphere
  if (modelError && loadAttempt >= possiblePaths.length - 1) {
    console.warn('Using fallback geometry due to model loading failure');
    return (
      <mesh position={basePosition} scale={[baseScale * 0.3, baseScale * 0.3, baseScale * 0.3]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="#ff00ff" />
      </mesh>
    );
  }

  // Model loaded successfully, render it
  if (model) {
    return (
      <primitive 
        object={model.scene.clone()} 
        ref={brainRef} 
        position={basePosition} 
        rotation={baseRotation}
        scale={[baseScale, baseScale, baseScale]} 
      />
    );
  }

  // Still loading or retrying, show nothing
  return null;
};

export default Brain;

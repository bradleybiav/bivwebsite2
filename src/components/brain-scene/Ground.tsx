
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

const Ground = () => {
  const groundRef = useRef<THREE.Mesh>(null);
  const textureRef = useRef<THREE.CanvasTexture | null>(null);
  
  // Create the grass texture once
  useEffect(() => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      canvas.width = 256;
      canvas.height = 256;
      
      // Fill with dark green base
      ctx.fillStyle = '#0a3200';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw random green pixels for grass texture (similar to "Brain and motion")
      for (let i = 0; i < 100000; i++) {
        // Use colors closer to the reference image
        ctx.fillStyle = `hsl(${100 + 40 * Math.random()}, ${70 + 20 * Math.random()}%, ${30 + 20 * Math.random()}%)`;
        ctx.fillRect(
          Math.floor(Math.random() * 256),
          Math.floor(Math.random() * 256),
          1 + Math.floor(Math.random() * 2), // Varied pixel sizes
          1 + Math.floor(Math.random() * 2)
        );
      }
      
      textureRef.current = new THREE.CanvasTexture(canvas);
      textureRef.current.wrapS = THREE.RepeatWrapping;
      textureRef.current.wrapT = THREE.RepeatWrapping;
      textureRef.current.repeat.set(100, 100); // More repetition for dense appearance
    }
  }, []);
  
  // Animate the ground texture
  useFrame(({ clock }) => {
    if (textureRef.current) {
      // Slowly shift the texture for a subtle movement effect
      textureRef.current.offset.x = Math.sin(clock.getElapsedTime() * 0.05) * 0.01;
      textureRef.current.offset.y = Math.cos(clock.getElapsedTime() * 0.05) * 0.01;
      textureRef.current.needsUpdate = true;
    }
  });
  
  return (
    <mesh 
      ref={groundRef} 
      rotation={[0, 0, 0]} 
      position={[0, 0, -20]} // Position behind the brain as a wall/backdrop
      receiveShadow
    >
      <planeGeometry args={[2000, 2000]} />
      <meshStandardMaterial 
        map={textureRef.current || undefined} 
        roughness={0.8}
        metalness={0.2}
      />
    </mesh>
  );
};

export default Ground;

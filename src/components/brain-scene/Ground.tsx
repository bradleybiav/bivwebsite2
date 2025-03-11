
import React, { useRef, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

const Ground = () => {
  const groundRef = useRef<THREE.Mesh>(null);
  const { scene } = useThree();
  
  // Create texture for grass
  useEffect(() => {
    const createTexture = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) return null;
      
      canvas.width = 256;
      canvas.height = 256;
      
      // Draw random green pixels for grass (more varied greens)
      for (let i = 0; i < 100000; i++) {
        // Use various shades of green for grass, similar to the reference image
        ctx.fillStyle = `hsl(${100 + 40 * Math.random()}, ${60 + 20 * Math.random()}%, ${30 + 30 * Math.random()}%)`;
        ctx.fillRect(
          Math.floor(Math.random() * 256),
          Math.floor(Math.random() * 256),
          1,
          1
        );
      }
      
      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(6, 6);
      
      return texture;
    };
    
    if (groundRef.current) {
      const texture = createTexture();
      if (texture) {
        groundRef.current.material = new THREE.MeshBasicMaterial({ map: texture });
      }
    }
  }, []);
  
  return (
    <mesh 
      ref={groundRef} 
      rotation={[-Math.PI / 2, 0, 0]} 
      position={[0, -5, 0]} 
      receiveShadow
    >
      <planeGeometry args={[1000, 1000]} />
      <meshBasicMaterial color="#1a6e1a" />
    </mesh>
  );
};

export default Ground;

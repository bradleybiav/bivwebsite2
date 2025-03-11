
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const Ground = () => {
  const groundTexture = useRef<THREE.CanvasTexture>();
  
  useEffect(() => {
    // Create green grass texture
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      canvas.width = 256;
      canvas.height = 256;
      
      // Draw random green pixels for grass
      for (let i = 0; i < 100000; i++) {
        ctx.fillStyle = `hsl(${100 + 40 * Math.random()}, 70%, ${30 + 30 * Math.random()}%)`;
        ctx.fillRect(
          Math.floor(Math.random() * 256),
          Math.floor(Math.random() * 256),
          1,
          1
        );
      }
      
      groundTexture.current = new THREE.CanvasTexture(canvas);
      groundTexture.current.wrapS = THREE.RepeatWrapping;
      groundTexture.current.wrapT = THREE.RepeatWrapping;
      groundTexture.current.repeat.set(6, 6);
    }
  }, []);
  
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
      <planeGeometry args={[100, 100]} />
      <meshBasicMaterial map={groundTexture.current} />
    </mesh>
  );
};

export default Ground;

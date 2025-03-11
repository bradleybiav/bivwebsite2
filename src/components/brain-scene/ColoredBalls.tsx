
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ColoredBallsProps {
  count: number;
}

const ColoredBalls: React.FC<ColoredBallsProps> = ({ count }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useRef(new THREE.Object3D()).current;
  const balls = useRef<Array<{
    position: THREE.Vector3;
    velocity: THREE.Vector3;
    color: THREE.Color;
    size: number;
  }>>(Array.from({ length: count }, () => ({
    position: new THREE.Vector3(
      (Math.random() - 0.5) * 100,
      (Math.random() - 0.5) * 100,
      (Math.random() - 0.5) * 100
    ),
    velocity: new THREE.Vector3(
      (Math.random() - 0.5) * 0.05,
      (Math.random() - 0.5) * 0.05,
      (Math.random() - 0.5) * 0.05
    ),
    color: new THREE.Color().setHSL(Math.random(), 0.7, 0.5),
    size: 0.5 + Math.random() * 1.5
  }))).current;

  useFrame(() => {
    if (!meshRef.current) return;

    balls.forEach((ball, i) => {
      // Update position based on velocity
      ball.position.add(ball.velocity);
      
      // Boundary check and bounce
      const boundary = 50;
      ['x', 'y', 'z'].forEach(axis => {
        if (Math.abs(ball.position[axis]) > boundary) {
          ball.velocity[axis] *= -1;
        }
      });
      
      // Update the instance matrix
      dummy.position.copy(ball.position);
      dummy.scale.set(ball.size, ball.size, ball.size);
      dummy.updateMatrix();
      
      meshRef.current.setMatrixAt(i, dummy.matrix);
      meshRef.current.setColorAt(i, ball.color);
    });
    
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) 
      meshRef.current.instanceColor.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshPhongMaterial />
    </instancedMesh>
  );
};

export default ColoredBalls;

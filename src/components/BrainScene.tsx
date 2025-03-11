
import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useLoader, extend } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Custom shader material for Scream-like effect
class ScreamShaderMaterial extends THREE.ShaderMaterial {
  constructor() {
    super({
      uniforms: {
        time: { value: 0 },
        color: { value: new THREE.Color(0.6, 0.8, 0.9) },
        scale: { value: 1.0 },
        seed: { value: 0.0 }
      },
      vertexShader: `
        varying vec3 vPosition;
        varying vec3 vNormal;
        
        void main() {
          vPosition = position;
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec3 color;
        uniform float scale;
        uniform float seed;
        
        varying vec3 vPosition;
        varying vec3 vNormal;
        
        // Simplex noise functions by Ashima Arts & Stefan Gustavson
        vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
        vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
        
        float snoise(vec3 v) {
          const vec2 C = vec2(1.0/6.0, 1.0/3.0);
          const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
          
          // First corner
          vec3 i  = floor(v + dot(v, C.yyy));
          vec3 x0 = v - i + dot(i, C.xxx);
          
          // Other corners
          vec3 g = step(x0.yzx, x0.xyz);
          vec3 l = 1.0 - g;
          vec3 i1 = min(g.xyz, l.zxy);
          vec3 i2 = max(g.xyz, l.zxy);
          
          vec3 x1 = x0 - i1 + C.xxx;
          vec3 x2 = x0 - i2 + C.yyy;
          vec3 x3 = x0 - D.yyy;
          
          // Permutations
          i = mod289(i);
          vec4 p = permute(permute(permute(
                    i.z + vec4(0.0, i1.z, i2.z, 1.0))
                  + i.y + vec4(0.0, i1.y, i2.y, 1.0))
                  + i.x + vec4(0.0, i1.x, i2.x, 1.0));
                  
          // Gradients: 7x7 points over a square, mapped onto an octahedron.
          float n_ = 0.142857142857;
          vec3 ns = n_ * D.wyz - D.xzx;
          
          vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
          
          vec4 x_ = floor(j * ns.z);
          vec4 y_ = floor(j - 7.0 * x_);
          
          vec4 x = x_ *ns.x + ns.yyyy;
          vec4 y = y_ *ns.x + ns.yyyy;
          vec4 h = 1.0 - abs(x) - abs(y);
          
          vec4 b0 = vec4(x.xy, y.xy);
          vec4 b1 = vec4(x.zw, y.zw);
          
          vec4 s0 = floor(b0)*2.0 + 1.0;
          vec4 s1 = floor(b1)*2.0 + 1.0;
          vec4 sh = -step(h, vec4(0.0));
          
          vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
          vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
          
          vec3 p0 = vec3(a0.xy, h.x);
          vec3 p1 = vec3(a0.zw, h.y);
          vec3 p2 = vec3(a1.xy, h.z);
          vec3 p3 = vec3(a1.zw, h.w);
          
          // Normalise gradients
          vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
          p0 *= norm.x;
          p1 *= norm.y;
          p2 *= norm.z;
          p3 *= norm.w;
          
          // Mix final noise value
          vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
          m = m * m;
          return 42.0 * dot(m*m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
        }
        
        void main() {
          // Create layered noise effect for Scream look
          vec3 pos = vPosition * scale;
          float noise1 = snoise(pos + vec3(0.0, 0.0, seed));
          float noise2 = snoise(pos * 2.0 + vec3(0.0, 0.0, seed * 1.5));
          float noise3 = snoise(pos * 4.0 + vec3(0.0, 0.0, seed * 2.0));
          
          // Mix noise layers
          float combinedNoise = noise1 * 0.5 + noise2 * 0.3 + noise3 * 0.2;
          
          // Create color variations
          vec3 baseColor = color;
          vec3 color1 = vec3(0.2, 0.8, 0.4); // Green
          vec3 color2 = vec3(0.1, 0.2, 0.8); // Blue
          vec3 color3 = vec3(0.8, 0.3, 0.6); // Purple
          
          // Mix colors based on noise
          vec3 finalColor = mix(color1, color2, smoothstep(-0.5, 0.5, noise1));
          finalColor = mix(finalColor, color3, smoothstep(-0.3, 0.3, noise2));
          finalColor = mix(finalColor, baseColor, smoothstep(-0.4, 0.4, noise3));
          
          // Apply lighting effect based on normal
          float light = dot(vNormal, normalize(vec3(1.0, 1.0, 1.0))) * 0.5 + 0.5;
          finalColor *= light;
          
          gl_FragColor = vec4(finalColor, 1.0);
        }
      `,
      transparent: true
    });
  }
}

// Register the custom shader material
extend({ ScreamShaderMaterial });

// Brain model with Scream shader
const Brain = () => {
  const brainRef = useRef<THREE.Group>();
  const materialRef = useRef<any>();
  const gltf = useLoader(GLTFLoader, '/brainBBBBB.glb');
  
  // Animation loop
  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = clock.getElapsedTime();
      materialRef.current.uniforms.seed.value = Math.sin(clock.getElapsedTime() / 3) * 3;
      
      // Animate color
      const r = 0.5 + 0.5 * Math.sin(clock.getElapsedTime() / 7);
      const g = 0.5 + 0.5 * Math.sin(clock.getElapsedTime() / 8);
      const b = 0.5 + 0.5 * Math.sin(clock.getElapsedTime() / 5);
      materialRef.current.uniforms.color.value.set(r, g, b);
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
  
  // Clone the model to apply our custom material
  useEffect(() => {
    if (brainRef.current) {
      brainRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          const screamMaterial = new ScreamShaderMaterial();
          materialRef.current = screamMaterial;
          child.material = screamMaterial;
        }
      });
    }
  }, [gltf]);
  
  return (
    <primitive 
      object={gltf.scene.clone()} 
      ref={brainRef} 
      position={[0, 1, 0]} 
      scale={[4, 4, 4]} 
    />
  );
};

// Ground with green grass texture
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

// Main scene component
const BrainScene = () => {
  return (
    <div style={{ width: '100%', height: '100vh', overflow: 'hidden' }}>
      <Canvas>
        <ambientLight intensity={0.5} />
        <directionalLight position={[1, 1, 1]} intensity={0.5} />
        <pointLight position={[0, 10, 0]} intensity={0.5} color="#D946EF" />
        
        <PerspectiveCamera makeDefault position={[0, 5, 30]} />
        <OrbitControls 
          enableDamping 
          dampingFactor={0.05} 
          enableZoom={true}
          autoRotate={false}
        />
        
        <fog attach="fog" args={['#000000', 25, 40]} />
        <Ground />
        <Brain />
      </Canvas>
    </div>
  );
};

export default BrainScene;

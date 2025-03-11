
import * as THREE from 'three';
import { extend } from '@react-three/fiber';

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
          // Base color - starting with something visible
          vec3 baseColor = vec3(0.8, 0.5, 0.9);
          
          // Create layered noise effect with higher frequency and more vivid coloring
          float smallScale = 3.0; // Frequency for detailed patterns
          
          vec3 pos = vPosition * scale;
          float noise1 = snoise(pos * smallScale + vec3(time * 0.1, time * 0.12, seed));
          float noise2 = snoise(pos * smallScale * 2.0 + vec3(time * 0.15, time * 0.1, seed * 1.5));
          float noise3 = snoise(pos * smallScale * 4.0 + vec3(time * 0.12, time * 0.15, seed * 2.0));
          
          // Mix noise layers
          float combinedNoise = noise1 * 0.4 + noise2 * 0.4 + noise3 * 0.2;
          
          // Create vivid color variations
          vec3 color1 = vec3(0.9, 0.3, 0.8); // Vibrant pink/purple
          vec3 color2 = vec3(0.3, 0.8, 0.9); // Bright cyan
          vec3 color3 = vec3(0.8, 0.6, 0.2); // Golden yellow
          
          // Mix colors based on noise
          vec3 finalColor = mix(color1, color2, smoothstep(-0.6, 0.6, noise1));
          finalColor = mix(finalColor, color3, smoothstep(-0.4, 0.4, noise2));
          finalColor = mix(finalColor, color, smoothstep(-0.3, 0.3, noise3));
          
          // Add position-based color variation
          finalColor *= 0.8 + 0.4 * vec3(
            0.5 + 0.5 * sin(time + vPosition.x * 2.0),
            0.5 + 0.5 * sin(time * 1.1 + vPosition.y * 2.0),
            0.5 + 0.5 * sin(time * 0.9 + vPosition.z * 2.0)
          );
          
          // Apply simple lighting effect based on normal
          float light = dot(vNormal, normalize(vec3(1.0, 1.0, 1.0))) * 0.7 + 0.5;
          finalColor *= light;
          
          // Ensure we don't have pure black by adding a minimum color value
          finalColor = max(finalColor, vec3(0.1, 0.1, 0.1));
          
          gl_FragColor = vec4(finalColor, 1.0);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide
    });
  }
}

// Register the custom shader material
extend({ ScreamShaderMaterial });

export default ScreamShaderMaterial;

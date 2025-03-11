
// Main script for Brain in a Vat visualization with animated grass-like background

// Wait for DOM content to load
document.addEventListener('DOMContentLoaded', () => {
  console.log("Main script loaded. Setup will begin when DOM is ready.");
  
  // Create scene
  const scene = new THREE.Scene();
  
  // Setup camera
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 0, 50); // Positioned to see the brain
  
  // Setup renderer with antialias for better quality
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  
  // Add lighting to make objects visible
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Ambient light
  scene.add(ambientLight);
  
  // Add directional lights from multiple angles for better reflection
  const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight1.position.set(1, 1, 1);
  scene.add(directionalLight1);
  
  const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
  directionalLight2.position.set(-1, 0.5, -1);
  scene.add(directionalLight2);
  
  // Handle window resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
  
  // Variables for animation
  let brain = null;
  const clock = new THREE.Clock();
  
  // Create animated grass-like background using noise
  const createAnimatedGrassBackground = () => {
    // Shader materials for the animated grass noise
    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;
    
    const fragmentShader = `
      uniform float time;
      varying vec2 vUv;
      
      // Simplex noise functions
      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
      
      float snoise(vec2 v) {
        const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                 -0.577350269189626, 0.024390243902439);
        vec2 i  = floor(v + dot(v, C.yy));
        vec2 x0 = v -   i + dot(i, C.xx);
        vec2 i1;
        i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod289(i);
        vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
        + i.x + vec3(0.0, i1.x, 1.0));
        vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
        m = m*m;
        m = m*m;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
        vec3 g;
        g.x = a0.x * x0.x + h.x * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
      }
      
      void main() {
        // Multiple scales of noise for a more detailed grass look
        float scale1 = 8.0;  // Smaller scale for grass detail
        float scale2 = 16.0; // Medium scale for variation
        float scale3 = 24.0; // Larger scale for terrain-like patterns
        
        // Generate noise at different scales and speeds
        float n1 = snoise(vUv * scale1 + vec2(time * 0.05, time * 0.07)) * 0.5 + 0.5;
        float n2 = snoise(vUv * scale2 + vec2(time * -0.06, time * 0.08)) * 0.5 + 0.5;
        float n3 = snoise(vUv * scale3 + vec2(time * 0.07, time * -0.05)) * 0.5 + 0.5;
        
        // Mix noise at different levels to create variation
        float noise = (n1 * 0.6 + n2 * 0.3 + n3 * 0.1);
        
        // Grass-like colors based on the reference image
        vec3 darkGreen = vec3(0.1, 0.3, 0.1);  // Dark green for shadow areas
        vec3 mediumGreen = vec3(0.2, 0.5, 0.2); // Medium green for mid tones
        vec3 lightGreen = vec3(0.4, 0.7, 0.2);  // Light green for highlights
        vec3 yellowGreen = vec3(0.5, 0.7, 0.1); // Yellow-green accents
        
        // Mix colors based on noise
        vec3 finalColor;
        
        // More complex color mixing for realistic grass appearance
        if (noise < 0.4) {
          finalColor = mix(darkGreen, mediumGreen, noise * 2.5);
        } else if (noise < 0.7) {
          finalColor = mix(mediumGreen, lightGreen, (noise - 0.4) * 3.3);
        } else {
          finalColor = mix(lightGreen, yellowGreen, (noise - 0.7) * 3.3);
        }
        
        // Add some random bright spots to simulate light catching on grass blades
        float sparkle = pow(max(0.0, snoise(vUv * 30.0 + vec2(time * 0.1, time * -0.1))), 5.0) * 0.2;
        finalColor += vec3(sparkle);
        
        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;
    
    // Create shader uniforms
    const uniforms = {
      time: { value: 0 }
    };
    
    // Create fullscreen quad for background
    const planeGeometry = new THREE.PlaneGeometry(200, 200);
    const planeMaterial = new THREE.ShaderMaterial({
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      uniforms: uniforms,
      side: THREE.BackSide  // Render on back side so it appears as background
    });
    
    // Create background mesh
    const backgroundMesh = new THREE.Mesh(planeGeometry, planeMaterial);
    backgroundMesh.position.z = -50;  // Behind everything
    backgroundMesh.renderOrder = -1;  // Ensure it's rendered first
    
    // Add to scene
    scene.add(backgroundMesh);
    
    return { mesh: backgroundMesh, uniforms: uniforms };
  };
  
  // Create animated grass background
  const animatedBackground = createAnimatedGrassBackground();
  
  // Load brain model
  const loader = new THREE.GLTFLoader();
  loader.load('brainBBBBB.glb', (gltf) => {
    console.log("Loading model: 50%");
    brain = gltf.scene;
    
    // Scale brain down
    brain.scale.set(8, 8, 8);
    
    // Add brain to scene
    scene.add(brain);
    console.log("Brain model loaded and added to scene");
    console.log("Loading model: 100%");
    
    // Start animation
    animate();
  });
  
  // Animation loop
  function animate() {
    requestAnimationFrame(animate);
    
    // Update shader time uniform
    const time = clock.getElapsedTime();
    animatedBackground.uniforms.time.value = time;
    
    // Update brain rotation if it exists
    if (brain) {
      brain.rotation.y += 0.003;
    }
    
    // Render the scene
    renderer.render(scene, camera);
  }
});

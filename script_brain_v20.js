
// Main script for Brain in a Vat visualization

// Global variables
let scene, camera, renderer, controls;
let brain = null;
let dotCloud = null;
let toggle = true;

// Color change function
function triggerColorChange() {
  console.log("Color change triggered - toggling background, text, and dot colors.");
  const link = document.querySelector('#container a');
  const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#00ffff'];
  
  if (toggle) {
    // Switch to random colors
    let textColorIndex = Math.floor(Math.random() * colors.length);
    let bgColorIndex;
    do {
      bgColorIndex = Math.floor(Math.random() * colors.length);
    } while (textColorIndex === bgColorIndex);
    
    // Apply new colors
    link.style.color = colors[textColorIndex];
    renderer.setClearColor(colors[bgColorIndex]);
    
    // Update dot colors
    if (dotCloud) {
      dotCloud.children.forEach((dot) => {
        const colorIndex = Math.floor(Math.random() * colors.length);
        dot.material.color.set(colors[colorIndex]);
      });
    }
  } else {
    // Switch back to black/white
    link.style.color = '#ffffff'; // Text to white
    renderer.setClearColor('#000000'); // Background to black
    
    // Change dots back to random colors
    if (dotCloud) {
      dotCloud.children.forEach((dot) => {
        const colorIndex = Math.floor(Math.random() * colors.length);
        dot.material.color.set(colors[colorIndex]);
      });
    }
  }
  
  // Toggle for next movement
  toggle = !toggle;
}

// Setup scene with Three.js
function setupScene() {
  // Create scene
  scene = new THREE.Scene();
  
  // Create camera
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 30;
  
  // Create renderer
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor('#000000');
  document.body.appendChild(renderer.domElement);
  
  // Add ambient light
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);
  
  // Add directional light
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(10, 10, 10);
  scene.add(directionalLight);
  
  // Add opposite directional light
  const backLight = new THREE.DirectionalLight(0xffffff, 0.7);
  backLight.position.set(-10, -10, -10);
  scene.add(backLight);
  
  // Setup orbit controls
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  
  return { scene, camera, renderer, controls };
}

// Create dot cloud
function createDotCloud() {
  const dotCloud = new THREE.Group();
  
  // Create 1500 dots with size 0.1
  const dotCount = 1500;
  
  for (let i = 0; i < dotCount; i++) {
    const dotGeometry = new THREE.SphereGeometry(0.1, 8, 8);
    
    // Use the color palette
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#00ffff'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    const dotMaterial = new THREE.MeshBasicMaterial({ color: color });
    const dot = new THREE.Mesh(dotGeometry, dotMaterial);
    
    // Position dots in sphere with radius 30
    const radius = 30;
    // Use cube root distribution for volumetric distribution (not just surface)
    const r = radius * Math.cbrt(Math.random()); // Cube root for volumetric distribution
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    
    dot.position.x = r * Math.sin(phi) * Math.cos(theta);
    dot.position.y = r * Math.sin(phi) * Math.sin(theta);
    dot.position.z = r * Math.cos(phi);
    
    dotCloud.add(dot);
  }
  
  return dotCloud;
}

// Load brain model with shader effect similar to XJrMYyV
function loadBrainModel() {
  // Set up loader
  const loader = new THREE.GLTFLoader();
  
  // Load the brain model
  loader.load('brainBBBBB.glb', function(gltf) {
    console.log("GLB model loaded successfully!");
    
    // Get the brain mesh from the loaded model
    brain = gltf.scene;
    brain.scale.set(0.5, 0.5, 0.5);
    brain.position.set(0, 0, 0);
    
    // Apply shader material to brain
    brain.traverse((child) => {
      if (child.isMesh) {
        // Create a custom shader material similar to the CodePen example
        const vertexShader = `
          varying vec2 vUv;
          varying vec3 vPosition;
          
          void main() {
            vUv = uv;
            vPosition = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `;
        
        const fragmentShader = `
          uniform float time;
          varying vec2 vUv;
          varying vec3 vPosition;
          
          void main() {
            vec3 pos = vPosition * 2.0;
            float pattern = sin(pos.x * 10.0 + time) * cos(pos.y * 10.0 + time) * sin(pos.z * 10.0 + time);
            
            vec3 color1 = vec3(0.8, 0.2, 0.6); // Pink/purple
            vec3 color2 = vec3(0.2, 0.8, 0.9); // Blue/cyan
            
            vec3 finalColor = mix(color1, color2, pattern * 0.5 + 0.5);
            
            gl_FragColor = vec4(finalColor, 1.0);
          }
        `;
        
        // Create the shader material
        const shaderMaterial = new THREE.ShaderMaterial({
          uniforms: {
            time: { value: 0.0 }
          },
          vertexShader: vertexShader,
          fragmentShader: fragmentShader,
          side: THREE.DoubleSide
        });
        
        child.material = shaderMaterial;
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    
    // Add the brain to the scene
    scene.add(brain);
  }, undefined, function(error) {
    console.error('An error happened while loading the GLB model:', error);
  });
}

// Setup interaction for mouse movement and device orientation
function setupInteraction() {
  // Interaction based on mouse movement
  document.addEventListener('mousemove', function(event) {
    const moveX = (event.clientX - window.innerWidth / 2) * 0.02;
    const moveY = (event.clientY - window.innerHeight / 2) * 0.02;
    
    if (brain) {
      brain.rotation.y = moveX * 0.05;
      brain.rotation.x = moveY * 0.05;
    }
    
    if (dotCloud) {
      dotCloud.rotation.y = -moveX * 0.02;
      dotCloud.rotation.x = -moveY * 0.02;
    }
  });
  
  // Interaction based on device orientation (for mobile devices)
  window.addEventListener('deviceorientation', function(event) {
    if (event.beta && event.gamma) {
      const moveX = event.gamma * 0.05; // Left/right tilt
      const moveY = event.beta * 0.05; // Front/back tilt
      
      if (brain) {
        brain.rotation.y = moveX * 0.05;
        brain.rotation.x = moveY * 0.05;
      }
      
      if (dotCloud) {
        dotCloud.rotation.y = -moveX * 0.02;
        dotCloud.rotation.x = -moveY * 0.02;
      }
    }
  });
  
  // Click or tap to change colors
  document.addEventListener('click', triggerColorChange);
  
  // Change colors every 3 seconds automatically
  setInterval(triggerColorChange, 3000);
}

// Handle window resize
function handleResize() {
  window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

// Update shader time uniform
function updateShaderTime() {
  if (brain) {
    brain.traverse((child) => {
      if (child.isMesh && child.material.uniforms && child.material.uniforms.time) {
        child.material.uniforms.time.value = performance.now() / 1000;
      }
    });
  }
}

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  
  if (brain) {
    brain.rotation.y += 0.002;
    updateShaderTime();
  }
  
  if (dotCloud) {
    dotCloud.rotation.y -= 0.002; // Rotate the dot cloud in the opposite direction
  }
  
  controls.update();
  renderer.render(scene, camera);
}

// Initialize and start animation
function init() {
  console.log("Script loaded and executed.");
  const sceneSetup = setupScene();
  scene = sceneSetup.scene;
  camera = sceneSetup.camera;
  renderer = sceneSetup.renderer;
  controls = sceneSetup.controls;
  
  loadBrainModel();
  
  dotCloud = createDotCloud();
  scene.add(dotCloud);
  
  setupInteraction();
  handleResize();
  
  // Trigger initial color change
  triggerColorChange();
  
  // Start animation loop
  animate();
}

// Start the application when the page is loaded
window.addEventListener('DOMContentLoaded', init);

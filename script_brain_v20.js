
// Main script for Brain in a Vat visualization

// Global variables
let scene, camera, renderer, controls;
let brain = null;
let dotCloud = null;

// Initialize and start animation
function init() {
  console.log("Script loaded and executing...");
  
  // Setup scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x111111); // Very dark gray background instead of pure black
  
  // Setup camera
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 0, 5);
  
  // Setup renderer with a fallback background color
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x111111); // Ensure renderer has a visible background color
  document.body.appendChild(renderer.domElement);
  console.log("Renderer created and added to DOM");
  
  try {
    // Setup controls - with error handling
    console.log("Creating OrbitControls...");
    if (typeof THREE.OrbitControls !== 'function') {
      console.error("THREE.OrbitControls is not available! Check script loading.");
      // Add dummy controls object with update method to prevent errors
      controls = { update: function() {} };
    } else {
      controls = new THREE.OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.autoRotate = true;
      controls.autoRotateSpeed = 1;
      console.log("OrbitControls initialized successfully");
    }
  } catch (e) {
    console.error("Error initializing controls:", e);
    // Add dummy controls object with update method to prevent errors
    controls = { update: function() {} };
  }
  
  // Add lighting to make objects visible
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.7); // Brighter ambient light
  scene.add(ambientLight);
  
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0); // Brighter directional light
  directionalLight.position.set(1, 1, 1);
  scene.add(directionalLight);
  
  // Create fallback geometry if model loading fails
  createFallbackBrain();
  
  // Create dot cloud background
  createDotCloud();
  
  // Load the brain model
  loadBrainModel();
  
  // Handle window resize
  window.addEventListener('resize', onWindowResize);
  
  // Start animation loop
  animate();
  
  console.log("Initialization complete");
}

// Create a fallback brain if model loading fails
function createFallbackBrain() {
  const geometry = new THREE.SphereGeometry(1, 32, 32);
  const material = new THREE.MeshPhongMaterial({
    color: 0xff00ff,
    emissive: 0x440044,
    specular: 0xffffff,
    shininess: 100,
    transparent: true,
    opacity: 0.9
  });
  
  const fallbackBrain = new THREE.Mesh(geometry, material);
  fallbackBrain.position.set(0, 0, 0);
  scene.add(fallbackBrain);
  console.log("Fallback brain created");
}

function createDotCloud() {
  const particleCount = 1000;
  const particles = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  
  // Generate random positions and colors for particles
  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    
    // Position
    positions[i3] = (Math.random() - 0.5) * 15;
    positions[i3 + 1] = (Math.random() - 0.5) * 15;
    positions[i3 + 2] = (Math.random() - 0.5) * 15;
    
    // Bright colors for visibility
    colors[i3] = Math.random() * 0.5 + 0.5; // More red
    colors[i3 + 1] = Math.random() * 0.5 + 0.5; // More green
    colors[i3 + 2] = Math.random() * 0.5 + 0.5; // More blue
  }
  
  particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  
  const particleMaterial = new THREE.PointsMaterial({
    size: 0.1, // Larger size for better visibility
    vertexColors: true,
    transparent: true,
    opacity: 0.8
  });
  
  dotCloud = new THREE.Points(particles, particleMaterial);
  scene.add(dotCloud);
  console.log("Dot cloud created");
}

function loadBrainModel() {
  try {
    // Setup loader with error handling
    if (typeof THREE.GLTFLoader !== 'function') {
      console.error("THREE.GLTFLoader is not available! Using fallback brain.");
      return;
    }
    
    const loader = new THREE.GLTFLoader();
    
    // Load the brain model
    loader.load('brainBBBBB.glb', function(gltf) {
      console.log("GLB model loaded successfully!");
      
      // Get the brain mesh from the loaded model
      brain = gltf.scene;
      brain.scale.set(0.5, 0.5, 0.5);
      brain.position.set(0, 0, 0);
      
      // Apply colorful animated material to brain
      brain.traverse((child) => {
        if (child.isMesh) {
          // Create a shimmer material for the brain
          const brainMaterial = new THREE.MeshPhongMaterial({
            color: 0xff00ff,
            emissive: 0x440044,
            specular: 0xffffff,
            shininess: 100,
            transparent: true,
            opacity: 0.9
          });
          
          child.material = brainMaterial;
          child.material.userData = { originalColor: new THREE.Color(0xff00ff) };
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      
      // Add the brain to the scene
      scene.add(brain);
      console.log("Brain added to scene");
      
    }, 
    // Progress callback
    function(xhr) {
      console.log("Loading model: " + (xhr.loaded / xhr.total * 100) + "% loaded");
    }, 
    // Error callback
    function(error) {
      console.error('An error happened while loading the GLB model:', error);
    });
  } catch (e) {
    console.error("Error in loadBrainModel:", e);
  }
}

function animate() {
  requestAnimationFrame(animate);
  
  // Update controls
  if (controls) controls.update();
  
  // Update brain material colors
  if (brain) {
    brain.rotation.y += 0.003;
    
    // Animate brain colors
    brain.traverse((child) => {
      if (child.isMesh && child.material) {
        const time = Date.now() * 0.001;
        const r = Math.sin(time * 0.5) * 0.5 + 0.5;
        const g = Math.sin(time * 0.3) * 0.5 + 0.5;
        const b = Math.sin(time * 0.2) * 0.5 + 0.5;
        
        child.material.color.setRGB(r, g, b);
        child.material.emissive.setRGB(r * 0.2, g * 0.2, b * 0.2);
      }
    });
  }
  
  // Update dot cloud rotation
  if (dotCloud) {
    dotCloud.rotation.y += 0.001;
  }
  
  // Render the scene
  renderer.render(scene, camera);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// Start the application when the page is loaded
window.addEventListener('DOMContentLoaded', init);
console.log("Script loaded, waiting for DOMContentLoaded event");

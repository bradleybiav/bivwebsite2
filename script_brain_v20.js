
// Main script for Brain in a Vat visualization

// Global variables
let scene, camera, renderer, controls;
let brain = null;
let dotCloud = null;
let mixer = null;
let clock = new THREE.Clock();
let loadingManager = null;

// Initialize and start animation
function init() {
  console.log("Script loaded and executing...");
  
  // Setup scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x111111); // Very dark gray background instead of pure black
  
  // Setup camera
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 0, 5);
  
  // Setup renderer with antialias for better quality
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x111111, 1); // Ensure renderer has a visible background color
  document.body.appendChild(renderer.domElement);
  console.log("Renderer created and added to DOM");
  
  // Add lighting to make objects visible
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.7); // Brighter ambient light
  scene.add(ambientLight);
  
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0); // Brighter directional light
  directionalLight.position.set(1, 1, 1);
  scene.add(directionalLight);
  
  // Load 3D brain model
  loadBrainModel();
  
  // Create dot cloud background
  createDotCloud();
  
  // Handle window resize
  window.addEventListener('resize', onWindowResize);
  
  // Start animation loop
  animate();
  
  console.log("Initialization complete");
}

// Load 3D brain model from GLB file
function loadBrainModel() {
  // Show loading progress
  loadingManager = new THREE.LoadingManager();
  loadingManager.onProgress = function(url, itemsLoaded, itemsTotal) {
    console.log('Loading model: ' + Math.round(itemsLoaded / itemsTotal * 100) + '%');
  };
  
  // Create a GLTFLoader to load the model
  const loader = new THREE.GLTFLoader(loadingManager);
  
  // Load the brain model
  loader.load(
    'brainBBBBB.glb',  // Path to the model
    function(gltf) {
      // Model loaded successfully
      brain = gltf.scene;
      
      // Scale the brain to a reasonable size
      brain.scale.set(1.5, 1.5, 1.5);
      
      // Position the brain in the center
      brain.position.set(0, 0, 0);
      
      // Make the brain emissive for a glowing effect
      brain.traverse(function(child) {
        if (child.isMesh) {
          // Update material to be more colorful and glowing
          child.material = new THREE.MeshPhongMaterial({
            color: 0xff00ff,
            emissive: 0x440044,
            specular: 0xffffff,
            shininess: 100,
            transparent: true,
            opacity: 0.9
          });
        }
      });
      
      // Add the brain to the scene
      scene.add(brain);
      console.log("Brain model loaded and added to scene");
      
      // Set up animation mixer if the model has animations
      if (gltf.animations && gltf.animations.length) {
        mixer = new THREE.AnimationMixer(brain);
        const action = mixer.clipAction(gltf.animations[0]);
        action.play();
        console.log("Brain animations set up");
      }
    },
    // Progress callback
    function(xhr) {
      console.log("Loading brain model: " + (xhr.loaded / xhr.total * 100) + "% loaded");
    },
    // Error callback
    function(error) {
      console.error("Error loading brain model:", error);
      // Fallback to creating a brain sphere if model fails to load
      createBrainSphere();
    }
  );
}

// Create a colorful brain sphere (fallback if model loading fails)
function createBrainSphere() {
  console.log("Creating fallback brain sphere");
  const geometry = new THREE.SphereGeometry(1, 32, 32);
  const material = new THREE.MeshPhongMaterial({
    color: 0xff00ff,
    emissive: 0x440044,
    specular: 0xffffff,
    shininess: 100,
    transparent: true,
    opacity: 0.9
  });
  
  brain = new THREE.Mesh(geometry, material);
  brain.position.set(0, 0, 0);
  scene.add(brain);
  console.log("Brain sphere created as fallback");
}

function createDotCloud() {
  const particleCount = 2000;
  const particles = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  
  // Generate random positions and colors for particles
  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    
    // Position with wider spread
    positions[i3] = (Math.random() - 0.5) * 20;
    positions[i3 + 1] = (Math.random() - 0.5) * 20;
    positions[i3 + 2] = (Math.random() - 0.5) * 20;
    
    // Bright colorful particles
    const colorChoices = [
      [1.0, 0.3, 0.8], // Pink
      [0.5, 0.3, 1.0], // Purple
      [0.3, 0.7, 1.0], // Blue
      [0.3, 1.0, 0.7], // Teal
      [1.0, 0.8, 0.3], // Yellow
      [1.0, 0.5, 0.2]  // Orange
    ];
    
    const color = colorChoices[Math.floor(Math.random() * colorChoices.length)];
    colors[i3] = color[0];
    colors[i3 + 1] = color[1];
    colors[i3 + 2] = color[2];
  }
  
  particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  
  const particleMaterial = new THREE.PointsMaterial({
    size: 0.15, // Larger size for better visibility
    vertexColors: true,
    transparent: true,
    opacity: 0.8
  });
  
  dotCloud = new THREE.Points(particles, particleMaterial);
  scene.add(dotCloud);
  console.log("Dot cloud created");
}

function animate() {
  requestAnimationFrame(animate);
  
  // Update animations if mixer exists
  if (mixer) {
    mixer.update(clock.getDelta());
  }
  
  // Update brain colors and rotation if it exists
  if (brain) {
    brain.rotation.y += 0.003;
    
    // Animate brain colors if it has materials to update
    brain.traverse(function(child) {
      if (child.isMesh) {
        const time = Date.now() * 0.001;
        const r = Math.sin(time * 0.5) * 0.5 + 0.5;
        const g = Math.sin(time * 0.3) * 0.5 + 0.5;
        const b = Math.sin(time * 0.2) * 0.5 + 0.5;
        
        if (child.material) {
          child.material.color.setRGB(r, g, b);
          if (child.material.emissive) {
            child.material.emissive.setRGB(r * 0.2, g * 0.2, b * 0.2);
          }
        }
      }
    });
  }
  
  // Update dot cloud rotation
  if (dotCloud) {
    dotCloud.rotation.y += 0.0005;
    dotCloud.rotation.x += 0.0001;
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

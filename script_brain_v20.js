
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
  scene.background = new THREE.Color(0x000000); // Black background
  
  // Setup camera
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 0, 5);
  
  // Setup renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  console.log("Renderer created and added to DOM");
  
  // Setup controls
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 1;
  
  // Add lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);
  
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(1, 1, 1);
  scene.add(directionalLight);
  
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
    
    // Color
    colors[i3] = Math.random();
    colors[i3 + 1] = Math.random();
    colors[i3 + 2] = Math.random();
  }
  
  particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  
  const particleMaterial = new THREE.PointsMaterial({
    size: 0.05,
    vertexColors: true,
    transparent: true,
    opacity: 0.8
  });
  
  dotCloud = new THREE.Points(particles, particleMaterial);
  scene.add(dotCloud);
  console.log("Dot cloud created");
}

function loadBrainModel() {
  // Setup loader
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

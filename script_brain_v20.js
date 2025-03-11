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
  camera.position.set(0, 0, 10); // Positioned further back to see more of the scene
  
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
  
  // Create sphere particles background
  createSphereParticles();
  
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
      brain.scale.set(2.2, 2.2, 2.2); // Increased scale
      
      // Position the brain in the center but slightly offset
      brain.position.set(0, -1, 0); // Lowered position
      
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
  brain.position.set(0, -1, 0); // Match the position of the brain model
  scene.add(brain);
  console.log("Brain sphere created as fallback");
}

// Create sphere particles instead of dot cloud
function createSphereParticles() {
  const particleCount = 1000; // Reduced count because spheres are more resource-intensive
  const group = new THREE.Group();
  
  // Create small sphere geometry to be reused for all particles
  const sphereGeometry = new THREE.SphereGeometry(0.1, 8, 8);
  
  // Vibrant color options for particles
  const colorChoices = [
    [1.0, 0.3, 0.8], // Pink
    [0.5, 0.3, 1.0], // Purple
    [0.3, 0.7, 1.0], // Blue
    [0.3, 1.0, 0.7], // Teal
    [1.0, 0.8, 0.3], // Yellow
    [1.0, 0.5, 0.2], // Orange
    [0.2, 0.8, 1.0], // Cyan
    [0.8, 0.2, 1.0]  // Magenta
  ];
  
  // Create spheres and position them in space
  for (let i = 0; i < particleCount; i++) {
    // Generate random position with wider spread
    let x = (Math.random() - 0.5) * 40;
    let y = (Math.random() - 0.5) * 40;
    let z = (Math.random() - 0.5) * 40;
    
    // Create a hollow sphere effect by removing particles too close to center
    const distance = Math.sqrt(x * x + y * y + z * z);
    
    if (distance < 5) { // If too close to center
      // Move it farther out
      const factor = 5 / distance;
      x *= factor;
      y *= factor;
      z *= factor;
    }
    
    // Select a random color from our palette
    const color = colorChoices[Math.floor(Math.random() * colorChoices.length)];
    
    // Create material with the chosen color
    const material = new THREE.MeshPhongMaterial({
      color: new THREE.Color(color[0], color[1], color[2]),
      emissive: new THREE.Color(color[0] * 0.2, color[1] * 0.2, color[2] * 0.2),
      specular: 0xffffff,
      shininess: 30,
      transparent: true,
      opacity: 0.8
    });
    
    // Create sphere mesh with geometry and material
    const sphere = new THREE.Mesh(sphereGeometry, material);
    
    // Set position
    sphere.position.set(x, y, z);
    
    // Store original color data for animation
    sphere.userData = {
      originalColor: [...color],
      speed: Math.random() * 0.5 + 0.5, // Random animation speed
      phase: Math.random() * Math.PI * 2 // Random starting phase
    };
    
    // Add to group
    group.add(sphere);
  }
  
  dotCloud = group;
  scene.add(dotCloud);
  console.log("Sphere particles created");
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
  
  // Update sphere particles animation
  if (dotCloud) {
    dotCloud.rotation.y += 0.0003;
    dotCloud.rotation.x += 0.0001;
    
    // Animate each sphere in the group
    const time = Date.now() * 0.001;
    
    dotCloud.children.forEach((sphere) => {
      const { originalColor, speed, phase } = sphere.userData;
      
      // Pulse effect: subtle size variation
      const pulseFactor = Math.sin(time * speed + phase) * 0.1 + 1;
      sphere.scale.set(pulseFactor, pulseFactor, pulseFactor);
      
      // Color pulsing effect
      const colorPulse = Math.sin(time * speed + phase) * 0.15 + 1;
      const r = Math.min(1, originalColor[0] * colorPulse);
      const g = Math.min(1, originalColor[1] * colorPulse);
      const b = Math.min(1, originalColor[2] * colorPulse);
      
      if (sphere.material) {
        sphere.material.color.setRGB(r, g, b);
        sphere.material.emissive.setRGB(r * 0.2, g * 0.2, b * 0.2);
      }
    });
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

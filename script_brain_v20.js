
// Main script for Brain in a Vat visualization

// Global variables
let scene, camera, renderer, controls;
let brain = null;
let dotCloud = null;
let toggle = true;

// Initialize the scene
function initScene() {
  // Create scene
  scene = new THREE.Scene();
  
  // Create camera
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 0, 40);
  
  // Create renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000); // Set initial background color to black
  document.body.appendChild(renderer.domElement);
  
  // Set up controls
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.enableZoom = true;
  
  // Add lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambientLight);
  
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(10, 10, 10);
  directionalLight.castShadow = true;
  scene.add(directionalLight);
  
  // Handle window resize
  window.addEventListener('resize', onWindowResize);
}

// Handle window resize
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// Load the brain model
function loadBrainModel() {
  // Set up loader
  const loader = new THREE.GLTFLoader();
  
  // Load the brain model directly without showing a placeholder sphere
  loader.load('brainBBBBB.glb', function(gltf) {
    console.log("GLB model loaded successfully!");
    
    // Get the brain mesh from the loaded model
    brain = gltf.scene;
    brain.scale.set(0.5, 0.5, 0.5);
    brain.position.set(0, 0, 0);
    
    // Set the material of the brain - even less shiny
    brain.traverse((child) => {
      if (child.isMesh) {
        child.material = new THREE.MeshStandardMaterial({ 
          color: 0xff69b4, // Pink color for the brain
          emissive: 0x220000, // Slight glow
          roughness: 0.9,     // Further increased roughness to make less shiny
          metalness: 0.05     // Further reduced metalness to make less shiny
        });
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

// Create dot cloud with original specifications
function createDotCloud() {
  dotCloud = new THREE.Group();
  
  // Create 300 dots with size 0.1
  const dotCount = 300;
  
  for (let i = 0; i < dotCount; i++) {
    const dotGeometry = new THREE.SphereGeometry(0.1, 8, 8);
    
    // Use original color palette
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#00ffff'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    const dotMaterial = new THREE.MeshBasicMaterial({ color: color });
    const dot = new THREE.Mesh(dotGeometry, dotMaterial);
    
    // Position dots in sphere with radius 15
    const radius = 15;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI;
    
    dot.position.x = radius * Math.sin(phi) * Math.cos(theta);
    dot.position.y = radius * Math.sin(phi) * Math.sin(theta);
    dot.position.z = radius * Math.cos(phi);
    
    dotCloud.add(dot);
  }
  
  scene.add(dotCloud);
}

// Handle color changes
function triggerColorChange() {
  console.log("Color change triggered - toggling background, text, and dot colors.");
  const link = document.querySelector('#container a');
  
  if (toggle) {
    // Switch to random colors
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#00ffff'];
    
    // Get random colors that don't match
    let textColorIndex = Math.floor(Math.random() * colors.length);
    let bgColorIndex;
    do {
      bgColorIndex = Math.floor(Math.random() * colors.length);
    } while (textColorIndex === bgColorIndex);
    
    // Apply new colors
    link.style.color = colors[textColorIndex];
    renderer.setClearColor(colors[bgColorIndex]);
    
    // Update dot colors
    dotCloud.children.forEach((dot) => {
      const colorIndex = Math.floor(Math.random() * colors.length);
      dot.material.color.set(colors[colorIndex]);
    });
  } else {
    // Switch back to black/white
    link.style.color = '#ffffff'; // Text to white
    renderer.setClearColor('#000000'); // Background to black
    
    // Change dots back to random colors
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#00ffff'];
    dotCloud.children.forEach((dot) => {
      const colorIndex = Math.floor(Math.random() * colors.length);
      dot.material.color.set(colors[colorIndex]);
    });
  }
  
  // Toggle for next movement
  toggle = !toggle;
}

// Set up user interaction
function setupInteraction() {
  // Interaction zone to detect mouse/finger movement
  function isWithinZone(x, y) {
    const screenHeight = window.innerHeight;
    const screenWidth = window.innerWidth;
    const rectTop = screenHeight * 0.2;
    const rectBottom = screenHeight * 0.9;
    const rectLeft = screenWidth * 0.2;
    const rectRight = screenWidth * 0.8;
    
    return y > rectTop && y < rectBottom && x > rectLeft && x < rectRight;
  }

  // For web: handle mouse movements
  document.addEventListener('mousemove', (event) => {
    if (isWithinZone(event.clientX, event.clientY)) {
      if (!toggle) {
        triggerColorChange();
      }
    } else {
      if (toggle) {
        triggerColorChange();
      }
    }
  });

  // For mobile: handle touch events
  document.addEventListener('touchmove', (event) => {
    const touch = event.touches[0];
    if (isWithinZone(touch.clientX, touch.clientY)) {
      if (!toggle) {
        triggerColorChange();
      }
    } else {
      if (toggle) {
        triggerColorChange();
      }
    }
  });
}

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  
  if (brain) {
    brain.rotation.y += 0.002;
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
  initScene();
  loadBrainModel();
  createDotCloud();
  setupInteraction();
  
  // Trigger initial color change
  triggerColorChange();
  
  // Start animation loop
  animate();
}

// Start the application when the page is loaded
window.addEventListener('DOMContentLoaded', init);

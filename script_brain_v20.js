
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
  
  // Create colorful brain sphere
  createBrainSphere();
  
  // Create dot cloud background
  createDotCloud();
  
  // Handle window resize
  window.addEventListener('resize', onWindowResize);
  
  // Start animation loop
  animate();
  
  console.log("Initialization complete");
}

// Create a colorful brain sphere
function createBrainSphere() {
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
  console.log("Brain sphere created");
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
  
  // Update brain material colors
  if (brain) {
    brain.rotation.y += 0.003;
    
    // Animate brain colors
    const time = Date.now() * 0.001;
    const r = Math.sin(time * 0.5) * 0.5 + 0.5;
    const g = Math.sin(time * 0.3) * 0.5 + 0.5;
    const b = Math.sin(time * 0.2) * 0.5 + 0.5;
    
    brain.material.color.setRGB(r, g, b);
    brain.material.emissive.setRGB(r * 0.2, g * 0.2, b * 0.2);
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

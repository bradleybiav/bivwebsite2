
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
    dotCloud.children.forEach((dot) => {
      const colorIndex = Math.floor(Math.random() * colors.length);
      dot.material.color.set(colors[colorIndex]);
    });
  } else {
    // Switch back to black/white
    link.style.color = '#ffffff'; // Text to white
    renderer.setClearColor('#000000'); // Background to black
    
    // Change dots back to random colors
    dotCloud.children.forEach((dot) => {
      const colorIndex = Math.floor(Math.random() * colors.length);
      dot.material.color.set(colors[colorIndex]);
    });
  }
  
  // Toggle for next movement
  toggle = !toggle;
}

// Set up the scene, camera, and renderer
function setupScene() {
  // Create a scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);
  
  // Create a camera
  const aspectRatio = window.innerWidth / window.innerHeight;
  camera = new THREE.PerspectiveCamera(45, aspectRatio, 0.1, 1000);
  camera.position.set(0, 0, 100);
  camera.lookAt(0, 0, 0);
  
  // Create a renderer
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  document.body.appendChild(renderer.domElement);
  
  // Create controls
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  
  // Handle window resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
  
  // Add ambient light
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);
  
  // Add directional light
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(10, 10, 10);
  scene.add(directionalLight);
}

// Load the brain model
function loadBrainModel() {
  const loader = new THREE.GLTFLoader();
  loader.load('brainBBBBB.glb', (gltf) => {
    brain = gltf.scene;
    brain.scale.set(15, 15, 15);
    scene.add(brain);
    console.log("GLB model loaded successfully!");
  });
}

// Create dot cloud
function createDotCloudObj() {
  // Create a group for the dot cloud
  dotCloud = new THREE.Group();
  
  // Create 1500 dots with size 0.1
  const dotCount = 1500;
  
  for (let i = 0; i < dotCount; i++) {
    const dotGeometry = new THREE.SphereGeometry(0.1, 8, 8);
    
    // Use the color palette
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#00ffff'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    const dotMaterial = new THREE.MeshBasicMaterial({ color: color });
    const dot = new THREE.Mesh(dotGeometry, dotMaterial);
    
    // Position dots THROUGHOUT the sphere volume with radius 30
    // For volume distribution we use r * Math.cbrt(Math.random())
    // This gives proper volume distribution rather than just surface points
    const radius = 30 * Math.cbrt(Math.random()); // Distribute throughout volume
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI;
    
    dot.position.x = radius * Math.sin(phi) * Math.cos(theta);
    dot.position.y = radius * Math.sin(phi) * Math.sin(theta);
    dot.position.z = radius * Math.cos(phi);
    
    dotCloud.add(dot);
  }
  
  scene.add(dotCloud);
}

// Setup interaction
function setupInteraction() {
  document.addEventListener('click', triggerColorChange);
  document.addEventListener('touchstart', triggerColorChange);
  document.addEventListener('keydown', (event) => {
    if (event.key === ' ' || event.code === 'Space') {
      triggerColorChange();
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
  setupScene();
  loadBrainModel();
  createDotCloudObj();
  setupInteraction();
  
  // Trigger initial color change
  triggerColorChange();
  
  // Start animation loop
  animate();
}

// Start the application when the page is loaded
window.addEventListener('DOMContentLoaded', init);

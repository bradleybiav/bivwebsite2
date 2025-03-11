
// Scene setup module

// Create and configure the main scene components
export function setupScene() {
  console.log("Setting up scene...");
  
  // Create renderer with antialias
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setAnimationLoop(animate);
  document.body.appendChild(renderer.domElement);
  console.log("Renderer created and appended to body");
  
  // Set document body styles
  document.body.style.margin = '0';
  document.body.style.overflow = 'hidden';
  
  // Create scene with black background
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('black');
  console.log("Scene created with black background");
  
  // Create texture for ground
  const map = createTexture();
  map.repeat.set(6, 6);
  
  // Create ground plane
  const ground = new THREE.Mesh(
    new THREE.BoxBufferGeometry(1800, 10, 1800),
    new THREE.MeshBasicMaterial({ map: map })
  );
  scene.add(ground);
  console.log("Ground added to scene");
  
  // Setup camera
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 10000);
  camera.position.set(0, 250, 200);
  camera.lookAt(ground.position);
  
  // Setup clock for animation
  const clock = new THREE.Clock(true);
  
  // Handle window resize
  window.addEventListener('resize', () => onWindowResize(camera, renderer), false);
  onWindowResize(camera, renderer);
  
  return { scene, camera, renderer, clock };
}

// Window resize handler
function onWindowResize(camera, renderer) {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight, true);
}

// Animation function
function animate() {
  // This will be imported and used from animation.js
  // But is needed here for the renderer.setAnimationLoop
}

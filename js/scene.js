
// Enhanced scene setup module

// Create and configure the main scene components
export function setupScene(THREE, createTextureFunc) {
  console.log("Setting up enhanced scene...");
  
  // Create renderer with antialias and shadow support
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  document.body.appendChild(renderer.domElement);
  console.log("Enhanced renderer created and appended to body");
  
  // Set document body styles
  document.body.style.margin = '0';
  document.body.style.overflow = 'hidden';
  
  // Create scene with black background
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('black');
  scene.fog = new THREE.FogExp2(0x000000, 0.0015); // Add subtle fog
  console.log("Scene created with black background and fog");
  
  // Create texture for ground
  const map = createTextureFunc(THREE);
  map.repeat.set(6, 6);
  
  // Create ground plane with shadows
  const ground = new THREE.Mesh(
    new THREE.BoxBufferGeometry(1800, 10, 1800),
    new THREE.MeshBasicMaterial({ map: map })
  );
  ground.receiveShadow = true;
  scene.add(ground);
  console.log("Ground added to scene with shadow receiving");
  
  // Setup camera with better positioning
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 10000);
  camera.position.set(0, 250, 200);
  camera.lookAt(0, 100, 0); // Look more at the brain position
  
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

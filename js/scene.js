
// Scene setup module

export function setupScene() {
  // Create scene
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x111111); // Very dark gray background
  
  // Setup camera
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 0, 12); // Positioned further back to see more of the scene
  
  // Setup renderer with antialias for better quality
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x111111, 1);
  renderer.setPixelRatio(window.devicePixelRatio);
  document.body.appendChild(renderer.domElement);
  
  // Add lighting to make objects visible
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Slightly dimmer ambient light
  scene.add(ambientLight);
  
  // Add directional lights from multiple angles for better reflection
  const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight1.position.set(1, 1, 1);
  scene.add(directionalLight1);
  
  const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
  directionalLight2.position.set(-1, 0.5, -1);
  scene.add(directionalLight2);
  
  // Handle window resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
  
  // Return scene objects
  return { scene, camera, renderer, controls: null };
}

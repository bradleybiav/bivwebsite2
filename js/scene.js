
// Scene setup module

export function setupScene() {
  // Create scene
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x111111); // Very dark gray background
  
  // Setup camera
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 0, 10); // Positioned further back to see more of the scene
  
  // Setup renderer with antialias for better quality
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x111111, 1);
  document.body.appendChild(renderer.domElement);
  
  // Add lighting to make objects visible
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.7); // Brighter ambient light
  scene.add(ambientLight);
  
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0); // Brighter directional light
  directionalLight.position.set(1, 1, 1);
  scene.add(directionalLight);
  
  // Handle window resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
  
  // Return scene objects
  return { scene, camera, renderer, controls: null };
}


// Main script for Brain in a Vat visualization with animated background
// Based on Brain and Motion reference

// Wait for DOM content to load
document.addEventListener('DOMContentLoaded', () => {
  console.log("Brain script loaded. Setting up scene...");
  
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
  
  // Load brain model
  let brain = null;
  const loader = new THREE.GLTFLoader();
  loader.load('brainBBBBB.glb', (gltf) => {
    console.log("Loading model: 50%");
    brain = gltf.scene;
    
    // Scale brain down
    brain.scale.set(8, 8, 8);
    brain.position.set(0, 100, 0); // Position brain above ground
    
    // Add brain to scene
    scene.add(brain);
    console.log("Brain model loaded and added to scene");
    console.log("Loading model: 100%");
  }, 
  // Progress callback
  (xhr) => {
    console.log(`Model loading: ${(xhr.loaded / xhr.total * 100).toFixed(2)}%`);
  },
  // Error callback
  (error) => {
    console.error('Error loading model:', error);
  });
  
  // Handle window resize
  window.addEventListener('resize', onWindowResize, false);
  onWindowResize();
  
  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight, true);
  }
  
  // Create texture function (based on the reference)
  function createTexture() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = 256;
    canvas.height = 256;
    
    // Draw random colored pixels
    for (let i = 0; i < 100000; i++) {
      ctx.fillStyle = `hsl(${30 + 140 * Math.random()}, 70%, ${100 * Math.random()}%)`;
      ctx.fillRect(
        Math.floor(Math.random() * 256), // THREE.Math.randInt is deprecated
        Math.floor(Math.random() * 256), 
        1, 
        1
      );
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    
    return texture;
  }
  
  // Animation loop
  function animate() {
    const dTime = clock.getDelta();
    const time = clock.getElapsedTime();
    
    // Rotate scene periodically (like in reference)
    if (time % 10 < 5) {
      scene.rotation.y += dTime * (0.5 + 0.5 * Math.cos((time % 10 - 2.5) / 2.5 * Math.PI));
    }
    
    // Update brain rotation if it exists
    if (brain) {
      brain.rotation.y += 0.003;
    }
    
    // Render the scene
    renderer.render(scene, camera);
  }
});

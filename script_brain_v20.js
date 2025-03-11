
// Main script for Brain in a Vat visualization

// Wait for DOM content to load
document.addEventListener('DOMContentLoaded', () => {
  console.log("Main script loaded. Setup will begin when DOM is ready.");
  
  // Create scene
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x111111); // Very dark gray background
  
  // Setup camera
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 0, 50); // Positioned far back to see the orbiting spheres
  
  // Setup renderer with antialias for better quality
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x111111, 1);
  renderer.setPixelRatio(window.devicePixelRatio);
  document.body.appendChild(renderer.domElement);
  
  // Add lighting to make objects visible
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Ambient light
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
  
  // Variables for animation
  let brain = null;
  let orbitingSpheres = null;
  const clock = new THREE.Clock();
  
  // Load brain model
  const loader = new THREE.GLTFLoader();
  loader.load('brainBBBBB.glb', (gltf) => {
    console.log("Loading model: 50%");
    brain = gltf.scene;
    
    // Scale brain down
    brain.scale.set(8, 8, 8);
    
    // Add brain to scene
    scene.add(brain);
    console.log("Brain model loaded and added to scene");
    console.log("Loading model: 100%");
    
    // Create orbital spheres after brain is loaded
    orbitingSpheres = createOrbitingSpheres();
    scene.add(orbitingSpheres);
    
    // Start animation
    animate();
  });
  
  // Create orbiting spheres
  function createOrbitingSpheres() {
    const sphereCount = 50;
    const group = new THREE.Group();
    
    // Soccer ball texture
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load('https://threejs.org/examples/textures/soccer.png');
    
    // Create sphere geometry (reused for all spheres)
    const sphereGeometry = new THREE.SphereGeometry(0.3, 16, 16);
    
    // Create spheres with random orbital parameters
    for (let i = 0; i < sphereCount; i++) {
      // Create material with white/gray color and soccer ball texture
      const material = new THREE.MeshPhongMaterial({
        color: new THREE.Color(0.9, 0.9, 0.9),
        map: texture,
        specular: 0xffffff,
        shininess: 30
      });
      
      // Create sphere mesh
      const sphere = new THREE.Mesh(sphereGeometry, material);
      
      // Random orbit parameters
      const orbitRadius = 8 + Math.random() * 4; // Radius between 8-12
      
      // Create a random axis for this sphere to orbit around
      const axisX = Math.random() - 0.5;
      const axisY = Math.random() - 0.5;
      const axisZ = Math.random() - 0.5;
      
      // Store orbit parameters in userData
      sphere.userData = {
        orbitRadius: orbitRadius,
        orbitSpeed: 0.1 + Math.random() * 0.2, // Random orbit speed
        orbitPhase: Math.random() * Math.PI * 2, // Random starting phase
        orbitAxis: new THREE.Vector3(axisX, axisY, axisZ).normalize(), // Normalized random axis
        clockwise: Math.random() > 0.5 // Random direction
      };
      
      // Initial position
      const angle = sphere.userData.orbitPhase;
      
      // Create basis vectors for the orbital plane
      const up = new THREE.Vector3(0, 1, 0);
      const orbit1 = new THREE.Vector3().crossVectors(up, sphere.userData.orbitAxis).normalize();
      if (orbit1.length() < 0.1) {
        orbit1.set(1, 0, 0); // Fallback if vectors are parallel
      }
      const orbit2 = new THREE.Vector3().crossVectors(sphere.userData.orbitAxis, orbit1).normalize();
      
      // Calculate position on the orbit
      const x = orbitRadius * (Math.cos(angle) * orbit1.x + Math.sin(angle) * orbit2.x);
      const y = orbitRadius * (Math.cos(angle) * orbit1.y + Math.sin(angle) * orbit2.y);
      const z = orbitRadius * (Math.cos(angle) * orbit1.z + Math.sin(angle) * orbit2.z);
      
      sphere.position.set(x, y, z);
      
      // Add to group
      group.add(sphere);
    }
    
    console.log("Orbital spheres created");
    return group;
  }
  
  // Animation loop
  function animate() {
    requestAnimationFrame(animate);
    
    // Update brain rotation if it exists
    if (brain) {
      brain.rotation.y += 0.003;
    }
    
    // Update sphere positions
    if (orbitingSpheres) {
      const time = clock.getElapsedTime();
      
      orbitingSpheres.children.forEach((sphere) => {
        const { orbitRadius, orbitSpeed, orbitPhase, orbitAxis, clockwise } = sphere.userData;
        
        // Calculate current angle based on time
        const direction = clockwise ? 1 : -1;
        const angle = orbitPhase + time * orbitSpeed * direction;
        
        // Create basis vectors for the orbital plane
        const up = new THREE.Vector3(0, 1, 0);
        const orbit1 = new THREE.Vector3().crossVectors(up, orbitAxis).normalize();
        if (orbit1.length() < 0.1) {
          orbit1.set(1, 0, 0); // Fallback if vectors are parallel
        }
        const orbit2 = new THREE.Vector3().crossVectors(orbitAxis, orbit1).normalize();
        
        // Calculate position on the orbit
        const x = orbitRadius * (Math.cos(angle) * orbit1.x + Math.sin(angle) * orbit2.x);
        const y = orbitRadius * (Math.cos(angle) * orbit1.y + Math.sin(angle) * orbit2.y);
        const z = orbitRadius * (Math.cos(angle) * orbit1.z + Math.sin(angle) * orbit2.z);
        
        // Update sphere position
        sphere.position.set(x, y, z);
        
        // Add a gentle rotation to each sphere
        sphere.rotation.x += 0.01;
        sphere.rotation.y += 0.01;
      });
    }
    
    // Render the scene
    renderer.render(scene, camera);
  }
});

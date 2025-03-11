
// Brain model loading module with enhanced features

// Load the brain 3D model with improved appearance
export function loadBrainModel(scene, THREE, callback) {
  console.log("Loading enhanced brain model...");
  
  // Create and configure loader
  const loader = new THREE.GLTFLoader();
  
  // Create lighting for the brain
  const ambientLight = new THREE.AmbientLight(0x404040, 1.5); // Soft ambient light
  scene.add(ambientLight);
  
  const directionalLight = new THREE.DirectionalLight(0x9b87f5, 1); // Purple-tinted light
  directionalLight.position.set(1, 1, 1);
  directionalLight.castShadow = true;
  scene.add(directionalLight);
  
  const pointLight = new THREE.PointLight(0xD946EF, 1, 1000); // Magenta point light
  pointLight.position.set(0, 150, 0);
  scene.add(pointLight);
  
  loader.load(
    'brainBBBBB.glb',
    (gltf) => {
      console.log("Loading model: 50%");
      const brain = gltf.scene;
      
      // Enhanced appearance
      brain.scale.set(8, 8, 8);
      brain.position.set(0, 110, 0); // Positioned slightly higher
      
      // Apply custom material to brain parts if needed
      brain.traverse((child) => {
        if (child.isMesh) {
          // Create a shimmering material
          const originalMaterial = child.material;
          
          // Create a custom material that's semi-transparent and shimmering
          child.material = new THREE.MeshPhysicalMaterial({
            color: 0x9b87f5,       // Purple base color
            metalness: 0.5,         // Slightly metallic
            roughness: 0.2,         // Fairly smooth
            transparent: true,      // Allow transparency
            opacity: 0.9,           // Slightly transparent
            emissive: 0x6E59A5,     // Slight glow effect
            emissiveIntensity: 0.2, // Subtle glow
          });
          
          // Enable shadows
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      
      // Add brain to scene
      scene.add(brain);
      console.log("Enhanced brain model loaded and added to scene");
      console.log("Loading model: 100%");
      
      // Execute callback with the loaded brain model
      if (callback) callback(brain);
    },
    // Progress callback
    (xhr) => {
      console.log(`Model loading: ${(xhr.loaded / xhr.total * 100).toFixed(2)}%`);
    },
    // Error callback
    (error) => {
      console.error('Error loading model:', error);
    }
  );
}

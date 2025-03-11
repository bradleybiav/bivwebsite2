
// Brain model loading module

// Load the brain 3D model
export function loadBrainModel(scene, callback) {
  console.log("Loading brain model...");
  
  // Create and configure loader
  const loader = new THREE.GLTFLoader();
  
  loader.load(
    'brainBBBBB.glb',
    (gltf) => {
      console.log("Loading model: 50%");
      const brain = gltf.scene;
      
      // Scale brain down
      brain.scale.set(8, 8, 8);
      brain.position.set(0, 100, 0); // Position brain above ground
      
      // Add brain to scene
      scene.add(brain);
      console.log("Brain model loaded and added to scene");
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

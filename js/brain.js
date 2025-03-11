
// Brain model module

export function loadBrainModel(scene, callback) {
  // Create loading manager to track progress
  const loadingManager = new THREE.LoadingManager();
  loadingManager.onProgress = function(url, itemsLoaded, itemsTotal) {
    console.log('Loading model: ' + Math.round(itemsLoaded / itemsTotal * 100) + '%');
  };
  
  // Create a GLTFLoader to load the model
  const loader = new THREE.GLTFLoader(loadingManager);
  
  // Load the brain model
  loader.load(
    'brainBBBBB.glb',  // Path to the model
    function(gltf) {
      // Model loaded successfully
      const brain = gltf.scene;
      
      // Scale the brain to a reasonable size
      brain.scale.set(2.2, 2.2, 2.2);
      
      // Position the brain in the center but slightly offset
      brain.position.set(0, -1, 0);
      
      // Make the brain emissive for a glowing effect
      brain.traverse(function(child) {
        if (child.isMesh) {
          // Update material to be more colorful and glowing
          child.material = new THREE.MeshPhongMaterial({
            color: 0xff00ff,
            emissive: 0x440044,
            specular: 0xffffff,
            shininess: 100,
            transparent: true,
            opacity: 0.9
          });
        }
      });
      
      // Add the brain to the scene
      scene.add(brain);
      console.log("Brain model loaded and added to scene");
      
      // Set up animation mixer if the model has animations
      let mixer = null;
      if (gltf.animations && gltf.animations.length) {
        mixer = new THREE.AnimationMixer(brain);
        const action = mixer.clipAction(gltf.animations[0]);
        action.play();
        console.log("Brain animations set up");
      }
      
      // Call the callback with the brain
      if (callback) {
        callback(brain, mixer);
      }
    },
    // Progress callback
    function(xhr) {
      console.log("Loading brain model: " + (xhr.loaded / xhr.total * 100) + "% loaded");
    },
    // Error callback
    function(error) {
      console.error("Error loading brain model:", error);
      // Fallback to creating a brain sphere if model fails to load
      createBrainSphere(scene, callback);
    }
  );
}

// Create a colorful brain sphere (fallback if model loading fails)
function createBrainSphere(scene, callback) {
  console.log("Creating fallback brain sphere");
  const geometry = new THREE.SphereGeometry(1, 32, 32);
  const material = new THREE.MeshPhongMaterial({
    color: 0xff00ff,
    emissive: 0x440044,
    specular: 0xffffff,
    shininess: 100,
    transparent: true,
    opacity: 0.9
  });
  
  const brain = new THREE.Mesh(geometry, material);
  brain.position.set(0, -1, 0); // Match the position of the brain model
  scene.add(brain);
  console.log("Brain sphere created as fallback");
  
  // Call the callback with the brain
  if (callback) {
    callback(brain, null);
  }
}

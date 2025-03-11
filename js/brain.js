
// Brain model module

export function createBrain() {
  // Create a placeholder brain using a sphere
  const brainGeometry = new THREE.SphereGeometry(5, 32, 32);
  const brainMaterial = new THREE.MeshStandardMaterial({ color: 0xff69b4 });
  const brain = new THREE.Mesh(brainGeometry, brainMaterial);
  brain.scale.set(0.5, 0.5, 0.5);
  brain.position.set(0, 0, 0);
  brain.castShadow = true;
  brain.receiveShadow = true;
  
  // Initialize quaternion for rotation
  brain.quaternion.set(0, 0, 0, 1);
  
  return brain;
}

export function loadBrainModel(scene, placeholderBrain) {
  // Attempt to load the GLB model
  console.log("Attempting to load the 3D brain model...");
  const loader = new THREE.GLTFLoader();
  loader.load('brainBBBBB.glb', function (gltf) {
    console.log("GLB model loaded successfully!");
    // Remove the placeholder brain
    scene.remove(placeholderBrain);
    
    const brain = gltf.scene;
    brain.scale.set(0.5, 0.5, 0.5); // Adjust scale if necessary
    brain.position.set(0, 0, 0);
    
    // Set the material of the brain to pink initially
    brain.traverse((child) => {
      if (child.isMesh) {
        child.material = new THREE.MeshStandardMaterial({ color: 0xff69b4 }); // Set brain color to pink
        child.castShadow = true; // Enable shadows for the brain
        child.receiveShadow = true; // Enable the brain to receive shadows
      }
    });
    
    scene.add(brain);
    
    // Initialize quaternion for rotation
    brain.quaternion.set(0, 0, 0, 1);
  }, undefined, function (error) {
    console.error('An error happened while loading the GLB model:', error);
    console.log("Continuing with the placeholder brain...");
  });
}

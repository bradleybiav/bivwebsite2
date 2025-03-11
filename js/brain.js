
// Brain model module

export function loadBrainModel(scene, onLoadCallback) {
  // Set up loader
  const loader = new THREE.GLTFLoader();
  
  // Load the brain model
  loader.load('brainBBBBB.glb', function(gltf) {
    console.log("GLB model loaded successfully!");
    
    // Get the brain mesh from the loaded model
    const brain = gltf.scene;
    brain.scale.set(0.5, 0.5, 0.5);
    brain.position.set(0, 0, 0);
    
    // Set the material of the brain - even less shiny
    brain.traverse((child) => {
      if (child.isMesh) {
        child.material = new THREE.MeshStandardMaterial({ 
          color: 0xff69b4, // Pink color for the brain
          emissive: 0x220000, // Slight glow
          roughness: 0.9,     // Further increased roughness to make less shiny
          metalness: 0.05     // Further reduced metalness to make less shiny
        });
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    
    // Add the brain to the scene
    scene.add(brain);
    
    // Call the callback with the loaded brain
    if (onLoadCallback) {
      onLoadCallback(brain);
    }
    
  }, undefined, function(error) {
    console.error('An error happened while loading the GLB model:', error);
  });
}

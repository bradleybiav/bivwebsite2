
// Brain model module

export function loadBrainModel(scene, callback) {
  // Use the global THREE object instead of importing it
  
  // Set up loader
  const loader = new THREE.GLTFLoader();
  let screamOptions = null;
  
  // Try to access tsl-textures if it exists
  if (typeof tsl !== 'undefined' && tsl.scream) {
    console.log("TSL Textures is available!");
    
    // Create Scream texture options with uniforms
    try {
      // Create options for Scream texture with uniform values
      screamOptions = {
        scale: 1,
        variety: 1,
        color: { value: new THREE.Color(0.6, 0.8, 0.3) }, // greenish-purple initial color
        background: new THREE.Color(0.2, 0.1, 0.3), // Dark purple background
        seed: { value: 0 } // Dynamic seed value for animation
      };
      
      console.log("Scream options created:", screamOptions);
    } catch (e) {
      console.error("Error creating scream options:", e);
    }
  } else {
    console.warn("TSL Textures not available. Will use fallback material.");
  }
  
  // Load the brain model
  loader.load('brainBBBBB.glb', function(gltf) {
    console.log("GLB model loaded successfully!");
    
    // Get the brain mesh from the loaded model
    const brain = gltf.scene;
    brain.scale.set(0.5, 0.5, 0.5);
    brain.position.set(0, 0, 0); // Ensure brain is centered at origin
    
    // Apply material to brain
    brain.traverse((child) => {
      if (child.isMesh) {
        try {
          if (typeof tsl !== 'undefined' && tsl.scream) {
            // Create a material with the Scream texture
            console.log("Applying TSL Scream texture to brain");
            
            // Create a standard material
            const material = new THREE.MeshStandardMaterial({
              roughness: 0.4,
              metalness: 0.6
            });
            
            // Apply the Scream texture
            const screamTexture = new tsl.scream(screamOptions);
            screamTexture.setMaterial(material);
            
            child.material = material;
          } else {
            // Fallback to a colorful material if TSL is not available
            console.log("Using fallback material for brain");
            child.material = new THREE.MeshStandardMaterial({
              color: new THREE.Color(0.8, 0.2, 0.6),
              roughness: 0.4,
              metalness: 0.6
            });
          }
          
          child.castShadow = true;
          child.receiveShadow = true;
        } catch (e) {
          console.error("Error applying material to brain:", e);
          
          // Use a fallback material if there's an error
          child.material = new THREE.MeshStandardMaterial({
            color: new THREE.Color(0.8, 0.2, 0.6),
            roughness: 0.4,
            metalness: 0.6
          });
        }
      }
    });
    
    // Add the brain to the scene
    scene.add(brain);
    
    // Call the callback with the brain and screamOptions
    if (callback) {
      callback(brain, screamOptions);
    }
  }, undefined, function(error) {
    console.error('An error happened while loading the GLB model:', error);
  });
}

// Update scream animation
export function updateScreamAnimation(screamOptions) {
  if (screamOptions && screamOptions.seed && screamOptions.color) {
    // Animate the seed parameter for movement
    const time = performance.now();
    
    // Update seed with a sine wave pattern for flowing animation
    screamOptions.seed.value = 3 * Math.sin(time / 3700);
    
    // Slowly shift colors over time
    screamOptions.color.value.set(
      0.5 + 0.5 * Math.sin(time / 7000),
      0.5 + 0.5 * Math.sin(time / 8000),
      0.5 + 0.5 * Math.sin(time / 5000)
    );
  }
}

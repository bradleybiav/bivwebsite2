
// Enhanced animation module

// Animation function to update and render the scene with improved brain animations
export function animate(scene, camera, renderer, clock, brain) {
  const dTime = clock.getDelta();
  const time = clock.getElapsedTime();
  
  // Rotate scene periodically (like in reference)
  if (time % 10 < 5) {
    scene.rotation.y += dTime * (0.5 + 0.5 * Math.cos((time % 10 - 2.5) / 2.5 * Math.PI));
  }
  
  // Enhanced brain animations if it exists
  if (brain) {
    // Basic rotation on Y axis
    brain.rotation.y += 0.003;
    
    // Gentle floating motion
    brain.position.y = 110 + Math.sin(time * 0.5) * 5; // Float up and down
    
    // Slight "breathing" scale effect
    const breathScale = 1 + Math.sin(time * 0.8) * 0.02;
    brain.scale.set(8 * breathScale, 8 * breathScale, 8 * breathScale);
    
    // Update any point lights to create dynamic lighting
    scene.children.forEach(child => {
      if (child.isPointLight) {
        child.intensity = 1 + Math.sin(time * 1.5) * 0.2; // Pulsing light intensity
      }
    });
  }
  
  // Render the scene
  renderer.render(scene, camera);
}

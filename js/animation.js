
// Animation module

export function animate(brain, dotCloud, screamOptions, controls, renderer, scene, camera) {
  requestAnimationFrame(() => animate(brain, dotCloud, screamOptions, controls, renderer, scene, camera));
  
  if (brain) {
    // Create continuous rotation around the Y axis (like a globe)
    brain.rotation.y += 0.008; // Increased by 60% from 0.005 to 0.008
    
    // No rotation on X or Z axes to maintain a globe-like spin
    
    // Update scream animation
    if (screamOptions && screamOptions.seed) {
      screamOptions.seed.value = (performance.now() / 3000) % 100;
    }
  }
  
  controls.update();
  renderer.render(scene, camera);
}

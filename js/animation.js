
// Animation module

// Animation function to update and render the scene
export function animate(scene, camera, renderer, clock, brain) {
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


// Animation module

import { updateScreamAnimation } from './brain.js';

// Animation loop
export function animate(brain, dotCloud, screamOptions, controls, renderer, scene, camera) {
  requestAnimationFrame(() => animate(brain, dotCloud, screamOptions, controls, renderer, scene, camera));
  
  // Update controls
  controls.update();
  
  // Update brain rotation at a steady rate
  if (brain) {
    brain.rotation.y += 0.003;
  }
  
  // Update dot cloud rotation at a steady rate
  if (dotCloud) {
    dotCloud.rotation.y += 0.001;
  }
  
  // Update the scream animation if options are available
  if (screamOptions) {
    updateScreamAnimation(screamOptions);
  }
  
  // Render the scene
  renderer.render(scene, camera);
}


// Main script for Brain in a Vat visualization

import { setupScene } from './scene.js';
import { loadBrainModel } from './brain.js';
import { animate } from './animation.js';
import { createTexture } from './texture.js';

// Export the createTexture function for use in scene.js
window.createTexture = createTexture;

// Store brain model reference
let brain = null;

// Initialize when DOM content is loaded
document.addEventListener('DOMContentLoaded', () => {
  console.log("Brain script loaded. Initializing...");
  
  // Set up scene, camera, renderer, etc.
  const { scene, camera, renderer, clock } = setupScene();
  
  // Load brain model and set up animation
  loadBrainModel(scene, (loadedBrain) => {
    brain = loadedBrain;
    
    // Set up animation loop
    renderer.setAnimationLoop(() => {
      animate(scene, camera, renderer, clock, brain);
    });
  });
});

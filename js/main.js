
// Main script for Brain in a Vat visualization with enhanced brain model

// Import modules
import { setupScene } from './scene.js';
import { loadBrainModel } from './brain.js';
import { animate } from './animation.js';
import { createTexture } from './texture.js';

// Make THREE accessible to the imported modules
let THREE;

// Store brain model reference
let brain = null;

// Initialize when DOM content is loaded
document.addEventListener('DOMContentLoaded', () => {
  console.log("Enhanced Brain script loaded. Initializing...");
  
  // Access THREE from the global scope
  THREE = window.THREE;
  
  // Set up scene, camera, renderer, etc.
  const { scene, camera, renderer, clock } = setupScene(THREE, createTexture);
  
  // Load enhanced brain model and set up animation
  loadBrainModel(scene, THREE, (loadedBrain) => {
    brain = loadedBrain;
    
    // Set up animation loop
    renderer.setAnimationLoop(() => {
      animate(scene, camera, renderer, clock, brain);
    });
  });
});

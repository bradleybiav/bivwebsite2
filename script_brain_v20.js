
// Main script for Brain in a Vat visualization

// Import modules without directly importing THREE
import { setupScene } from './js/scene.js';
import { createDotCloud } from './js/dotCloud.js';
import { loadBrainModel } from './js/brain.js';
import { animate } from './js/animation.js';

// Global variables
let scene, camera, renderer, controls;
let brain = null;
let dotCloud = null;
let screamOptions = null;

// Initialize and start animation
function init() {
  console.log("Script loaded and executed.");
  
  // Setup scene, camera, renderer, and controls
  const sceneSetup = setupScene();
  scene = sceneSetup.scene;
  camera = sceneSetup.camera;
  renderer = sceneSetup.renderer;
  controls = sceneSetup.controls;
  
  // Create and add dot cloud
  dotCloud = createDotCloud();
  scene.add(dotCloud);
  
  // Load the brain model
  loadBrainModel(scene, function(brainModel, options) {
    brain = brainModel;
    screamOptions = options;
    console.log("Brain model loaded with scream options:", !!screamOptions);
  });
  
  // Start animation loop
  animate(brain, dotCloud, screamOptions, controls, renderer, scene, camera);
}

// Start the application when the page is loaded
window.addEventListener('DOMContentLoaded', init);

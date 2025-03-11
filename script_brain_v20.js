
// Main script for Brain in a Vat visualization
import { setupScene } from './js/scene.js';
import { createDotCloud } from './js/dotCloud.js';
import { loadBrainModel } from './js/brain.js';
import { setupInteraction } from './js/interaction.js';
import { setupColors } from './js/colors.js';
import { animate } from './js/animation.js';

// Global variables
let scene, camera, renderer, controls;
let brain = null;
let dotCloud = null;
let screamOptions = null;

// Initialize and start animation
function init() {
  console.log("Script loaded and executed.");
  const sceneSetup = setupScene();
  scene = sceneSetup.scene;
  camera = sceneSetup.camera;
  renderer = sceneSetup.renderer;
  controls = sceneSetup.controls;
  
  // Load the brain model
  loadBrainModel(scene, function(brainModel, options) {
    brain = brainModel;
    screamOptions = options;
  });
  
  // Create and add dot cloud
  dotCloud = createDotCloud();
  scene.add(dotCloud);
  
  // Setup fixed colors (black background with colored dots)
  setupColors(renderer, dotCloud, screamOptions);
  
  // Setup interaction
  setupInteraction(renderer, dotCloud, screamOptions);
  
  // Start animation loop
  animate(brain, dotCloud, screamOptions, controls, renderer, scene, camera);
}

// Start the application when the page is loaded
window.addEventListener('DOMContentLoaded', init);

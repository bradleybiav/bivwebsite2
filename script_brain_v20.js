
// Main script for Brain in a Vat visualization
import { setupScene } from './js/scene.js';
import { createDotCloud, updateDotCloudColors } from './js/dotCloud.js';
import { loadBrainModel, updateScreamAnimation } from './js/brain.js';
import { setupInteraction } from './js/interaction.js';
import { triggerColorChange } from './js/colors.js';
import { animate } from './js/animation.js';

// Global variables
let scene, camera, renderer, controls;
let brain = null;
let dotCloud = null;
let toggle = true;
let screamOptions = null;

// Color change wrapper function
function handleColorChange() {
  toggle = triggerColorChange(renderer, dotCloud, screamOptions, toggle);
}

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
  
  // Setup interaction
  setupInteraction(renderer, dotCloud, screamOptions, handleColorChange);
  
  // Trigger initial color change
  handleColorChange();
  
  // Start animation loop
  animate(brain, dotCloud, screamOptions, controls, renderer, scene, camera);
}

// Start the application when the page is loaded
window.addEventListener('DOMContentLoaded', init);

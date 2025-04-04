
// Main setup module for Brain in a Vat visualization

// Import modules
import { setupScene } from './scene.js';
import { loadBrainModel } from './brain.js';
import { createSphereParticles } from './particles.js';
import { animate } from './animation.js';

// Global variables
let scene, camera, renderer, controls;
let brain = null;
let dotCloud = null;
let mixer = null;
let clock = new THREE.Clock();

// Initialize and start animation
function init() {
  console.log("Script loaded and executing...");
  
  // Setup scene, camera, renderer, and lighting
  const sceneSetup = setupScene();
  scene = sceneSetup.scene;
  camera = sceneSetup.camera;
  renderer = sceneSetup.renderer;
  controls = sceneSetup.controls;
  
  // Load 3D brain model
  loadBrainModel(scene, (loadedBrain, loadedMixer) => {
    brain = loadedBrain;
    mixer = loadedMixer;
    
    // Create orbital sphere particles
    dotCloud = createSphereParticles(scene);
    
    // Start animation loop
    animate(brain, dotCloud, mixer, clock, renderer, scene, camera);
  });
  
  console.log("Initialization complete");
}

export { init };


// Main script for Brain in a Vat visualization
import { setupScene } from './js/scene.js';
import { loadBrainModel } from './js/brain.js';
import { createDotCloud } from './js/dotCloud.js';
import { setupInteraction } from './js/interaction.js';
import { getRandomColor } from './js/colors.js';

// Global variables
let scene, camera, renderer, controls;
let brain = null;
let dotCloud = null;
let toggle = true;

// Color change function
function triggerColorChange() {
  console.log("Color change triggered - toggling background, text, and dot colors.");
  const link = document.querySelector('#container a');
  const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#00ffff'];
  
  if (toggle) {
    // Switch to random colors
    let textColorIndex = Math.floor(Math.random() * colors.length);
    let bgColorIndex;
    do {
      bgColorIndex = Math.floor(Math.random() * colors.length);
    } while (textColorIndex === bgColorIndex);
    
    // Apply new colors
    link.style.color = colors[textColorIndex];
    renderer.setClearColor(colors[bgColorIndex]);
    
    // Update dot colors
    dotCloud.children.forEach((dot) => {
      const colorIndex = Math.floor(Math.random() * colors.length);
      dot.material.color.set(colors[colorIndex]);
    });
  } else {
    // Switch back to black/white
    link.style.color = '#ffffff'; // Text to white
    renderer.setClearColor('#000000'); // Background to black
    
    // Change dots back to random colors
    dotCloud.children.forEach((dot) => {
      const colorIndex = Math.floor(Math.random() * colors.length);
      dot.material.color.set(colors[colorIndex]);
    });
  }
  
  // Toggle for next movement
  toggle = !toggle;
}

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  
  if (brain) {
    brain.rotation.y += 0.002;
  }
  
  if (dotCloud) {
    dotCloud.rotation.y -= 0.002; // Rotate the dot cloud in the opposite direction
  }
  
  controls.update();
  renderer.render(scene, camera);
}

// Initialize and start animation
function init() {
  console.log("Script loaded and executed.");
  const sceneSetup = setupScene();
  scene = sceneSetup.scene;
  camera = sceneSetup.camera;
  renderer = sceneSetup.renderer;
  controls = sceneSetup.controls;
  
  loadBrainModel(scene, (loadedBrain) => {
    brain = loadedBrain;
  });
  
  dotCloud = createDotCloud(getRandomColor);
  scene.add(dotCloud);
  
  setupInteraction(triggerColorChange, () => toggle);
  
  // Trigger initial color change
  triggerColorChange();
  
  // Start animation loop
  animate();
}

// Start the application when the page is loaded
window.addEventListener('DOMContentLoaded', init);

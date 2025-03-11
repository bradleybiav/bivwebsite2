
// Main entry point for the brain visualization
import { setupScene } from './js/scene.js';
import { createBrain, loadBrainModel } from './js/brain.js';
import { createDotCloud, changeDotColors } from './js/dotCloud.js';
import { setupInteraction } from './js/interaction.js';
import { getRandomColor, areColorsSimilar } from './js/colors.js';

// Log script start
console.log("Script loaded and executed.");

// Initialize the scene, camera, renderer, and controls
const { scene, camera, renderer, controls } = setupScene();

// Create initial brain placeholder
const brain = createBrain();
scene.add(brain);

// Create the dot cloud
const dotCloud = createDotCloud(getRandomColor);
scene.add(dotCloud);

// Try to load the 3D brain model
loadBrainModel(scene, brain);

// Set up interaction with color changes
let toggle = true; // To alternate between black/white and random colors

const triggerColorChange = () => {
  console.log("Color change triggered - toggling background, text, and dot colors.");
  const link = document.querySelector('#container a');
  
  if (toggle) {
    // Switch to random colors
    let newTextColor, newBgColor;
    
    do {
      newTextColor = getRandomColor();
      newBgColor = getRandomColor();
    } while (
      newTextColor === newBgColor || // Avoid matching text and background colors
      areColorsSimilar(newTextColor, newBgColor) // Avoid similar colors for text and background
    );
    
    // Apply new colors
    link.style.color = newTextColor;
    renderer.setClearColor(newBgColor);
    changeDotColors(dotCloud, newTextColor); // Change dots to match text color
  } else {
    // Switch back to black/white
    link.style.color = '#ffffff'; // Text to white
    renderer.setClearColor('#000000'); // Background to black
    changeDotColors(dotCloud, null, true); // Change dots back to random colors
  }
  
  // Toggle for next movement
  toggle = !toggle;
};

// Set up user interaction
setupInteraction(triggerColorChange, toggle);

// Trigger color change on page load
triggerColorChange();

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  
  if (brain) {
    const axis = new THREE.Vector3(0, 1, 0); // Rotation around Y-axis
    const angle = 0.002; // Rotation speed
    const quaternion = new THREE.Quaternion().setFromAxisAngle(axis, angle);
    brain.quaternion.multiplyQuaternions(quaternion, brain.quaternion);
  }
  
  if (dotCloud) {
    dotCloud.rotation.y -= 0.002; // Rotate the dot cloud in the opposite direction
  }
  
  controls.update();
  renderer.render(scene, camera);
}

// Start the animation loop
animate();

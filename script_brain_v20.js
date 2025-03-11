
import { init } from './js/setup.js';

// Wait for DOM content to load
document.addEventListener('DOMContentLoaded', () => {
  console.log("Main script loaded. Setup will begin when DOM is ready.");
  
  // Initialize 3D visualization
  init();
});

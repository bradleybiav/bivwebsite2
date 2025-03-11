
// Interaction module

export function setupInteraction(renderer, dotCloud, screamOptions, triggerColorChange) {
  // Interaction based on mouse movement - MODIFIED for small dot cloud movement only
  document.addEventListener('mousemove', function(event) {
    const moveX = (event.clientX - window.innerWidth / 2) * 0.02;
    const moveY = (event.clientY - window.innerHeight / 2) * 0.02;
    
    if (dotCloud) {
      // Reduce movement factor significantly for subtle effect
      dotCloud.rotation.y = -moveX * 0.005; // Reduced from 0.02 to 0.005
      dotCloud.rotation.x = -moveY * 0.005; // Reduced from 0.02 to 0.005
    }
  });
  
  // Interaction based on device orientation (for mobile devices) - MODIFIED for small dot cloud movement only
  window.addEventListener('deviceorientation', function(event) {
    if (event.beta && event.gamma) {
      const moveX = event.gamma * 0.05; // Left/right tilt
      const moveY = event.beta * 0.05; // Front/back tilt
      
      if (dotCloud) {
        // Reduce movement factor significantly for subtle effect
        dotCloud.rotation.y = -moveX * 0.005;
        dotCloud.rotation.x = -moveY * 0.005;
      }
    }
  });
  
  // Click or tap to change colors
  document.addEventListener('click', triggerColorChange);
  
  // Change colors every 3 seconds automatically
  setInterval(triggerColorChange, 3000);
}

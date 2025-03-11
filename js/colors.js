
// Color utilities module

export function triggerColorChange(renderer, dotCloud, screamOptions, toggle) {
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
    if (dotCloud) {
      dotCloud.children.forEach((dot) => {
        const colorIndex = Math.floor(Math.random() * colors.length);
        dot.material.color.set(colors[colorIndex]);
      });
    }
    
    // Update Scream texture color if available
    if (screamOptions && screamOptions.color) {
      const newColor = new THREE.Color(
        Math.random(), 
        Math.random(), 
        Math.random()
      );
      screamOptions.color.value.copy(newColor);
    }
  } else {
    // Switch back to black/white
    link.style.color = '#ffffff'; // Text to white
    renderer.setClearColor('#000000'); // Background to black
    
    // Change dots back to random colors
    if (dotCloud) {
      dotCloud.children.forEach((dot) => {
        const colorIndex = Math.floor(Math.random() * colors.length);
        dot.material.color.set(colors[colorIndex]);
      });
    }
    
    // Reset Scream texture color if available
    if (screamOptions && screamOptions.color) {
      const defaultColor = new THREE.Color(0.6, 0.2, 0.8); // Purple-ish
      screamOptions.color.value.copy(defaultColor);
    }
  }
  
  return !toggle; // Return the new toggle state
}


// Color utilities module

export function setupColors(renderer, dotCloud, screamOptions) {
  console.log("Setting up fixed colors - black background with colored dots");
  const link = document.querySelector('#container a');
  
  // Set fixed colors
  link.style.color = '#ffffff'; // Text to white
  renderer.setClearColor('#000000'); // Background to black
  
  // Apply colorful dots
  if (dotCloud) {
    const colors = [
      '#8B5CF6', // Vivid Purple
      '#D946EF', // Magenta Pink
      '#F97316', // Bright Orange
      '#0EA5E9', // Ocean Blue
      '#ea384c', // Red
      '#FEF7CD'  // Soft Yellow
    ];
    
    dotCloud.children.forEach((dot) => {
      const colorIndex = Math.floor(Math.random() * colors.length);
      dot.material.color.set(colors[colorIndex]);
    });
  }
  
  // Set fixed Scream texture color if available
  if (screamOptions && screamOptions.color) {
    const defaultColor = new THREE.Color(0.6, 0.2, 0.8); // Purple-ish
    screamOptions.color.value.copy(defaultColor);
  }
}

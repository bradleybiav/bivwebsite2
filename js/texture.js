
// Enhanced texture creation module

// Create a green grass texture
export function createTexture(THREE) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  canvas.width = 256;
  canvas.height = 256;
  
  // Draw random green pixels for grass
  for (let i = 0; i < 100000; i++) {
    // Use various shades of green for grass
    ctx.fillStyle = `hsl(${100 + 40 * Math.random()}, 70%, ${30 + 30 * Math.random()}%)`;
    ctx.fillRect(
      Math.floor(Math.random() * 256),
      Math.floor(Math.random() * 256),
      1,
      1
    );
  }
  
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  
  return texture;
}

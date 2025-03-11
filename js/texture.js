
// Enhanced texture creation module

// Create a colorful random texture
export function createTexture(THREE) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  canvas.width = 256;
  canvas.height = 256;
  
  // Draw random colored pixels with improved color palette
  for (let i = 0; i < 100000; i++) {
    // Use a color palette more aligned with the brain's colors
    ctx.fillStyle = `hsl(${260 + 40 * Math.random()}, 70%, ${100 * Math.random()}%)`;
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

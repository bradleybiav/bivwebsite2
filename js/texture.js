
// Texture creation module

// Create a colorful random texture
export function createTexture() {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  canvas.width = 256;
  canvas.height = 256;
  
  // Draw random colored pixels
  for (let i = 0; i < 100000; i++) {
    ctx.fillStyle = `hsl(${30 + 140 * Math.random()}, 70%, ${100 * Math.random()}%)`;
    ctx.fillRect(
      Math.floor(Math.random() * 256), // THREE.Math.randInt is deprecated
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

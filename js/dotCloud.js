
// Dot cloud module

export function createDotCloud() {
  const dotCloud = new THREE.Group();
  
  // Create 1500 dots with size 0.1
  const dotCount = 1500;
  
  for (let i = 0; i < dotCount; i++) {
    const dotGeometry = new THREE.SphereGeometry(0.1, 8, 8);
    
    // Use the color palette
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#00ffff'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    const dotMaterial = new THREE.MeshBasicMaterial({ color: color });
    const dot = new THREE.Mesh(dotGeometry, dotMaterial);
    
    // Position dots in sphere with radius 30
    const radius = 30;
    // Use cube root distribution for volumetric distribution (not just surface)
    const r = radius * Math.cbrt(Math.random()); // Cube root for volumetric distribution
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    
    dot.position.x = r * Math.sin(phi) * Math.cos(theta);
    dot.position.y = r * Math.sin(phi) * Math.sin(theta);
    dot.position.z = r * Math.cos(phi);
    
    dotCloud.add(dot);
  }
  
  return dotCloud;
}

// Update dot cloud colors
export function updateDotCloudColors(dotCloud, colors) {
  if (dotCloud) {
    dotCloud.children.forEach((dot) => {
      const colorIndex = Math.floor(Math.random() * colors.length);
      dot.material.color.set(colors[colorIndex]);
    });
  }
}

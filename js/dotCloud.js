
// Dot cloud module

export function createDotCloud(getRandomColor) {
  const dotCloud = new THREE.Group();
  
  // Create 1500 dots (5x the original 300) with size 0.1
  const dotCount = 1500;
  
  for (let i = 0; i < dotCount; i++) {
    const dotGeometry = new THREE.SphereGeometry(0.1, 8, 8);
    
    // Use the color palette
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#00ffff'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    const dotMaterial = new THREE.MeshBasicMaterial({ color: color });
    const dot = new THREE.Mesh(dotGeometry, dotMaterial);
    
    // Position dots in sphere with radius 15
    const radius = 15;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI;
    
    dot.position.x = radius * Math.sin(phi) * Math.cos(theta);
    dot.position.y = radius * Math.sin(phi) * Math.sin(theta);
    dot.position.z = radius * Math.cos(phi);
    
    dotCloud.add(dot);
  }
  
  return dotCloud;
}

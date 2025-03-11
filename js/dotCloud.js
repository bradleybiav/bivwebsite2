
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
    
    // Position dots THROUGHOUT the sphere volume with radius 30
    // For volume distribution we use r * Math.cbrt(Math.random())
    // This gives proper volume distribution rather than just surface points
    const radius = 30 * Math.cbrt(Math.random()); // Distribute throughout volume
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI;
    
    dot.position.x = radius * Math.sin(phi) * Math.cos(theta);
    dot.position.y = radius * Math.sin(phi) * Math.sin(theta);
    dot.position.z = radius * Math.cos(phi);
    
    dotCloud.add(dot);
  }
  
  return dotCloud;
}

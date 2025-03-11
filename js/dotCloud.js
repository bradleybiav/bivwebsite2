
// Dot cloud module

export function createDotCloud() {
  const dotCloud = new THREE.Group();
  
  // Create 1500 dots with size 0.1
  const dotCount = 1500;
  
  // Use an enhanced color palette
  const colors = [
    '#8B5CF6', // Vivid Purple
    '#D946EF', // Magenta Pink
    '#F97316', // Bright Orange
    '#0EA5E9', // Ocean Blue
    '#ea384c', // Red
    '#FEF7CD'  // Soft Yellow
  ];
  
  for (let i = 0; i < dotCount; i++) {
    const dotGeometry = new THREE.SphereGeometry(0.1, 8, 8);
    
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

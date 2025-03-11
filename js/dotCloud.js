
// Dot cloud module

export function createDotCloud(getRandomColor) {
  const dotCount = 300;
  const dotGroup = new THREE.Group();
  
  for (let i = 0; i < dotCount; i++) {
    const dotGeometry = new THREE.SphereGeometry(0.1, 8, 8);
    const dotMaterial = new THREE.MeshBasicMaterial({ color: getRandomColor() });
    const dot = new THREE.Mesh(dotGeometry, dotMaterial);
    
    // Position dots in a spherical pattern around the brain
    const radius = 15;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI;
    
    dot.position.x = radius * Math.sin(phi) * Math.cos(theta);
    dot.position.y = radius * Math.sin(phi) * Math.sin(theta);
    dot.position.z = radius * Math.cos(phi);
    
    dotGroup.add(dot);
  }
  
  return dotGroup;
}

export function changeDotColors(dotCloud, color, isRandom = false) {
  if (dotCloud) {
    dotCloud.children.forEach((dot) => {
      if (isRandom) {
        dot.material.color.set(getRandomColor());
      } else {
        dot.material.color.set(color);
      }
    });
  }
}

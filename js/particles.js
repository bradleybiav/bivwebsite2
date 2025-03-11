
// Sphere particles module

export function createSphereParticles(scene) {
  const particleCount = 1000; // Reduced count because spheres are more resource-intensive
  const group = new THREE.Group();
  
  // Create small sphere geometry to be reused for all particles
  const sphereGeometry = new THREE.SphereGeometry(0.1, 8, 8);
  
  // Vibrant color options for particles
  const colorChoices = [
    [1.0, 0.3, 0.8], // Pink
    [0.5, 0.3, 1.0], // Purple
    [0.3, 0.7, 1.0], // Blue
    [0.3, 1.0, 0.7], // Teal
    [1.0, 0.8, 0.3], // Yellow
    [1.0, 0.5, 0.2], // Orange
    [0.2, 0.8, 1.0], // Cyan
    [0.8, 0.2, 1.0]  // Magenta
  ];
  
  // Create spheres and position them in space
  for (let i = 0; i < particleCount; i++) {
    // Generate random position with wider spread
    let x = (Math.random() - 0.5) * 40;
    let y = (Math.random() - 0.5) * 40;
    let z = (Math.random() - 0.5) * 40;
    
    // Create a hollow sphere effect by removing particles too close to center
    const distance = Math.sqrt(x * x + y * y + z * z);
    
    if (distance < 5) { // If too close to center
      // Move it farther out
      const factor = 5 / distance;
      x *= factor;
      y *= factor;
      z *= factor;
    }
    
    // Select a random color from our palette
    const color = colorChoices[Math.floor(Math.random() * colorChoices.length)];
    
    // Create material with the chosen color
    const material = new THREE.MeshPhongMaterial({
      color: new THREE.Color(color[0], color[1], color[2]),
      emissive: new THREE.Color(color[0] * 0.2, color[1] * 0.2, color[2] * 0.2),
      specular: 0xffffff,
      shininess: 30,
      transparent: true,
      opacity: 0.8
    });
    
    // Create sphere mesh with geometry and material
    const sphere = new THREE.Mesh(sphereGeometry, material);
    
    // Set position
    sphere.position.set(x, y, z);
    
    // Store original color data for animation
    sphere.userData = {
      originalColor: [...color],
      speed: Math.random() * 0.5 + 0.5, // Random animation speed
      phase: Math.random() * Math.PI * 2 // Random starting phase
    };
    
    // Add to group
    group.add(sphere);
  }
  
  scene.add(group);
  console.log("Sphere particles created");
  
  return group;
}

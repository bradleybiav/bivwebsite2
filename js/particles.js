
// Sphere particles module

export function createSphereParticles(scene) {
  const particleCount = 50; // Reduced to 50 larger spheres
  const group = new THREE.Group();
  
  // Soccer ball texture (white with black spots)
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load('https://threejs.org/examples/textures/soccer.png');
  
  // Parameters for orbital arrangement
  const orbitRadius = 8; // Radius of the orbit
  const sphereSize = 0.3; // Larger spheres
  
  // Create sphere geometry to be reused for all particles
  const sphereGeometry = new THREE.SphereGeometry(sphereSize, 16, 16); // Increased resolution
  
  // Vibrant color options for particles
  const colorChoices = [
    [1.0, 1.0, 1.0], // White
    [0.9, 0.9, 0.9], // Light gray
    [0.8, 0.8, 0.8]  // Silver
  ];
  
  // Create spheres and position them in orbit arrangement
  for (let i = 0; i < particleCount; i++) {
    // Select a random color from our palette
    const color = colorChoices[Math.floor(Math.random() * colorChoices.length)];
    
    // Create material with the chosen color and soccer ball texture
    const material = new THREE.MeshPhongMaterial({
      color: new THREE.Color(color[0], color[1], color[2]),
      map: texture,
      specular: 0xffffff,
      shininess: 30
    });
    
    // Create sphere mesh with geometry and material
    const sphere = new THREE.Mesh(sphereGeometry, material);
    
    // Calculate a random position on a sphere (for initial orbital arrangement)
    const phi = Math.acos(-1 + (2 * i) / particleCount);
    const theta = Math.sqrt(particleCount * Math.PI) * phi;
    
    // Convert spherical to Cartesian coordinates
    const x = orbitRadius * Math.sin(phi) * Math.cos(theta);
    const y = orbitRadius * Math.sin(phi) * Math.sin(theta);
    const z = orbitRadius * Math.cos(phi);
    
    // Set position
    sphere.position.set(x, y, z);
    
    // Store original position and animation parameters for orbital movement
    sphere.userData = {
      orbitRadius: orbitRadius + Math.random() * 2 - 1, // Slightly varied orbit radius
      orbitSpeed: 0.2 + Math.random() * 0.3, // Random orbit speed
      orbitPhase: Math.random() * Math.PI * 2, // Random starting phase
      verticalPhase: Math.random() * Math.PI * 2, // Phase for vertical movement
      verticalSpeed: 0.1 + Math.random() * 0.2 // Speed for vertical oscillation
    };
    
    // Add to group
    group.add(sphere);
  }
  
  scene.add(group);
  console.log("Orbital spheres created");
  
  return group;
}

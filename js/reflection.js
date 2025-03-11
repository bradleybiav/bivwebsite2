
// Reflection effect module inspired by https://boytchev.github.io/etudes/threejs/reflection.html

export function createReflectionEffect(scene) {
  const reflectionGroup = new THREE.Group();
  scene.add(reflectionGroup);
  
  // Create a reflective "floor" surface
  const floorGeometry = new THREE.PlaneGeometry(50, 50);
  const floorMaterial = new THREE.MeshStandardMaterial({
    color: 0x111122,
    metalness: 0.9,
    roughness: 0.1,
    envMapIntensity: 1.0
  });
  
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = -Math.PI / 2; // Rotate to be horizontal
  floor.position.y = -5; // Position below the brain
  reflectionGroup.add(floor);
  
  // Add some reflective spheres around the scene
  const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
  const colors = [0x3366ff, 0x66ccff, 0x22aadd];
  
  for (let i = 0; i < 10; i++) {
    const material = new THREE.MeshStandardMaterial({
      color: colors[i % colors.length],
      metalness: 0.9,
      roughness: 0.1,
      envMapIntensity: 1.0
    });
    
    const sphere = new THREE.Mesh(sphereGeometry, material);
    
    // Position spheres in a distributed pattern
    const angle = (i / 10) * Math.PI * 2;
    const radius = 10 + Math.random() * 5;
    sphere.position.x = Math.cos(angle) * radius;
    sphere.position.z = Math.sin(angle) * radius;
    sphere.position.y = -4 + Math.random() * 4; // Slightly above the floor
    
    // Add random scale
    const scale = 0.2 + Math.random() * 0.8;
    sphere.scale.set(scale, scale, scale);
    
    reflectionGroup.add(sphere);
    
    // Store original position and animation parameters
    sphere.userData = {
      originalPos: sphere.position.clone(),
      speed: 0.5 + Math.random() * 1.5,
      phase: Math.random() * Math.PI * 2
    };
  }
  
  return reflectionGroup;
}

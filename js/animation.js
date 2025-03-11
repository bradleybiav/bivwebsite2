
// Animation module

export function animate(brain, dotCloud, mixer, clock, renderer, scene, camera) {
  requestAnimationFrame(() => animate(brain, dotCloud, mixer, clock, renderer, scene, camera));
  
  // Update animations if mixer exists
  if (mixer) {
    mixer.update(clock.getDelta());
  }
  
  // Update brain colors and rotation if it exists
  if (brain) {
    brain.rotation.y += 0.003;
    
    // Animate brain colors if it has materials to update
    brain.traverse(function(child) {
      if (child.isMesh) {
        const time = Date.now() * 0.001;
        const r = Math.sin(time * 0.5) * 0.5 + 0.5;
        const g = Math.sin(time * 0.3) * 0.5 + 0.5;
        const b = Math.sin(time * 0.2) * 0.5 + 0.5;
        
        if (child.material) {
          child.material.color.setRGB(r, g, b);
          if (child.material.emissive) {
            child.material.emissive.setRGB(r * 0.2, g * 0.2, b * 0.2);
          }
        }
      }
    });
  }
  
  // Update orbital sphere particles animation
  if (dotCloud) {
    // Slow overall group rotation
    dotCloud.rotation.y += 0.0003;
    
    // Get current time for animations
    const time = Date.now() * 0.001;
    
    // Update each sphere in the orbital path
    dotCloud.children.forEach((sphere) => {
      const { orbitRadius, orbitSpeed, orbitPhase, verticalPhase, verticalSpeed } = sphere.userData;
      
      // Calculate orbital position
      const angle = time * orbitSpeed + orbitPhase;
      const x = Math.cos(angle) * orbitRadius;
      const z = Math.sin(angle) * orbitRadius;
      const y = Math.sin(time * verticalSpeed + verticalPhase) * 2; // Vertical oscillation
      
      // Update sphere position
      sphere.position.set(x, y, z);
      
      // Add a gentle rotation to each sphere
      sphere.rotation.x += 0.01;
      sphere.rotation.y += 0.01;
    });
  }
  
  // Render the scene
  renderer.render(scene, camera);
}

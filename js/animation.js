
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
  
  // Update sphere particles animation
  if (dotCloud) {
    dotCloud.rotation.y += 0.0003;
    dotCloud.rotation.x += 0.0001;
    
    // Animate each sphere in the group
    const time = Date.now() * 0.001;
    
    dotCloud.children.forEach((sphere) => {
      const { originalColor, speed, phase } = sphere.userData;
      
      // Pulse effect: subtle size variation
      const pulseFactor = Math.sin(time * speed + phase) * 0.1 + 1;
      sphere.scale.set(pulseFactor, pulseFactor, pulseFactor);
      
      // Color pulsing effect
      const colorPulse = Math.sin(time * speed + phase) * 0.15 + 1;
      const r = Math.min(1, originalColor[0] * colorPulse);
      const g = Math.min(1, originalColor[1] * colorPulse);
      const b = Math.min(1, originalColor[2] * colorPulse);
      
      if (sphere.material) {
        sphere.material.color.setRGB(r, g, b);
        sphere.material.emissive.setRGB(r * 0.2, g * 0.2, b * 0.2);
      }
    });
  }
  
  // Render the scene
  renderer.render(scene, camera);
}

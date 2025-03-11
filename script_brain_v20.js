// Main script for Brain in a Vat visualization

// Global variables
let scene, camera, renderer, controls;
let brain = null;
let dotCloud = null;
let toggle = true;
let screamOptions = null;

// Color change function
function triggerColorChange() {
  console.log("Color change triggered - toggling background, text, and dot colors.");
  const link = document.querySelector('#container a');
  const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#00ffff'];
  
  if (toggle) {
    // Switch to random colors
    let textColorIndex = Math.floor(Math.random() * colors.length);
    let bgColorIndex;
    do {
      bgColorIndex = Math.floor(Math.random() * colors.length);
    } while (textColorIndex === bgColorIndex);
    
    // Apply new colors
    link.style.color = colors[textColorIndex];
    renderer.setClearColor(colors[bgColorIndex]);
    
    // Update dot colors
    if (dotCloud) {
      dotCloud.children.forEach((dot) => {
        const colorIndex = Math.floor(Math.random() * colors.length);
        dot.material.color.set(colors[colorIndex]);
      });
    }
    
    // Update Scream texture color if available
    if (screamOptions && screamOptions.color) {
      const newColor = new THREE.Color(
        Math.random(), 
        Math.random(), 
        Math.random()
      );
      screamOptions.color.value.copy(newColor);
    }
  } else {
    // Switch back to black/white
    link.style.color = '#ffffff'; // Text to white
    renderer.setClearColor('#000000'); // Background to black
    
    // Change dots back to random colors
    if (dotCloud) {
      dotCloud.children.forEach((dot) => {
        const colorIndex = Math.floor(Math.random() * colors.length);
        dot.material.color.set(colors[colorIndex]);
      });
    }
    
    // Reset Scream texture color if available
    if (screamOptions && screamOptions.color) {
      const defaultColor = new THREE.Color(0.6, 0.2, 0.8); // Purple-ish
      screamOptions.color.value.copy(defaultColor);
    }
  }
  
  // Toggle for next movement
  toggle = !toggle;
}

// Setup scene with Three.js
function setupScene() {
  // Create scene
  scene = new THREE.Scene();
  
  // Create camera
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 30;
  camera.position.y = 0; // Ensure camera is centered on the y-axis
  
  // Create renderer
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor('#000000');
  document.body.appendChild(renderer.domElement);
  
  // Add ambient light
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);
  
  // Add directional light
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(10, 10, 10);
  scene.add(directionalLight);
  
  // Add opposite directional light
  const backLight = new THREE.DirectionalLight(0xffffff, 0.7);
  backLight.position.set(-10, -10, -10);
  scene.add(backLight);
  
  // Setup orbit controls
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.target.set(0, 0, 0); // Ensure controls are centered at origin
  
  return { scene, camera, renderer, controls };
}

// Create dot cloud
function createDotCloud() {
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

// Load brain model with TSL Scream texture
function loadBrainModel() {
  // Set up loader
  const loader = new THREE.GLTFLoader();
  
  // Try to access tsl-textures if it exists
  if (typeof tsl !== 'undefined' && tsl.scream) {
    console.log("TSL Textures is available!");
    
    // Create Scream texture options with uniforms
    try {
      // Create options for Scream texture with uniform values
      screamOptions = {
        scale: 1,
        variety: 1,
        color: { value: new THREE.Color(0.6, 0.2, 0.8) }, // Purple-ish
        background: new THREE.Color(0.2, 0.1, 0.3), // Dark purple
        seed: { value: 0 }
      };
      
      console.log("Scream options created:", screamOptions);
    } catch (e) {
      console.error("Error creating scream options:", e);
    }
  } else {
    console.warn("TSL Textures not available. Will use fallback material.");
  }
  
  // Load the brain model
  loader.load('brainBBBBB.glb', function(gltf) {
    console.log("GLB model loaded successfully!");
    
    // Get the brain mesh from the loaded model
    brain = gltf.scene;
    brain.scale.set(0.5, 0.5, 0.5);
    brain.position.set(0, 0, 0); // Ensure brain is centered at origin
    
    // Apply material to brain
    brain.traverse((child) => {
      if (child.isMesh) {
        try {
          if (typeof tsl !== 'undefined' && tsl.scream) {
            // Create standard material with Scream texture
            console.log("Applying TSL Scream texture to brain");
            
            // Create a standard material
            const material = new THREE.MeshStandardMaterial({
              roughness: 0.4,
              metalness: 0.6
            });
            
            // Apply the Scream texture
            const screamTexture = new tsl.scream(screamOptions);
            screamTexture.setMaterial(material);
            
            child.material = material;
          } else {
            // Fallback to a colorful material if TSL is not available
            console.log("Using fallback material for brain");
            child.material = new THREE.MeshStandardMaterial({
              color: new THREE.Color(0.8, 0.2, 0.6),
              roughness: 0.4,
              metalness: 0.6
            });
          }
          
          child.castShadow = true;
          child.receiveShadow = true;
        } catch (e) {
          console.error("Error applying material to brain:", e);
          
          // Use a fallback material if there's an error
          child.material = new THREE.MeshStandardMaterial({
            color: new THREE.Color(0.8, 0.2, 0.6),
            roughness: 0.4,
            metalness: 0.6
          });
        }
      }
    });
    
    // Add the brain to the scene
    scene.add(brain);
  }, undefined, function(error) {
    console.error('An error happened while loading the GLB model:', error);
  });
}

// Setup interaction for mouse movement and device orientation
function setupInteraction() {
  // Interaction based on mouse movement - MODIFIED for small dot cloud movement only
  document.addEventListener('mousemove', function(event) {
    const moveX = (event.clientX - window.innerWidth / 2) * 0.02;
    const moveY = (event.clientY - window.innerHeight / 2) * 0.02;
    
    // Keep brain unaffected by mouse movement
    // Note: Brain rotation will be handled in the animate function
    
    if (dotCloud) {
      // Reduce movement factor significantly for subtle effect
      dotCloud.rotation.y = -moveX * 0.005; // Reduced from 0.02 to 0.005
      dotCloud.rotation.x = -moveY * 0.005; // Reduced from 0.02 to 0.005
    }
  });
  
  // Interaction based on device orientation (for mobile devices) - MODIFIED for small dot cloud movement only
  window.addEventListener('deviceorientation', function(event) {
    if (event.beta && event.gamma) {
      const moveX = event.gamma * 0.05; // Left/right tilt
      const moveY = event.beta * 0.05; // Front/back tilt
      
      // Keep brain unaffected by device orientation
      // Note: Brain rotation will be handled in the animate function
      
      if (dotCloud) {
        // Reduce movement factor significantly for subtle effect
        dotCloud.rotation.y = -moveX * 0.005;
        dotCloud.rotation.x = -moveY * 0.005;
      }
    }
  });
  
  // Click or tap to change colors
  document.addEventListener('click', triggerColorChange);
  
  // Change colors every 3 seconds automatically
  setInterval(triggerColorChange, 3000);
}

// Handle window resize
function handleResize() {
  window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

// Update scream texture animation
function updateScreamAnimation() {
  if (screamOptions && screamOptions.seed) {
    // Animate the seed parameter for movement
    screamOptions.seed.value = (performance.now() / 3000) % 100;
  }
}

// Animation loop - MODIFIED for globe-like brain rotation
function animate() {
  requestAnimationFrame(animate);
  
  if (brain) {
    // Create continuous rotation around the Y axis (like a globe)
    brain.rotation.y += 0.005; // Speed up the rotation for more visible globe-like effect
    
    // No rotation on X or Z axes to maintain a globe-like spin
    
    updateScreamAnimation();
  }
  
  if (dotCloud) {
    // No autonomous rotation of dot cloud to keep it suspended in space
  }
  
  controls.update();
  renderer.render(scene, camera);
}

// Initialize and start animation
function init() {
  console.log("Script loaded and executed.");
  const sceneSetup = setupScene();
  scene = sceneSetup.scene;
  camera = sceneSetup.camera;
  renderer = sceneSetup.renderer;
  controls = sceneSetup.controls;
  
  loadBrainModel();
  
  dotCloud = createDotCloud();
  scene.add(dotCloud);
  
  setupInteraction();
  handleResize();
  
  // Trigger initial color change
  triggerColorChange();
  
  // Start animation loop
  animate();
}

// Start the application when the page is loaded
window.addEventListener('DOMContentLoaded', init);


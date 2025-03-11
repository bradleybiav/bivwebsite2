
// Main script for Brain in a Vat visualization

// Global variables
let scene, camera, renderer, controls;
let brain = null;
let dotCloud = null;
let screamOptions = null;

// Initialize and start animation
function init() {
  console.log("Script loaded and executed.");
  
  // Setup scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000); // Black background
  
  // Setup camera
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 0, 5);
  camera.lookAt(scene.position);
  
  // Setup renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  
  // Setup controls
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  
  // Add lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);
  
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(1, 1, 1);
  scene.add(directionalLight);
  
  // Create dot cloud background
  createDotCloud();
  
  // Load the brain model with scream texture
  loadBrainModel();
  
  // Handle window resize
  window.addEventListener('resize', onWindowResize);
  
  // Start animation loop
  animate();
}

function createDotCloud() {
  const particleCount = 1000;
  const particles = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  
  // Generate random positions and colors for particles
  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    
    // Position
    positions[i3] = (Math.random() - 0.5) * 15;
    positions[i3 + 1] = (Math.random() - 0.5) * 15;
    positions[i3 + 2] = (Math.random() - 0.5) * 15;
    
    // Color
    colors[i3] = Math.random();
    colors[i3 + 1] = Math.random();
    colors[i3 + 2] = Math.random();
  }
  
  particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  
  const particleMaterial = new THREE.PointsMaterial({
    size: 0.05,
    vertexColors: true,
    transparent: true,
    opacity: 0.8
  });
  
  dotCloud = new THREE.Points(particles, particleMaterial);
  scene.add(dotCloud);
}

function loadBrainModel() {
  // Setup loader
  const loader = new THREE.GLTFLoader();
  
  // Options for Scream texture 
  // Parameters that will be modified at runtime are defined as uniform
  if (typeof tsl !== 'undefined' && tsl.scream) {
    console.log("TSL Textures is available!");
    
    try {
      screamOptions = {
        scale: 1,
        variety: 1,
        color: { value: new THREE.Color(0.5, 0.5, 0.8) }, // Initial color
        background: new THREE.Color(0.2, 0.1, 0.3), // Dark background
        seed: { value: 0 } // Dynamic seed value for animation
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
    brain.position.set(0, 0, 0);
    
    // Apply material to brain
    brain.traverse((child) => {
      if (child.isMesh) {
        try {
          if (tsl && tsl.scream) {
            console.log("Applying TSL Scream texture to brain");
            
            // Create a material with the Scream texture
            const material = new THREE.MeshStandardMaterial({
              roughness: 0.4,
              metalness: 0.6
            });
            
            const screamTexture = new tsl.scream(screamOptions);
            
            // Apply the texture to the material
            if (screamTexture.setMaterial) {
              screamTexture.setMaterial(material);
            } else {
              console.warn("setMaterial method not available on screamTexture");
              
              // Try alternative method if supported
              if (THREE.MeshStandardNodeMaterial && screamTexture.getNode) {
                child.material = new THREE.MeshStandardNodeMaterial({
                  colorNode: screamTexture
                });
                return;
              }
            }
            
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

function animate() {
  requestAnimationFrame(animate);
  
  // Update controls
  if (controls) controls.update();
  
  // Update brain rotation at a steady rate
  if (brain) {
    brain.rotation.y += 0.003;
  }
  
  // Update dot cloud rotation at a steady rate
  if (dotCloud) {
    dotCloud.rotation.y += 0.001;
  }
  
  // Update the scream animation if options are available
  updateScreamAnimation();
  
  // Render the scene
  renderer.render(scene, camera);
}

function updateScreamAnimation() {
  if (screamOptions && screamOptions.seed && screamOptions.color) {
    // Animate the seed parameter for movement
    const time = performance.now();
    
    // Update seed with a sine wave pattern for flowing animation
    screamOptions.seed.value = 3 * Math.sin(time / 3700);
    
    // Animate colors over time - use a more dramatic color shift as in the example
    screamOptions.color.value.set(
      Math.sin(time / 700),
      Math.sin(time / 800),
      Math.sin(time / 500)
    );
  }
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// Start the application when the page is loaded
window.addEventListener('DOMContentLoaded', init);

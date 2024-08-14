// Create the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.5, 10000);
const renderer = new THREE.WebGLRenderer({ antialias: true }); // Antialiasing for smoother edges
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add OrbitControls
const controls = new THREE.OrbitControls(camera, renderer.domElement);

// Load JSON geometry
const loader = new THREE.ObjectLoader();
loader.load('assets/geometry.json', function (object) {
    scene.add(object);
    animate(); // Start the animation loop once the model is loaded

    // Ensure objects receive shadows
    object.traverse(function (child) {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });

    // Store the object for rotation
    window.model = object;
}, undefined, function (error) {
    console.error('An error occurred loading the model:', error);
});

// Set initial camera position and target
camera.position.set(0, 1000, 2000);
controls.target.set(0, 20, 600);
controls.update(); // Update controls after setting the target

scene.background = new THREE.Color('#FFFFFF'); // Light grey background

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Rotate the model slowly
    if (window.model) {
        window.model.rotation.y += 0.01; // Adjust the speed as needed
    }

    controls.update(); // Update controls every frame
    renderer.render(scene, camera);
}

// Resize the renderer when the window is resized
window.addEventListener('resize', function () {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // White light with half intensity
scene.add(ambientLight);

renderer.shadowMap.enabled = true;
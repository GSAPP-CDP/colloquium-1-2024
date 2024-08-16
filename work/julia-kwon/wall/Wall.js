let model; // Define a variable to hold the loaded model

// Set up the scene, camera, and renderer
const scene = new THREE.Scene();
scene.background = new THREE.Color("white"); // Replace with your desired color
const camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('model-container').appendChild(renderer.domElement);

// Load the .glb file
const loader = new THREE.GLTFLoader();
loader.load('Growth_Within_Blocks_0812044715.glb', function(gltf) {
    model = gltf.scene;
    scene.add(model);
    model.position.set(0, 0, 0);
    model.scale.set(1, 1, 1);
    animate();
}, undefined, function(error) {
    console.error(error);
});

// Set up lighting
// const light = new THREE.DirectionalLight(0xffffff, 1);
const light2 = new THREE.HemisphereLight(0xffffbb, 0xffffff, 1.5);
// light.position.set(10, 10, 10).normalize();
// scene.add(light);
scene.add(light2);

// Set the camera position
camera.position.z = 5;

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Check if the model is loaded before trying to animate it
    if (model) {
        let isDragging = false;
        let previousMousePosition = {
            x: 0,
            y: 0
        };

        document.addEventListener('mousedown', (event) => {
            isDragging = true;
        });

        document.addEventListener('mousemove', (event) => {
            if (isDragging) {
                const deltaMove = {
                    x: event.clientX - previousMousePosition.x,
                    y: event.clientY - previousMousePosition.y
                };

                model.rotation.y += deltaMove.x * 0.0001;  // Adjust rotation speed as needed
                model.rotation.x += deltaMove.y * 0.0001;  // Adjust rotation speed as needed
            }

            previousMousePosition = {
                x: event.clientX,
                y: event.clientY
            };
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });
    }

    renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});

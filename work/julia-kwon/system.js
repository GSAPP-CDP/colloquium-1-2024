    // Toggle grid background visibility
    const gridBackground = document.querySelector('.grid-background');
    const triggerImage = document.getElementById('trigger-image');

    if (triggerImage) {
        triggerImage.addEventListener('click', function () {
            if (gridBackground) {
                gridBackground.classList.toggle('hidden');
            }
        });
    }
    
// Make the draggable box draggable
makeDraggable(document.getElementById('draggableBox'));

// Smooth scrolling for links
document.querySelectorAll('.scroll-link').forEach(link => {
    link.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Function to make an element draggable
function makeDraggable(draggableElement) {
    let mouseX, mouseY, boxLeft, boxTop;

    draggableElement.addEventListener('mousedown', function(e) {

        mouseX = e.clientX;
        mouseY = e.clientY;
        boxLeft = draggableElement.offsetLeft;
        boxTop = draggableElement.offsetTop;

        function onMouseMove(e) {
            const deltaX = e.clientX - mouseX;
            const deltaY = e.clientY - mouseY;
            draggableElement.style.left = boxLeft + deltaX + 'px';
            draggableElement.style.top = boxTop + deltaY + 'px';
        }

        function onMouseUp() {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        }

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });

    draggableElement.ondragstart = function() {
        return false;
    };
}

// Smooth horizontal scrolling on wheel
document.addEventListener('wheel', (event) => {
    if (event.deltaY !== 0) {
        window.scrollBy({
            left: event.deltaY * 2,
            behavior: 'smooth'
        });
    }
});

    let model; // Define a variable to hold the loaded model

    // Set up the scene, camera, and renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
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
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(10, 10, 10).normalize();
    scene.add(light);

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

    


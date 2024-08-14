import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

let scene, camera, renderer, controls;
let audioLoader, listener, textureLoader;
let soundBarsMap = new Map();
let soundScene, soundCamera, soundRenderer, soundControls;
let buttons = [];

function init() {
    const container = document.getElementById('threeContainer');
    const soundContainer = document.getElementById('soundContainer');

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(10, window.innerWidth / window.innerHeight, 0.1, 500);
    camera.position.set(45, 15, 45);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth / 2, window.innerHeight);
    container.appendChild(renderer.domElement);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // Sound visualization scene
    soundScene = new THREE.Scene();
    soundCamera = new THREE.PerspectiveCamera(10, window.innerWidth / window.innerHeight, 0.1, 500);
    soundCamera.position.set(45,20,45);

    soundRenderer = new THREE.WebGLRenderer();
    soundRenderer.setSize(window.innerWidth / 2, window.innerHeight);
    soundContainer.appendChild(soundRenderer.domElement);

    soundControls = new OrbitControls(soundCamera, soundRenderer.domElement);
    soundControls.enableDamping = true;

    // Audio setup
    listener = new THREE.AudioListener();
    camera.add(listener);
    audioLoader = new THREE.AudioLoader();
    textureLoader = new THREE.TextureLoader();

    // Add lights
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(50, 50, 50).normalize();
    scene.add(directionalLight);

    const soundAmbientLight = new THREE.AmbientLight(0x404040);
    soundScene.add(soundAmbientLight);
    const soundDirectionalLight = new THREE.DirectionalLight(0xffffff, 1);
    soundDirectionalLight.position.set(50, 50, 50).normalize();
    soundScene.add(soundDirectionalLight);

    // Create the dynamic grid
    createDynamicGrid();

    window.addEventListener('resize', onWindowResize, false);

    animate();
}

function createDynamicGrid() {
    const audioFiles = [
        'noisy street.mp3', 'tuk tuk.mp3', 'market restaurant.mp3',
        'indoor market.mp3', 'chanbuying.mp3', 'bkk musical instrument stall.mp3',
        'fruit seller.mp3', 'lumphini selected.mp3', 'seafood.mp3'
    ];

    const imageFiles = [
        'asset/picture/noise.webp', 'asset/picture/6.jpg', 'asset/picture/market.jpeg',
        'asset/picture/market.jpeg', 'asset/picture/9.jpeg', 'asset/picture/images.jpeg',
        'asset/picture/8.jpeg', 'asset/picture/temple.jpg', 'asset/picture/seafood.jpeg',
    ];

    const texts = [
        'Street', 'Tuk Tuk', 'Restaurant',
        'Market', 'Selling', 'Music',
        'Fruit Seller', 'Temple', 'Seafood Market'
    ];

    const gridSize = 3;
    const spacing = 5; // Increase spacing to avoid overlap
    const boxSize = 1; // Width and depth of the boxes

    for (let i = 0; i < audioFiles.length; i++) {
        const row = Math.floor(i / gridSize);
        const col = i % gridSize;

        const texture = textureLoader.load(imageFiles[i]);
        const material = new THREE.MeshPhongMaterial({ map: texture });

        const group = new THREE.Group(); // Create a group for each sound
        group.position.set(col * spacing - (gridSize * spacing) / 2, 0, row * spacing - (gridSize * spacing) / 2);
        scene.add(group);

        audioLoader.load(audioFiles[i], async function(buffer) {
            const sound = new THREE.PositionalAudio(listener);
            sound.setBuffer(buffer);
            sound.setRefDistance(20);
            group.add(sound);

            // Analyze initial audio data and create bars
            const initialHeights = await analyzeInitialAudio(buffer, 9);
            createBarsForSound(group, sound, material, initialHeights);

            // Add text above the sound bars
            createTextForSound(group, texts[i]);

            // Add event listener to hide text and image when sound stops
            sound.onEnded = () => {
                const textMesh = group.userData.textMesh;
                const overlayImage = group.userData.overlayImage;
                if (textMesh) textMesh.visible = false;
                if (overlayImage) overlayImage.style.display = 'none';
            };
        });

        // Add image to the row
        addImageToRow(group, imageFiles[i]);

        createButton(group, texts[i]);
    }
}

async function analyzeInitialAudio(buffer, numBars) {
    const offlineContext = new OfflineAudioContext(1, buffer.length, buffer.sampleRate);
    const source = offlineContext.createBufferSource();
    source.buffer = buffer;

    const analyser = offlineContext.createAnalyser();
    analyser.fftSize = 256;
    source.connect(analyser);
    analyser.connect(offlineContext.destination);
    source.start(5);

    await offlineContext.startRendering();

    const frequencyData = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(frequencyData);

    const step = Math.floor(frequencyData.length / numBars);
    const heights = [];
    for (let i = 0; i < numBars; i++) {
        heights.push(frequencyData[i * step] / 256);
    }
    return heights;
}
// function createBarsForSound(group, sound, material, initialHeights) {
//     const analyser = new THREE.AudioAnalyser(sound, 256);
//     const barsGroup = new THREE.Group();
//     const bars = [];
//     const boxSize = 1;
//     const numBars = 9; // Number of bars to display for each sound
//     const gridSize = 3; // 3x3 grid
//     const spacing = 1; // Adjusted spacing to keep bars close together

//     const offset = ((gridSize - 1) * spacing) / 2; // Calculate the offset to center the bars

//     // Define the glow material once
//     const glowShader = {
//         vertexShader: `
//             varying vec3 vNormal;
//             void main() {
//                 vNormal = normalize(normalMatrix * normal);
//                 gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
//             }
//         `,
//         fragmentShader: `
//             uniform float glowIntensity;
//             uniform vec3 glowColor;
//             varying vec3 vNormal;

//             void main() {
//                 float intensity = pow(1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0)), glowIntensity);
//                 gl_FragColor = vec4(glowColor, 1.0) * intensity;
//             }
//         `,
//         uniforms: {
//             glowIntensity: { value: 1.5 }, // Intensity of the glow
//             glowColor: { value: new THREE.Color(0xffffff) } // Glow color: white
//         },
//         side: THREE.BackSide, // Render the shader on the outside of the box
//         blending: THREE.AdditiveBlending, // Use blending for the glow effect
//         transparent: true
//     };

//     const glowMaterial = new THREE.ShaderMaterial(glowShader);

//     for (let j = 0; j < numBars; j++) {
//         // Create the black box material
//         const boxMaterial = new THREE.MeshPhongMaterial({
//             color: 0x000000, // Black color
//         });

//         const geometry = new THREE.BoxGeometry(boxSize, 1, boxSize);
//         const mesh = new THREE.Mesh(geometry, boxMaterial);
//         const row = Math.floor(j / gridSize);
//         const col = j % gridSize;
//         mesh.position.set(col * spacing - offset, 0, row * spacing - offset); // Arrange in a 3x3 grid centered at (0,0,0)
//         mesh.scale.y = initialHeights[j] / 2; // Set initial height
//         mesh.position.y = initialHeights[j] / 4; // Adjust position to match height
//         mesh.userData = { sound: sound, analyser: analyser, index: j, initialHeight: initialHeights[j] };
//         barsGroup.add(mesh);
//         bars.push(mesh);

//         // Add white edges to the box
//         const edges = new THREE.EdgesGeometry(geometry);
//         const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff }); // White color for edges
//         const line = new THREE.LineSegments(edges, lineMaterial);
//         mesh.add(line);

//         // Add glow effect to the edges
//         const glowMesh = new THREE.Mesh(geometry, glowMaterial.clone());
//         glowMesh.scale.multiplyScalar(1.1); // Scale the glow mesh to make the glow visible
//         mesh.add(glowMesh);
//     }

//     // Create additional bars group in the soundScene
//     const additionalBarsGroup = new THREE.Group();
//     const additionalBars = [];
//     for (let j = 0; j < numBars; j++) {
//         const geometry = new THREE.BoxGeometry(boxSize, 1, boxSize);
//         const solidColorMaterial = new THREE.MeshPhongMaterial({ color: 0x0000ff }); // Set bar color to blue
//         const mesh = new THREE.Mesh(geometry, solidColorMaterial);
//         const row = Math.floor(j / gridSize);
//         const col = j % gridSize;
//         mesh.position.set(col * spacing - offset, 0, row * spacing - offset); // Arrange in a 3x3 grid centered at (0,0,0)
//         mesh.userData = { sound: sound, analyser: analyser, index: j, initialHeight: initialHeights[j] };
//         additionalBarsGroup.add(mesh);
//         additionalBars.push(mesh);

//         // Add white edges to the additional bars
//         const edges = new THREE.EdgesGeometry(geometry);
//         const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff }); // White color for edges
//         const line = new THREE.LineSegments(edges, lineMaterial);
//         mesh.add(line);

//         // Add glow effect to the additional bars
//         const glowMesh = new THREE.Mesh(geometry, glowMaterial.clone());
//         glowMesh.scale.multiplyScalar(1.1); // Scale the glow mesh to make the glow visible
//         mesh.add(glowMesh);
//     }

//     group.add(barsGroup);
//     soundScene.add(additionalBarsGroup);

//     // Adjust the position of additionalBarsGroup in a grid layout
//     const gridPosition = calculateGridPosition(soundBarsMap.size, 3, 3); // Assuming a grid size of 3x3 and spacing of 7
//     additionalBarsGroup.position.set(gridPosition.x, gridPosition.y, gridPosition.z);

//     soundBarsMap.set(sound, { bars: bars, additionalBars: additionalBars, analyser: analyser, barsGroup: barsGroup, additionalBarsGroup: additionalBarsGroup });

//     // Update bars initially to reflect default height
//     updateBars(analyser, bars, additionalBars);
// }

function createBarsForSound(group, sound, material, initialHeights) {
    const analyser = new THREE.AudioAnalyser(sound, 256);
    const barsGroup = new THREE.Group();
    const bars = [];
    const boxSize = 1;
    const numBars = 9; // Number of bars to display for each sound
    const gridSize = 3; // 3x3 grid
    const spacing = 1; // Adjusted spacing to keep bars close together

    const offset = ((gridSize - 1) * spacing) / 2; // Calculate the offset to center the bars

    // Define the glow material once
    const glowShader = {
        vertexShader: `
            varying vec3 vNormal;
            void main() {
                vNormal = normalize(normalMatrix * normal);
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform float glowIntensity;
            uniform vec3 glowColor;
            varying vec3 vNormal;

            void main() {
                float intensity = pow(1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0)), glowIntensity);
                gl_FragColor = vec4(glowColor, 1.0) * intensity;
            }
        `,
        uniforms: {
            glowIntensity: { value: 1.5 }, // Intensity of the glow
            glowColor: { value: new THREE.Color(0xffffff) } // Glow color: white
        },
        side: THREE.BackSide, // Render the shader on the outside of the box
        blending: THREE.AdditiveBlending, // Use blending for the glow effect
        transparent: true
    };

    const glowMaterial = new THREE.ShaderMaterial(glowShader);

    for (let j = 0; j < numBars; j++) {
        // Create the black box material
        const boxMaterial = new THREE.MeshPhongMaterial({
            color: 0x000000, // Black color for the main bars
        });

        const geometry = new THREE.BoxGeometry(boxSize, 1, boxSize);
        const mesh = new THREE.Mesh(geometry, boxMaterial);
        const row = Math.floor(j / gridSize);
        const col = j % gridSize;
        mesh.position.set(col * spacing - offset, 0, row * spacing - offset); // Arrange in a 3x3 grid centered at (0,0,0)
        mesh.scale.y = initialHeights[j] / 2; // Set initial height
        mesh.position.y = initialHeights[j] / 4; // Adjust position to match height
        mesh.userData = { sound: sound, analyser: analyser, index: j, initialHeight: initialHeights[j] };
        barsGroup.add(mesh);
        bars.push(mesh);

        // Add white edges to the box
        const edges = new THREE.EdgesGeometry(geometry);
        const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff }); // White color for edges
        const line = new THREE.LineSegments(edges, lineMaterial);
        mesh.add(line);

        // Add glow effect to the edges
        const glowMesh = new THREE.Mesh(geometry, glowMaterial.clone());
        glowMesh.scale.multiplyScalar(1.1); // Scale the glow mesh to make the glow visible
        mesh.add(glowMesh);
    }

    // Create additional bars group in the soundScene
    const additionalBarsGroup = new THREE.Group();
    const additionalBars = [];
    for (let j = 0; j < numBars; j++) {
        const geometry = new THREE.BoxGeometry(boxSize, 1, boxSize);
        const solidColorMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 }); // Set additional bars to black
        const mesh = new THREE.Mesh(geometry, solidColorMaterial);
        const row = Math.floor(j / gridSize);
        const col = j % gridSize;
        mesh.position.set(col * spacing - offset, 0, row * spacing - offset); // Arrange in a 3x3 grid centered at (0,0,0)
        mesh.userData = { sound: sound, analyser: analyser, index: j, initialHeight: initialHeights[j] };
        additionalBarsGroup.add(mesh);
        additionalBars.push(mesh);

        // Add white edges to the additional bars
        const edges = new THREE.EdgesGeometry(geometry);
        const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff }); // White color for edges
        const line = new THREE.LineSegments(edges, lineMaterial);
        mesh.add(line);

        // Add glow effect to the additional bars
        const glowMesh = new THREE.Mesh(geometry, glowMaterial.clone());
        glowMesh.scale.multiplyScalar(1.1); // Scale the glow mesh to make the glow visible
        mesh.add(glowMesh);
    }

    group.add(barsGroup);
    soundScene.add(additionalBarsGroup);

    // Adjust the position of additionalBarsGroup in a grid layout
    const gridPosition = calculateGridPosition(soundBarsMap.size, 3, 3); // Assuming a grid size of 3x3 and spacing of 7
    additionalBarsGroup.position.set(gridPosition.x, gridPosition.y, gridPosition.z);

    soundBarsMap.set(sound, { bars: bars, additionalBars: additionalBars, analyser: analyser, barsGroup: barsGroup, additionalBarsGroup: additionalBarsGroup });

    // Update bars initially to reflect default height
    updateBars(analyser, bars, additionalBars);
}

function calculateGridPosition(index, gridSize, spacing) {
    const row = Math.floor(index / gridSize);
    const col = index % gridSize;
    return {
        x: col * spacing,
        y: 0,
        z: row * spacing
    };
}

function createTextForSound(group, text) {
    // Add text instead of image
    const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const loader = new FontLoader();

    loader.load('https://unpkg.com/three@0.152.0/examples/fonts/helvetiker_regular.typeface.json', function (font) { // Ensure the path to your font JSON is correct
        const textGeometry = new TextGeometry(text, {
            font: font,
            size: 0.4,
            height: 0.05,
        });

        const textMesh = new THREE.Mesh(textGeometry, textMaterial);
        textMesh.position.set(0, 2, 0); // Position the text above the sound bars
        textMesh.visible = false; // Initially hidden
        group.add(textMesh);

        // Store the text in the group's userData for later access
        group.userData.textMesh = textMesh;
    });
}

function addImageToRow(group, imageFile) {
    const imageRow = document.getElementById('imageRow');
    const imageElement = document.createElement('img');
    imageElement.src = imageFile;
    imageElement.className = 'overlayImage';
    imageElement.style.display = 'none'; // Initially hidden
    imageRow.appendChild(imageElement);

    // Store the image element in the group's userData for later access
    group.userData.overlayImage = imageElement;
}

// function createButton(group, text) {
//     const button = document.createElement('button');
//     button.textContent = 'Play';
//     button.style.position = 'absolute';
//     button.style.backgroundColor = 'transparent'; // Make the button background transparent
//     button.style.border = 'none'; // Remove border
//     button.style.color = 'rgba(255, 255, 255, 0)'; // Make the text transparent
//     button.style.cursor = 'pointer'; // Optionally, change the cursor to pointer
//     button.onclick = () => {
//         const sound = group.children.find(child => child instanceof THREE.PositionalAudio);
//         const textMesh = group.userData.textMesh;
//         const overlayImage = group.userData.overlayImage;
//         if (sound) {
//             if (sound.isPlaying) {
//                 sound.stop();
//                 if (textMesh) textMesh.visible = false;
//                 if (overlayImage) overlayImage.style.display = 'none';
//             } else {
//                 sound.play();
//                 if (textMesh) textMesh.visible = true;
//                 if (overlayImage) overlayImage.style.display = 'block';
//                 visualizeSound3D(sound, group);
//             }
//         }
//     };
//     document.body.appendChild(button);
//     buttons.push({ group, button });
// }

function createButton(group, text) {
    const button = document.createElement('button');
    button.textContent = 'Play';
    button.style.position = 'absolute';
    button.style.backgroundColor = 'transparent'; // Make the button background transparent
    button.style.border = 'none'; // Remove border
    button.style.color = 'rgba(255, 255, 255, 0)'; // Make the text transparent
    button.style.cursor = 'pointer'; // Optionally, change the cursor to pointer

    let isPlaying = false;

    // Handle hover (mouseenter)
    button.addEventListener('mouseenter', () => {
        const sound = group.children.find(child => child instanceof THREE.PositionalAudio);
        const textMesh = group.userData.textMesh;
        const overlayImage = group.userData.overlayImage;

        if (isPlaying && sound) {
            // If the sound is playing, stop it when hovering again
            sound.stop();
            isPlaying = false;
            if (textMesh) textMesh.visible = false;
            if (overlayImage) overlayImage.style.display = 'none';
        } else if (!isPlaying && sound) {
            // If the sound is not playing, start playing it
            sound.play();
            isPlaying = true;
            if (textMesh) textMesh.visible = true;
            if (overlayImage) overlayImage.style.display = 'block';
            visualizeSound3D(sound, group);
        }
    });

    // Handle click
    button.addEventListener('click', () => {
        const sound = group.children.find(child => child instanceof THREE.PositionalAudio);
        const textMesh = group.userData.textMesh;
        const overlayImage = group.userData.overlayImage;

        if (isPlaying && sound) {
            // Stop the sound if it's playing
            sound.stop();
            isPlaying = false;
            if (textMesh) textMesh.visible = false;
            if (overlayImage) overlayImage.style.display = 'none';
        } else if (!isPlaying && sound) {
            // Play the sound if it's not playing
            sound.play();
            isPlaying = true;
            if (textMesh) textMesh.visible = true;
            if (overlayImage) overlayImage.style.display = 'block';
            visualizeSound3D(sound, group);
        }
    });

    button.addEventListener('mouseleave', () => {
        // No action on mouse leave to keep playing the sound
    });

    document.body.appendChild(button);
    buttons.push({ group, button });
}


function updateButtonPositions() {
    buttons.forEach(({ group, button }) => {
        const vector = new THREE.Vector3();
        const widthHalf = 0.5 * renderer.getContext().canvas.width;
        const heightHalf = 0.5 * renderer.getContext().canvas.height;

        // Calculate the center position of the barsGroup within the group
        const barsGroup = group.children.find(child => child instanceof THREE.Group);
        if (barsGroup) {
            barsGroup.updateMatrixWorld();
            vector.setFromMatrixPosition(barsGroup.matrixWorld);
        } else {
            group.updateMatrixWorld();
            vector.setFromMatrixPosition(group.matrixWorld);
        }

        // Project the 3D position into 2D space
        vector.project(camera);

        // Calculate the screen position
        const x = (vector.x * widthHalf) + widthHalf;
        const y = -(vector.y * heightHalf) + heightHalf;

        // Update button position
        button.style.left = `${x}px`;
        button.style.top = `${y+8900}px`;
    });
}


function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth / 2, window.innerHeight);
    soundRenderer.setSize(window.innerWidth / 2, window.innerHeight);
}

function visualizeSound3D(sound) {
    const { analyser, bars, additionalBars } = soundBarsMap.get(sound);

    function updateBars() {
        const dataArray = analyser.getFrequencyData();
        const step = Math.floor(dataArray.length / 36); // Updated to match the number of bars

        bars.forEach((bar, index) => {
            // bar.material.color.setHSL((0.5 - dataArray[index * step] / 512), 1, 0.5); // Use green-blue hues
        });

        additionalBars.forEach((bar, index) => {
            bar.scale.y = dataArray[index * step] / 256;
            bar.position.y = bar.scale.y / 2;
            // bar.material.color.setHSL((0.5 - dataArray[index * step] / 512), 1, 0.5); // Use green-blue hues
        });

        soundRenderer.render(soundScene, soundCamera);
        if (sound.isPlaying) {
            requestAnimationFrame(updateBars);
        }
    }

    updateBars();
}

function updateBars(analyser, bars, additionalBars) {
    const dataArray = analyser.getFrequencyData();
    const step = Math.floor(dataArray.length / 36); // Updated to match the number of bars

    bars.forEach((bar, index) => {
        // bar.material.color.setHSL((0.5 - dataArray[index * step] / 512), 1, 0.5); // Use green-blue hues
    });

    additionalBars.forEach((bar, index) => {
        bar.scale.y = dataArray[index * step] / 256;
        bar.position.y = bar.scale.y / 2;
        // bar.material.color.setHSL((0.5 - dataArray[index * step] / 512), 1, 0); // Use green-blue hues
    });

    soundRenderer.render(soundScene, soundCamera);
}

function animate() {
    requestAnimationFrame(animate);

    controls.update();
    soundControls.update();
    renderer.render(scene, camera);
    updateButtonPositions();

    soundBarsMap.forEach(({ analyser, bars, additionalBars }) => {
        updateBars(analyser, bars, additionalBars);
    });
}

init();
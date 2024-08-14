import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let sceneNYC, sceneThai, cameraNYC, cameraThai, rendererNYC, rendererThai, controlsNYC, controlsThai;
let audioLoader, listener, textureLoader;
let soundBarsMap = new Map();

function init() {
    const containerNYC = document.getElementById('nyc');
    const containerThai = document.getElementById('thai');

    if (!containerNYC || !containerThai) {
        console.error('Containers not found');
        return;
    }

    // Initialize the NYC Scene
    sceneNYC = new THREE.Scene();
    cameraNYC = new THREE.PerspectiveCamera(10, containerNYC.clientWidth / containerNYC.clientHeight, 0.1, 500);
    cameraNYC.position.set(30,30,30);
    rendererNYC = new THREE.WebGLRenderer();
    rendererNYC.setSize(containerNYC.clientWidth, containerNYC.clientHeight);
    containerNYC.appendChild(rendererNYC.domElement);
    controlsNYC = new OrbitControls(cameraNYC, rendererNYC.domElement);
    controlsNYC.enableDamping = true;

    // Initialize the Thai Scene
    sceneThai = new THREE.Scene();
    cameraThai = new THREE.PerspectiveCamera(10, containerThai.clientWidth / containerThai.clientHeight, 0.1, 500);
    cameraThai.position.set(30,30,30);
    rendererThai = new THREE.WebGLRenderer();
    rendererThai.setSize(containerThai.clientWidth, containerThai.clientHeight);
    containerThai.appendChild(rendererThai.domElement);
    controlsThai = new OrbitControls(cameraThai, rendererThai.domElement);
    controlsThai.enableDamping = true;

    // Audio setup
    listener = new THREE.AudioListener();
    cameraNYC.add(listener);
    cameraThai.add(listener);
    audioLoader = new THREE.AudioLoader();
    textureLoader = new THREE.TextureLoader();

    // Add lights to both scenes
    addLights(sceneNYC);
    addLights(sceneThai);

    // Set up sounds with visualization
    setupSoundWithVisualization(containerNYC, 'nyc.mp3', sceneNYC, cameraNYC, rendererNYC);
    setupSoundWithVisualization(containerThai, 'Thai voice.mp3', sceneThai, cameraThai, rendererThai);

    window.addEventListener('resize', onWindowResize, false);

    animate();
}

function addLights(scene) {
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(50, 50, 50).normalize();
    scene.add(directionalLight);
}

// function setupSoundWithVisualization(container, audioFile, scene, camera, renderer) {
//     audioLoader.load(audioFile, async function(buffer) {
//         const sound = new THREE.PositionalAudio(listener);
//         sound.setBuffer(buffer);
//         sound.setRefDistance(20);
//         scene.add(sound);

//         // Analyze initial audio data and create bars
//         const initialHeights = await analyzeInitialAudio(buffer, 9);
//         createBarsForSound(scene, sound, initialHeights);

//         // Add hover interaction
//         container.addEventListener('mouseenter', () => {
//             if (!sound.isPlaying) {
//                 sound.play();
//                 visualizeSound3D(sound, renderer, scene, camera);
//             }
//         });

//         container.addEventListener('mouseleave', () => {
//             if (sound.isPlaying) {
//                 sound.stop();
//             }
//             resetBars(sound);
//             renderer.render(scene, camera); // Re-render the scene to update the bars visually
//         });
//     });
// }

function setupSoundWithVisualization(container, audioFile, scene, camera, renderer) {
    audioLoader.load(audioFile, async function(buffer) {
        const sound = new THREE.PositionalAudio(listener);
        sound.setBuffer(buffer);
        sound.setRefDistance(20);
        scene.add(sound);

        // Analyze initial audio data and create bars
        const initialHeights = await analyzeInitialAudio(buffer, 9);
        createBarsForSound(scene, sound, initialHeights);

        // Add hover interaction
        container.addEventListener('mouseenter', () => {
            if (!sound.isPlaying) {
                sound.play();
                visualizeSound3D(sound, renderer, scene, camera);
            }
        });

        container.addEventListener('mouseleave', () => {
            if (sound.isPlaying) {
                sound.stop();
            }
            resetBars(sound); // Reset bars to their initial height after hover
            renderer.render(scene, camera); // Re-render the scene to update the bars visually
        });
    });
}


async function analyzeInitialAudio(buffer, numBars) {
    const offlineContext = new OfflineAudioContext(1, buffer.length, buffer.sampleRate);
    const source = offlineContext.createBufferSource();
    source.buffer = buffer;

    const analyser = offlineContext.createAnalyser();
    analyser.fftSize = 256;
    source.connect(analyser);
    analyser.connect(offlineContext.destination);
    source.start(0);

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

// function createBarsForSound(scene, sound, initialHeights) {
//     const analyser = new THREE.AudioAnalyser(sound, 256);
//     const barsGroup = new THREE.Group();
//     const bars = [];
//     const boxSize = 1;
//     const numBars = 9; // Number of bars to display for each sound
//     const gridSize = 3; // 3x3 grid
//     const spacing = 1; // Adjusted spacing to keep bars close together

//     const offset = ((gridSize - 1) * spacing) / 2; // Calculate the offset to center the bars

//     for (let j = 0; j < numBars; j++) {
//         const geometry = new THREE.BoxGeometry(boxSize, 1, boxSize);
//         const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 }); // Example color
//         const mesh = new THREE.Mesh(geometry, material);
//         const row = Math.floor(j / gridSize);
//         const col = j % gridSize;
//         mesh.position.set(col * spacing - offset, 0, row * spacing - offset); // Arrange in a 3x3 grid centered at (0,0,0)
//         mesh.scale.y = initialHeights[j] / 2; // Set initial height
//         mesh.position.y = initialHeights[j] / 4; // Adjust position to match height
//         mesh.userData = { sound: sound, analyser: analyser, index: j, initialHeight: initialHeights[j] };
//         barsGroup.add(mesh);
//         bars.push(mesh);
//     }

//     scene.add(barsGroup);

//     soundBarsMap.set(sound, { bars: bars, analyser: analyser, barsGroup: barsGroup });

//     // Update bars initially to reflect default height
//     updateBars(analyser, bars);
// }
function createBarsForSound(scene, sound, initialHeights) {
    const analyser = new THREE.AudioAnalyser(sound, 256);
    const barsGroup = new THREE.Group();
    const bars = [];
    const boxSize = 1;
    const numBars = 9; // Number of bars to display for each sound
    const gridSize = 3; // 3x3 grid
    const spacing = 1; // Adjusted spacing to keep bars close together

    const offset = ((gridSize - 1) * spacing) / 2; // Calculate the offset to center the bars

    for (let j = 0; j < numBars; j++) {
        // Create the black box material
        const boxMaterial = new THREE.MeshPhongMaterial({
            color: 0x000000, // Black color
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

        // Create Shader Material for glow effect on the edges
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
        const glowMesh = new THREE.Mesh(geometry, glowMaterial);
        glowMesh.scale.multiplyScalar(1.1); // Scale the glow mesh to make the glow visible
        mesh.add(glowMesh);
    }

    scene.add(barsGroup);

    soundBarsMap.set(sound, { bars: bars, analyser: analyser, barsGroup: barsGroup });

    // Update bars initially to reflect default height
    updateBars(analyser, bars);
}


function visualizeSound3D(sound, renderer, scene, camera) {
    const { analyser, bars } = soundBarsMap.get(sound);

    function updateBars() {
        const dataArray = analyser.getFrequencyData();
        const step = Math.floor(dataArray.length / 36); // Updated to match the number of bars

        bars.forEach((bar, index) => {
            // bar.material.color.setHSL((0.5 - dataArray[index * step] / 512), 1, 0.5); // Use green-blue hues
            bar.scale.y = dataArray[index * step] / 256;
            bar.position.y = bar.scale.y / 2;
        });

        renderer.render(scene, camera);

        if (sound.isPlaying) {
            requestAnimationFrame(updateBars);
        }
    }

    updateBars();
}

// function resetBars(sound) {
//     const { bars } = soundBarsMap.get(sound);
//     bars.forEach((bar) => {
//         // Reset each bar to its initial height and color
//         bar.scale.y = bar.userData.initialHeight / 2;
//         bar.position.y = bar.scale.y / 2;
//         // bar.material.color.setHSL(0.5, 1, 0.5); // Reset to initial color
//     });
// }

function resetBars(sound) {
    const { bars } = soundBarsMap.get(sound);
    const fixedHeight = 1; // Set a fixed height for the bars

    bars.forEach((bar) => {
        // Reset each bar to the fixed height
        bar.scale.y = fixedHeight;
        bar.position.y = bar.scale.y / 2;
    });
}

function updateBars(analyser, bars) {
    const dataArray = analyser.getFrequencyData();
    const step = Math.floor(dataArray.length / 36); // Updated to match the number of bars

    bars.forEach((bar, index) => {
        // bar.material.color.setHSL((0.5 - dataArray[index * step] / 512), 1, 0.5); // Use green-blue hues
    });
}

function onWindowResize() {
    cameraNYC.aspect = rendererNYC.domElement.clientWidth / rendererNYC.domElement.clientHeight;
    cameraNYC.updateProjectionMatrix();
    rendererNYC.setSize(rendererNYC.domElement.clientWidth, rendererNYC.domElement.clientHeight);

    cameraThai.aspect = rendererThai.domElement.clientWidth / rendererThai.domElement.clientHeight;
    cameraThai.updateProjectionMatrix();
    rendererThai.setSize(rendererThai.domElement.clientWidth, rendererThai.domElement.clientHeight);
}

function animate() {
    requestAnimationFrame(animate);

    controlsNYC.update();
    rendererNYC.render(sceneNYC, cameraNYC);

    controlsThai.update();
    rendererThai.render(sceneThai, cameraThai);
}

init();

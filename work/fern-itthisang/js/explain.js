import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';


let scene, camera, renderer, controls;
let audioLoader, listener;
let soundBarsMap = new Map();
let buttons = [];

function init() {
    const container = document.getElementById('explain');

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(15, container.clientWidth / container.clientHeight, 0.1, 500);
    camera.position.set(30, 30, 30);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // Audio setup
    listener = new THREE.AudioListener();
    camera.add(listener);
    audioLoader = new THREE.AudioLoader();

    // Add lights
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(50, 50, 50).normalize();
    scene.add(directionalLight);

    // Add axes and labels
    addAxesHelper();

    // Create the dynamic grid
    createDynamicGrid();

    window.addEventListener('resize', onWindowResize, false);

    animate();
}

// Add axes helper with white color and labels using CanvasTexture
function addAxesHelper() {
    const axesHelper = new THREE.AxesHelper(6);
    axesHelper.material = new THREE.LineBasicMaterial({ color: 0xffffff }); // White axes
    scene.add(axesHelper);

    // Load the font and create text labels for the axes
    const loader = new FontLoader();
    loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function (font) {
        const labels = ['X', 'Y', 'Z'];
        const positions = [
            [6, 0, 0],
            [0, 6, 0],
            [0, 0, 6],
        ];

        labels.forEach((label, index) => {
            const textGeometry = new TextGeometry(label, {
                font: font,
                size: 0.2,
                height: 0.05,
            });
            const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
            const textMesh = new THREE.Mesh(textGeometry, textMaterial);

            textMesh.position.set(...positions[index]);
            scene.add(textMesh);
        });
    });
}

function createDynamicGrid() {
    const audioFiles = [
        'asset/sound/noisy street.mp3', 'asset/sound/tuk tuk.mp3', 'asset/sound/market restaurant.mp3',
        'asset/sound/indoor market.mp3', 'asset/sound/chanbuying.mp3', 'asset/sound/bkk musical instrument stall.mp3',
        'asset/sound/fruit seller.mp3', 'asset/sound/lumphini selected.mp3', 'asset/sound/seafood.mp3'
    ];
    const gridSize = 3;
    const spacing = 3; // Increase spacing to avoid overlap

    for (let i = 0; i < audioFiles.length; i++) {
        const row = Math.floor(i / gridSize);
        const col = i % gridSize;

        const material = new THREE.MeshPhongMaterial({ color: 0x0000ff });

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

            // Add event listener to hide bars when sound stops
            sound.onEnded = () => {
                group.visible = false;
            };
        });

        createButton(group);
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

function createBarsForSound(group, sound, material, initialHeights) {
    // Create an analyser for the sound if not already created
    let analyser = soundBarsMap.get(sound)?.analyser;
    if (!analyser) {
        analyser = new THREE.AudioAnalyser(sound, 256);
        soundBarsMap.set(sound, { analyser, bars: [] });
    }

    const barsGroup = new THREE.Group();
    const bars = [];
    const boxSize = 1;
    const numBars = 9;
    const gridSize = 3;
    const spacing = 1;
    const offset = ((gridSize - 1) * spacing) / 2;

    for (let j = 0; j < numBars; j++) {
        const boxMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 });
        const geometry = new THREE.BoxGeometry(boxSize, 1, boxSize);
        const mesh = new THREE.Mesh(geometry, boxMaterial);
        const row = Math.floor(j / gridSize);
        const col = j % gridSize;
        mesh.position.set(col * spacing - offset, 0, row * spacing - offset);
        mesh.scale.y = initialHeights[j] / 2;
        mesh.position.y = mesh.scale.y / 2;
        barsGroup.add(mesh);
        bars.push(mesh);

        const edges = new THREE.EdgesGeometry(geometry);
        const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
        const line = new THREE.LineSegments(edges, lineMaterial);
        mesh.add(line);

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
                glowIntensity: { value: 0.5 },
                glowColor: { value: new THREE.Color(0xffffff) }
            },
            side: THREE.BackSide,
            blending: THREE.AdditiveBlending,
            transparent: true
        };

        const glowMaterial = new THREE.ShaderMaterial(glowShader);
        const glowMesh = new THREE.Mesh(geometry, glowMaterial);
        glowMesh.scale.multiplyScalar(1.1);
        mesh.add(glowMesh);
    }

    group.add(barsGroup);
    soundBarsMap.get(sound).bars = bars;
    updateBars(analyser, bars);
}

function createButton(group) {
    const button = document.createElement('button');
    button.textContent = 'Play';
    button.style.position = 'absolute';
    button.style.backgroundColor = 'transparent'; // Make the button background transparent
    button.style.border = 'none'; // Remove border
    button.style.color = 'rgba(255, 255, 255, 0)'; // Make the text transparent
    button.style.cursor = 'pointer'; // Optionally, change the cursor to pointer

    button.addEventListener('mouseenter', () => {
        const sound = group.children.find(child => child instanceof THREE.PositionalAudio);
        if (sound && !sound.isPlaying) {
            sound.play();
            visualizeSound3D(sound);
        }
    });

    button.addEventListener('mouseleave', () => {
        const sound = group.children.find(child => child instanceof THREE.PositionalAudio);
        if (sound && sound.isPlaying) {
            sound.stop();
        }
    });

    const container = document.getElementById('explain'); // Get the container div
    container.appendChild(button); // Append the button to the #explain div
    buttons.push({ group, button });
}


function updateButtonPositions() {
    const container = document.getElementById('explain');
    const containerRect = container.getBoundingClientRect();

    buttons.forEach(({ group, button }) => {
        const vector = new THREE.Vector3();
        const widthHalf = 0.5 * container.clientWidth;
        const heightHalf = 0.5 * container.clientHeight;

        const barsGroup = group.children.find(child => child instanceof THREE.Group);
        if (barsGroup) {
            barsGroup.updateMatrixWorld();
            vector.setFromMatrixPosition(barsGroup.matrixWorld);
        } else {
            group.updateMatrixWorld();
            vector.setFromMatrixPosition(group.matrixWorld);
        }

        vector.project(camera);

        const x = (vector.x * widthHalf) + widthHalf;
        const y = -(vector.y * heightHalf) + heightHalf;

        // Position the button relative to the container
        button.style.left = `${x-10}px`;
        button.style.top = `${y}px`;
    });
}




function onWindowResize() {
    const container = document.getElementById('explain');
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
}


function visualizeSound3D(sound) {
    const soundData = soundBarsMap.get(sound);
    if (!soundData) {
        console.error('Sound data not found for the given sound.');
        return;
    }

    const { analyser, bars } = soundData;

    function updateBars() {
        const dataArray = analyser.getFrequencyData();
        const step = Math.floor(dataArray.length / 36);

        bars.forEach((bar, index) => {
            // bar.material.color.setHSL((0.5 - dataArray[index * step] / 512), 1, 0.5);
        });

        renderer.render(scene, camera);
        if (sound.isPlaying) {
            requestAnimationFrame(updateBars);
        }
    }

    updateBars();
}

function updateBars(analyser, bars) {
    const dataArray = analyser.getFrequencyData();
    const step = Math.floor(dataArray.length / 36);

    bars.forEach((bar, index) => {
        // bar.material.color.setHSL((0.5 - dataArray[index * step] / 512), 1, 0.5);
    });

    renderer.render(scene, camera);
}

function animate() {
    requestAnimationFrame(animate);

    controls.update();
    renderer.render(scene, camera);
    updateButtonPositions();

    soundBarsMap.forEach(({ analyser, bars }) => {
        updateBars(analyser, bars);
    });
}

init();
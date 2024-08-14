import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let scene, camera, renderer, controls;
let audioLoader, listener;
let soundBarsMap = new Map();
let progressBar, progressContainer, progressText;

function init() {
    const container = document.getElementById('backgroundContainer');

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(10, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(45, 15, 45);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
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
    directionalLight.position.set(0, 50, 50).normalize();
    scene.add(directionalLight);

    // Create the dynamic grid and play all sounds together
    createDynamicGrid();

    // Add progress bar for the 10-second delay
    createProgressBar();

    window.addEventListener('resize', onWindowResize, false);

    // Prevent scrolling during progress
    preventScroll();

    // Start the animation and progress immediately
    startProgress();

    animate();
}

function createDynamicGrid() {
    const audioFiles = [
        'noisy street.mp3', 'tuk tuk.mp3', 'market restaurant.mp3',
        'indoor market.mp3', 'chanbuying.mp3', 'bkk musical instrument stall.mp3',
        'fruit seller.mp3', 'lumphini selected.mp3', 'seafood.mp3'
    ];

    const gridSize = 3;
    const spacing = 1; 
    const boxSize = 1; 

    for (let i = 0; i < audioFiles.length; i++) {
        const row = Math.floor(i / gridSize);
        const col = i % gridSize;

        const material = new THREE.MeshPhongMaterial({ color: 0x0000ff });

        const group = new THREE.Group(); 
        group.position.set(col * spacing - (gridSize * spacing) / 2, 0, row * spacing - (gridSize * spacing) / 2);
        scene.add(group);

        audioLoader.load(audioFiles[i], async function(buffer) {
            const sound = new THREE.PositionalAudio(listener);
            sound.setBuffer(buffer);
            sound.setLoop(true); 
            sound.setRefDistance(20);
            group.add(sound);

            soundBarsMap.set(sound, { sound, analyser: new THREE.AudioAnalyser(sound, 256), additionalBars: [] });

            const initialHeights = await analyzeInitialAudio(buffer, 9);
            createBarsForSound(group, sound, material, initialHeights);

            sound.play(); // Start playing sound immediately
        });
    }
}

function createProgressBar() {
    // Create and style the progress bar container
    progressContainer = document.createElement('div');
    progressContainer.style.position = 'absolute';
    progressContainer.style.bottom = '20px';
    progressContainer.style.left = '50%';
    progressContainer.style.transform = 'translateX(-50%)';
    progressContainer.style.width = '80%';
    progressContainer.style.height = '10px';
    progressContainer.style.borderRadius = '5px';
    progressContainer.style.borderColor = '#ffffff';
    progressContainer.style.overflow = 'hidden';
    progressContainer.style.zIndex = '1000';
    progressContainer.style.backgroundColor = 'transparent'; // Hide background
    
    progressBar = document.createElement('div');
    progressBar.style.width = '0%';
    progressBar.style.height = '100%';
    progressBar.style.backgroundColor = '#ffffff'; // Change progress bar color to white
    progressBar.style.borderRadius = '5px';
    progressBar.style.position = 'relative';
    
    // Create the progress text
    progressText = document.createElement('span');
    progressText.style.position = 'absolute';
    progressText.style.width = '100%';
    progressText.style.textAlign = 'center';
    progressText.style.color = '#ffffff'; // Change text color to white
    progressText.style.fontWeight = 'bold';
    progressText.style.left = '0';
    progressText.style.top = '50%';
    progressText.style.transform = 'translateY(-50%)';
    
    progressBar.appendChild(progressText); // Append progressText to progressBar
    progressContainer.appendChild(progressBar);
    document.body.appendChild(progressContainer);
}

function startProgress() {
    const duration = 5000; // 10 seconds
    const interval = 50; // Update every 50 ms for smoother progress
    let elapsed = 0;

    const progressInterval = setInterval(() => {
        elapsed += interval;
        const progress = (elapsed / duration) * 100;
        progressBar.style.width = `${progress}%`;
        progressText.textContent = `${Math.round(progress)}%`;

        if (elapsed >= duration) {
            clearInterval(progressInterval);
            pauseAllSounds(); // Pause all sounds when progress reaches 100%
            
            // Introduce a slight delay to ensure sounds have paused
            setTimeout(() => {
                navigateToStory(); // Navigate after sounds are paused
            }, 500); // 0.5-second delay before playing video
        }
    }, interval);
}

function pauseAllSounds() {
    soundBarsMap.forEach(({ sound }) => {
        sound.pause(); // Make sure this pauses all sounds in the map
        sound.isPlaying = false; // Ensure the sound's state is updated
    });
}

function navigateToStory() {
    const backgroundContainer = document.getElementById('backgroundContainer');
    const story = document.getElementById('story1');

    if (backgroundContainer) {
        backgroundContainer.style.display = 'none';
    } else {
        console.error('Element #backgroundContainer not found');
    }

    if (story) {
        story.style.display = 'block';
    } else {
        console.error('Element #story not found');
    }

    // Remove progress bar after navigation
    if (progressContainer) {
        document.body.removeChild(progressContainer);
    }

    // Re-enable scrolling
    allowScroll();
}

function preventScroll() {
    document.body.style.overflow = 'hidden';
}

function allowScroll() {
    document.body.style.overflow = '';
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
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
        const height = frequencyData[i * step] / 256;
        if (Number.isFinite(height)) {
            heights.push(height);
        } else {
            console.warn('Invalid height value:', height);
            heights.push(0); // Default to 0 or another safe value
        }
    }
    return heights;
}

function createBarsForSound(group, sound, material, initialHeights) {
    const analyser = soundBarsMap.get(sound).analyser;
    const additionalBarsGroup = new THREE.Group();
    const additionalBars = [];
    const boxSize = 1;
    const numBars = 9;
    const gridSize = 3;
    const spacing = 3;

    const offset = ((gridSize - 1) * spacing) / 2;

    for (let j = 0; j < numBars; j++) {
        // Create the black box
        const boxMaterial = new THREE.MeshPhongMaterial({
            color: 0x000000, // Color of the box: black
        });

        const geometry = new THREE.BoxGeometry(boxSize, 1, boxSize);
        const mesh = new THREE.Mesh(geometry, boxMaterial);
        const row = Math.floor(j / gridSize);
        const col = j % gridSize;
        mesh.position.set(col * spacing - offset, 0, row * spacing - offset);
        mesh.scale.y = initialHeights[j] / 2;
        mesh.position.y = mesh.scale.y / 2;
        mesh.userData = { sound: sound, analyser: analyser, index: j };
        additionalBarsGroup.add(mesh);
        additionalBars.push(mesh);

        // Create the white edges of the box
        const edges = new THREE.EdgesGeometry(geometry);
        const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
        const line = new THREE.LineSegments(edges, lineMaterial);
        mesh.add(line);  // Add white edges to the box

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
                glowIntensity: { value: 0.5 }, // Glow intensity
                glowColor: { value: new THREE.Color(0xffffff) } // Glow color: white
            },
            side: THREE.BackSide, // Draw the shader on the outside of the box
            blending: THREE.AdditiveBlending, // Use blending to enhance glow effect
            transparent: true
        };

        const glowMaterial = new THREE.ShaderMaterial(glowShader);
        const glowMesh = new THREE.Mesh(geometry, glowMaterial);
        glowMesh.scale.multiplyScalar(1.1); // Expand the edges for better glow visibility
        mesh.add(glowMesh);
    }

    group.add(additionalBarsGroup);

    soundBarsMap.get(sound).additionalBars = additionalBars;

    updateBars(analyser, additionalBars);
}

function initObserver(container) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                playAllSounds(); // Play all sounds when the container is in view
            } else {
                pauseAllSounds(); // Pause all sounds when the container is out of view
            }
        });
    }, {
        threshold: 0.5 // Adjust the threshold as needed
    });

    observer.observe(container);
}

function playAllSounds() {
    soundBarsMap.forEach(({ sound }) => {
        if (!sound.isPlaying) {
            sound.play();
            sound.isPlaying = true; // Track playing state
        }
    });
}

function updateBars(analyser, additionalBars) {
    const dataArray = analyser.getFrequencyData();
    const step = Math.floor(dataArray.length / 36);

    additionalBars.forEach((bar, index) => {
        const scaleY = dataArray[index * step] / 256;
        
        if (Number.isFinite(scaleY)) {
            bar.scale.y = scaleY;
            bar.position.y = bar.scale.y / 2;
        } else {
            console.warn('Invalid scaleY value:', scaleY);
        }
    });

    renderer.render(scene, camera);
}

function animate() {
    requestAnimationFrame(animate);

    controls.update();
    renderer.render(scene, camera);

    soundBarsMap.forEach(({ analyser, additionalBars }) => {
        updateBars(analyser, additionalBars);
    });
}

init();
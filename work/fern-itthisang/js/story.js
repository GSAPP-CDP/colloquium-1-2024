import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let scene, camera, renderer, controls;
let audioLoader, listener;
let soundBarsMap = new Map();
let isPlaying = false;

function init() {
    const container = document.getElementById('soundbackground');

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

    // Create the dynamic grid
    createDynamicGrid();

    // Add scroll interaction with sections
    addScrollInteraction();

    window.addEventListener('resize', onWindowResize, false);

    animate();
}

function createDynamicGrid() {
    const audioFiles = [
        'asset/sound/noisy street.mp3', 'asset/sound/tuk tuk.mp3', 'asset/sound/market restaurant.mp3',
        'asset/sound/indoor market.mp3', 'asset/sound/chanbuying.mp3', 'asset/sound/bkk musical instrument stall.mp3',
        'asset/sound/fruit seller.mp3', 'asset/sound/lumphini selected.mp3', 'asset/sound/seafood.mp3'
    ];

    const gridSize = 3;
    const spacing = 1;
    const boxSize = 1;

    for (let i = 0; i < audioFiles.length; i++) {
        const row = Math.floor(i / gridSize);
        const col = i % gridSize;

        const material = new THREE.MeshMatcapMaterial();

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
        });
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
        // สร้างกล่องสีดำ
        const boxMaterial = new THREE.MeshPhongMaterial({
            color: 0x000000,         // สีของกล่อง: สีดำ
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

        // สร้างขอบของกล่องด้วยวัสดุสีขาว
        const edges = new THREE.EdgesGeometry(geometry);
        const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
        const line = new THREE.LineSegments(edges, lineMaterial);
        mesh.add(line);  // เพิ่มขอบสีขาวให้กับกล่อง

        // สร้าง Shader Material สำหรับเอฟเฟกต์ glow ที่ขอบ
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
                glowIntensity: { value: 1.5 }, // ค่าความเข้มของ glow
                glowColor: { value: new THREE.Color(0xffffff) } // สีของ glow: ขาว
            },
            side: THREE.BackSide, // ทำให้ shader วาดที่ด้านนอกของกล่อง
            blending: THREE.AdditiveBlending, // ใช้การ blending เพื่อเพิ่มความเรืองแสง
            transparent: true
        };

        const glowMaterial = new THREE.ShaderMaterial(glowShader);
        const glowMesh = new THREE.Mesh(geometry, glowMaterial);
        glowMesh.scale.multiplyScalar(1.1); // ขยายขอบเพื่อให้เห็น glow ชัดเจน
        mesh.add(glowMesh);
    }

    group.add(additionalBarsGroup);

    soundBarsMap.get(sound).additionalBars = additionalBars;

    updateBars(analyser, additionalBars);
}
function addScrollInteraction() {
    const sections = document.querySelectorAll('.section1, .section2, .section3, .section4');
    const observerOptions = {
        threshold: 0.5 // Trigger when 50% of the section is in view
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const sectionIndex = Array.from(sections).indexOf(entry.target);

            if (entry.isIntersecting) {
                if (sectionIndex === 0 && !isPlaying) {
                    // Play all sounds when entering .section1
                    soundBarsMap.forEach(({ sound }) => {
                        if (!sound.isPlaying) {
                            sound.play();
                        }
                    });
                    isPlaying = true;
                } else if ((sectionIndex === 1 || sectionIndex === 2) && !isPlaying) {
                    // Continue playing sounds in .section2 and .section3
                    soundBarsMap.forEach(({ sound }) => {
                        if (!sound.isPlaying) {
                            sound.play();
                        }
                    });
                    isPlaying = true;
                }
            } else if ((sectionIndex === 0 || sectionIndex === 3) && isPlaying) {
                // Stop all sounds when leaving .section1 or .section4
                soundBarsMap.forEach(({ sound }) => {
                    if (sound.isPlaying) {
                        sound.pause();
                    }
                });
                isPlaying = false;
            }

            // Start zooming the camera towards the section
            window.addEventListener('scroll', () => {
                const sectionRect = entry.target.getBoundingClientRect();
                const scrollProgress = (window.innerHeight - sectionRect.top) / window.innerHeight;
                const zoomTarget = 45 - (sectionIndex * 10 * scrollProgress);
                camera.position.z = zoomTarget;
            });
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });
}


function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

function updateBars(analyser, additionalBars) {
    const dataArray = analyser.getFrequencyData();
    const step = Math.floor(dataArray.length / 36);

    additionalBars.forEach((bar, index) => {
        bar.scale.y = dataArray[index * step] / 256;
        bar.position.y = bar.scale.y / 2;
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
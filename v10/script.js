// ============================================================
// v10: Holographic Command Center
// ============================================================

// Project data
const PROJECTS = [
  {
    id: 1,
    name: 'THREATWEAVE',
    description: 'Go + Claude AI API | Threat Intelligence Correlation Engine',
    color: '#00ff00'
  },
  {
    id: 2,
    name: 'SECUREVIEW',
    description: 'TypeScript + React + Vite + Claude API | SOC Dashboard',
    color: '#00ffff'
  },
  {
    id: 3,
    name: 'SOC Detection Lab',
    description: 'Python + Sigma YAML + MITRE | Detection Engineering',
    color: '#ff00ff'
  },
  {
    id: 4,
    name: 'IOC Hunter',
    description: 'Python + ThreatFox + VirusTotal | CLI IOC Aggregator',
    color: '#ffff00'
  },
  {
    id: 5,
    name: 'NIST CSF 2.0',
    description: 'Markdown + SVG | GRC Assessment',
    color: '#ff0088'
  },
  {
    id: 6,
    name: 'AWS Healthcare',
    description: 'Case Study | Threat Modelling',
    color: '#00ff88'
  }
];

// Three.js scene setup
let scene, camera, renderer, orbs = [];
let selectedOrb = 0;
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };

function initThreeJS() {
  // Scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0a0e27);

  // Camera
  const width = window.innerWidth;
  const height = window.innerHeight;
  camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
  camera.position.z = 400;

  // Renderer
  const canvas = document.getElementById('hologram-canvas');
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(window.devicePixelRatio);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0x00ffff, 0.5);
  scene.add(ambientLight);

  const pointLight = new THREE.PointLight(0x00ffff, 1);
  pointLight.position.set(100, 100, 100);
  scene.add(pointLight);

  // Create orbs
  createOrbs();

  // Event listeners
  window.addEventListener('resize', onWindowResize);
  document.addEventListener('mousedown', onMouseDown);
  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
  document.addEventListener('wheel', onMouseWheel);

  // Animation loop
  animate();
}

function createOrbs() {
  const radius = 120;
  PROJECTS.forEach((project, index) => {
    const angle = (index / PROJECTS.length) * Math.PI * 2;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;

    // Geometry
    const geometry = new THREE.IcosahedronGeometry(30, 4);

    // Material with glow
    const material = new THREE.MeshPhongMaterial({
      color: project.color,
      emissive: project.color,
      emissiveIntensity: 0.5,
      wireframe: false,
      shininess: 100
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, 0, z);
    mesh.userData = { ...project, index };

    scene.add(mesh);
    orbs.push({
      mesh,
      data: project,
      angle,
      radius,
      rotation: { x: 0, y: 0, z: 0 }
    });

    // Orbit line
    const orbitGeometry = new THREE.BufferGeometry();
    const orbitPoints = [];
    for (let i = 0; i <= 64; i++) {
      const theta = (i / 64) * Math.PI * 2;
      orbitPoints.push(
        Math.cos(theta) * radius,
        0,
        Math.sin(theta) * radius
      );
    }
    orbitGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(orbitPoints), 3));

    const orbitMaterial = new THREE.LineBasicMaterial({
      color: project.color,
      opacity: 0.3,
      transparent: true
    });
    const orbitLine = new THREE.Line(orbitGeometry, orbitMaterial);
    scene.add(orbitLine);
  });
}

function animate() {
  requestAnimationFrame(animate);

  // Rotate and animate orbs
  orbs.forEach((orb, index) => {
    const isSelected = index === selectedOrb;
    const targetScale = isSelected ? 1.3 : 1;
    const targetEmissiveIntensity = isSelected ? 1 : 0.5;

    orb.mesh.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);

    // Rotation
    orb.rotation.x += 0.003;
    orb.rotation.y += 0.005;
    orb.mesh.rotation.x = orb.rotation.x;
    orb.mesh.rotation.y = orb.rotation.y;
    orb.mesh.rotation.z = orb.rotation.z;

    // Orbit
    if (!isDragging) {
      const time = Date.now() * 0.0001;
      orb.angle += 0.001;
      orb.mesh.position.x = Math.cos(orb.angle + time) * orb.radius;
      orb.mesh.position.z = Math.sin(orb.angle + time) * orb.radius;
      orb.mesh.position.y = Math.sin(time * 3) * 30;
    }

    // Glow effect
    orb.mesh.material.emissiveIntensity = targetEmissiveIntensity;
  });

  renderer.render(scene, camera);
}

function onMouseDown(e) {
  isDragging = true;
  previousMousePosition = { x: e.clientX, y: e.clientY };

  // Raycasting for orb selection
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(orbs.map(o => o.mesh));

  if (intersects.length > 0) {
    selectedOrb = intersects[0].object.userData.index;
    updateProjectPanel(PROJECTS[selectedOrb]);
  }
}

function onMouseMove(e) {
  if (!isDragging) return;

  const deltaX = e.clientX - previousMousePosition.x;
  const deltaY = e.clientY - previousMousePosition.y;

  orbs.forEach(orb => {
    orb.rotation.y += deltaX * 0.005;
    orb.rotation.x += deltaY * 0.005;
  });

  previousMousePosition = { x: e.clientX, y: e.clientY };
}

function onMouseUp() {
  isDragging = false;
}

function onMouseWheel(e) {
  e.preventDefault();
  camera.position.z += e.deltaY * 0.5;
  camera.position.z = Math.max(100, Math.min(800, camera.position.z));
}

function onWindowResize() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
}

function updateProjectPanel(project) {
  document.getElementById('project-name').textContent = project.name;
  document.getElementById('project-details').textContent = project.description;
}

// UI Updates
function updateClock() {
  const now = new Date();
  const time = now.toLocaleTimeString('en-US', { hour12: false });
  document.getElementById('time').textContent = time;
}

// Audio synthesis (optional)
function toggleAudio() {
  const button = document.getElementById('audio-toggle');
  button.classList.toggle('muted');
  // Could integrate Web Audio API here
}

// Modal
function closeModal() {
  document.getElementById('about-modal').classList.remove('open');
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  initThreeJS();
  updateClock();
  setInterval(updateClock, 1000);

  document.getElementById('audio-toggle').addEventListener('click', toggleAudio);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
});

// Prevent context menu
document.addEventListener('contextmenu', (e) => e.preventDefault());

// https://youtu.be/Su1n2Uuf38E?si=LNAvmZ--mBD_-ixC

import './style.css';

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const flagSection = document.querySelector('.flag');

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  flagSection.clientWidth / flagSection.clientHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(flagSection.clientWidth, flagSection.clientHeight);
flagSection.appendChild(renderer.domElement);

const textureLoader = new THREE.TextureLoader();
const portraitTexture = textureLoader.load('./portrait.jpg');
const checkerboardTexture = textureLoader.load('./checkerboard-8x8.png');

checkerboardTexture.magFilter = THREE.NearestFilter;

const geometry = new THREE.PlaneGeometry(1.002, 1, 50, 30);
const material = new THREE.MeshBasicMaterial({
  // color: 'black',
  side: THREE.DoubleSide,
  // wireframe: true,
  map: portraitTexture,
  // map: checkerboardTexture,
  // map: ,
});

// Controls
const controls = new OrbitControls(camera, flagSection);
controls.enableDamping = true;

// material.map = textureLoader;

const plane = new THREE.Mesh(geometry, material);
plane.rotation.set(-0.1, 0, 0);

scene.add(plane);

camera.position.z = 2;

const clock = new THREE.Clock();

function animate() {
  const elapsedTime = clock.getElapsedTime();

  const positionAttribute = plane.geometry.getAttribute('position');

  for (let i = 0; i < positionAttribute.array.length; i++) {
    const vertex = new THREE.Vector3();
    vertex.fromBufferAttribute(positionAttribute, i);

    const waveX1 = 0.1 * Math.sin(vertex.x * 5 + elapsedTime);
    const waveZ1 = 0.1 * Math.sin(vertex.x * 5 + elapsedTime * 3);
    const waveY1 = 0.1 * Math.sin(vertex.y + elapsedTime);

    vertex.z = waveX1 + waveZ1 + waveY1;
    // vertex.z = 0.1 * Math.sin(vertex.x * 5 + elapsedTime);

    // vertex.z += Math.sin(vertex.x + elapsedTime * Math.PI);
    positionAttribute.setXYZ(i, vertex.x, vertex.y, vertex.z);
  }

  positionAttribute.needsUpdate = true;
  controls.update();

  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = flagSection.clientWidth / flagSection.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(flagSection.clientWidth, flagSection.clientHeight);
});

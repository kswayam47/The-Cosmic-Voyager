import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import gsap from "gsap";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
// ... existing imports ...

// Add this after your other imports
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';

// ... existing scene setup ...

// Add this before the animate function


const fontLoader = new FontLoader();
fontLoader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function(font) {
    const textGeometry = new TextGeometry('Developer - kswayam47', {
        font: font,
        size: 0.5,
        height: 0.1,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 5
    });
    textGeometry.rotateY(Math.PI / 6);
   
    
    const textMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xffffff,
        metalness: 0.3,
        roughness: 0.4
    });
    
    const textMesh = new THREE.Mesh(textGeometry, textMaterial);
    textGeometry.center();
    textMesh.position.set(-5, 5, -8.56);
    scene.add(textMesh);
});


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(25, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = 9;

const canvas = document.querySelector("#canvas");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

const controls = new OrbitControls(camera, canvas);
controls.enabled = false;
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enableZoom = false;
controls.enableRotate = false;
controls.enablePan = false;

const textures=["./csilla/color.png","./earth/map.jpg","./venus/map.jpg","./volcanic/color.png"];

let lastScrollTime = 0;
const throttleDelay = 2000;
let scrollcount=0;
function throttledWheelHandler(event){
    const currentTime = Date.now();
    
    if (currentTime - lastScrollTime >= throttleDelay) {
        lastScrollTime = currentTime;
        const direction = event.deltaY > 0 ? "down" : "up";
        scrollcount = (scrollcount + 1) % 4;
        
        const headings = document.querySelectorAll(".heading");
        
        gsap.to(headings, {
            duration: 1,
            y: `-=${100}%`,
            ease: "power2.inOut",
        });
        
        gsap.to(spheres.rotation, {
            duration: 1,
            y: `-=${Math.PI/2}%`,
            ease: "power2.inOut"
        });
        
        if(scrollcount === 0) {
            gsap.to(headings, {
                duration: 1,
                y: `0`,
                ease: "power2.inOut",
            });
        }
    }
};
window.addEventListener("wheel",throttledWheelHandler);

const radius=1.3;
const Segments=64;
const orbitradius=4.5;
const spheres=new THREE.Group();
const spheremesh = [];

const textureLoader = new THREE.TextureLoader();

const csillaTexture = textureLoader.load(textures[0]);
csillaTexture.colorSpace = THREE.SRGBColorSpace;
const csillaSphere = new THREE.Mesh(
    new THREE.SphereGeometry(radius, Segments, Segments),
    new THREE.MeshStandardMaterial({ map: csillaTexture, needsUpdate: true })
);
csillaSphere.position.x = orbitradius * Math.cos(0);
csillaSphere.position.z = orbitradius * Math.sin(0);

const earthTexture = textureLoader.load(textures[1]);
earthTexture.colorSpace = THREE.SRGBColorSpace;
const earthSphere = new THREE.Mesh(
    new THREE.SphereGeometry(radius, Segments, Segments),
    new THREE.MeshStandardMaterial({ map: earthTexture, needsUpdate: true })
);
earthSphere.position.x = orbitradius * Math.cos(Math.PI/2);
earthSphere.position.z = orbitradius * Math.sin(Math.PI/2);

const moonGeometry = new THREE.SphereGeometry(0.3, 32, 32);
const moonTexture = textureLoader.load('./moon.webp');
moonTexture.colorSpace = THREE.SRGBColorSpace;
const moonMaterial = new THREE.MeshStandardMaterial({
    map: moonTexture,
    roughness: 0.5,
    metalness: 0.0
});
const moonSphere = new THREE.Mesh(moonGeometry, moonMaterial);

const moonDistance = 2;
moonSphere.position.set(moonDistance, 0, 0);
earthSphere.add(moonSphere);

const venusTexture = textureLoader.load(textures[2]);
venusTexture.colorSpace = THREE.SRGBColorSpace;
const venusSphere = new THREE.Mesh(
    new THREE.SphereGeometry(radius, Segments, Segments),
    new THREE.MeshStandardMaterial({ map: venusTexture, needsUpdate: true })
);
venusSphere.position.x = orbitradius * Math.cos(Math.PI);
venusSphere.position.z = orbitradius * Math.sin(Math.PI);

const volcanicTexture = textureLoader.load(textures[3]);
volcanicTexture.colorSpace = THREE.SRGBColorSpace;
const volcanicSphere = new THREE.Mesh(
    new THREE.SphereGeometry(radius, Segments, Segments),
    new THREE.MeshStandardMaterial({ map: volcanicTexture, needsUpdate: true })
);
volcanicSphere.position.x = orbitradius * Math.cos(3 * Math.PI/2);
volcanicSphere.position.z = orbitradius * Math.sin(3 * Math.PI/2);

spheres.add(csillaSphere, earthSphere, venusSphere, volcanicSphere);
spheremesh.push(csillaSphere, earthSphere, venusSphere, volcanicSphere);

new RGBELoader()
    .load('https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/moonlit_golf_1k.hdr', function(texture) {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        scene.environment = texture;
    });

renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;
renderer.outputColorSpace = THREE.SRGBColorSpace;

const gltfLoader = new GLTFLoader();
gltfLoader.load(
    './astras.glb',
    (gltf) => {
        const model = gltf.scene;
        model.rotation.y = +Math.PI /3;
        model.position.set(-7, 2.1, 2.4);
        model.rotation.x = Math.PI / 4;
        model.rotation.z = -Math.PI / 4;
        model.scale.set(1, 1, 1);
        
        const floatAmplitude = 0.1;
        const floatSpeed = 1;
        
        function animateAstronaut() {
            model.position.y = 2.1 + Math.sin(Date.now() * 0.001 * floatSpeed) * floatAmplitude;
            requestAnimationFrame(animateAstronaut);
        }
        
        animateAstronaut();
        scene.add(model);
    },
    (progress) => {
        console.log('Loading progress:', (progress.loaded / progress.total * 100) + '%');
    },
    (error) => {
        console.error('Error loading model:', error);
    }
);

const spaceshipLoader = new GLTFLoader();
spaceshipLoader.load(
    './space.glb',
    (gltf) => {
        const spaceship = gltf.scene;
        spaceship.position.set(-9, 2.5, 3.5);
        spaceship.rotation.y = Math.PI / 3;
        spaceship.rotation.x = Math.PI / 4.5;
        spaceship.rotation.z = -Math.PI / 4.2;
        spaceship.position.set(-14, 2.5, 5);
        spaceship.scale.set(0.4, 0.4, 0.4);
        
        const floatAmplitude = 0.08;
        const floatSpeed = 0.8;
        
        function animateSpaceship() {
            spaceship.position.y = 2.5 + Math.sin((Date.now() * 0.001 * floatSpeed) + Math.PI/4) * floatAmplitude;
            requestAnimationFrame(animateSpaceship);
        }
        
        animateSpaceship();
        scene.add(spaceship);
    },
    (progress) => {
        console.log('Loading spaceship:', (progress.loaded / progress.total * 100) + '%');
    },
    (error) => {
        console.error('Error loading spaceship:', error);
    }
);

const planetTextureLoader = new THREE.TextureLoader();
const colors=[0xff0000,0x00ff00,0x0000ff,0xffff00];
for(let i=0; i<4; i++){
    const texture = planetTextureLoader.load(textures[i]);
    texture.colorSpace = THREE.SRGBColorSpace;
    const geometry = new THREE.SphereGeometry(radius, Segments, Segments);
    const material = new THREE.MeshStandardMaterial();
    const sphere = new THREE.Mesh(geometry, material);

    const angle = (i/4) * (Math.PI*2);
    sphere.position.x = orbitradius * Math.cos(angle);
    sphere.position.z = orbitradius * Math.sin(angle);
    
    spheres.add(sphere);
    spheremesh.push(sphere);
    
    material.map = texture;
    material.needsUpdate = true;
}
spheres.rotation.x=0.15;
spheres.position.y=-0.4;
scene.add(spheres);
const starGeometry = new THREE.SphereGeometry(15, 64, 64);
const starMaterial = new THREE.MeshStandardMaterial({
    side: THREE.BackSide,
    map: new THREE.TextureLoader().load('./stars.jpg'),
    colorSpace: THREE.SRGBColorSpace
});
const starSphere = new THREE.Mesh(starGeometry, starMaterial);
scene.add(starSphere);

window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

const clock = new THREE.Clock();
function animate() {
    requestAnimationFrame(animate);
    
    const elapsedTime = clock.getElapsedTime();
    for (let i = 0; i < spheremesh.length; i++) {
        const sphere = spheremesh[i];
        sphere.rotation.y = elapsedTime * 0.05;
    }
    
    if (moonSphere) {
        moonSphere.rotation.y = elapsedTime * 0.1;
        moonSphere.position.x = moonDistance * Math.cos(elapsedTime * 0.5);
        moonSphere.position.z = moonDistance * Math.sin(elapsedTime * 0.5);
    }
    
    if(controls) {
        controls.update();
    }
    
    renderer.render(scene, camera);
}

window.addEventListener('mousemove', (event) => {
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);

    const point = new THREE.Vector3();
    raycaster.ray.at(10, point);

    console.log(`3D Position: x: ${point.x.toFixed(2)}, y: ${point.y.toFixed(2)}, z: ${point.z.toFixed(2)}`);
});

const controlButton = document.createElement('button');
controlButton.textContent = 'Enable Free Movement';
controlButton.style.cssText = `
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    padding: 10px 20px;
    background: rgba(255, 255, 255, 0.2);
    border: 1px solid white;
    color: white;
    cursor: pointer;
    border-radius: 20px;
    z-index: 1000;
`;
document.body.appendChild(controlButton);

controlButton.addEventListener('click', () => {
    console.log('Button clicked - Enabling controls');
    
    const uiContainer = document.querySelector(".w-full.h-screen.absolute");
    if(uiContainer) {
        uiContainer.remove();
    } else {
        console.log('UI container not found');
    }
    
    window.removeEventListener('wheel', throttledWheelHandler);
    
    setTimeout(() => {
        controls.enabled = true;
        controls.enableZoom = true;
        controls.enableRotate = true;
        controls.enablePan = true;
        controls.minDistance = 2;
        controls.maxDistance = 20;
        
        gsap.killTweensOf(camera.position);
        
        gsap.to(camera.position, {
            x: 8,
            y: 4,
            z: 15,
            duration: 2,
            ease: "power2.inOut",
            onComplete: () => {
                controlButton.style.display = 'none';
                console.log('Camera movement complete');
                controls.update();
            }
        });
    }, 100);
});

animate();

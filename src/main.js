import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import { createScene } from "./core/Scene.js";
import { createCamera } from "./core/Camera.js";
import { createRenderer } from "./core/Renderer.js";
import { createLighting } from "./core/Lighting.js";

const scene = createScene();
const camera = createCamera();
const renderer = createRenderer();

document.getElementById("app").appendChild(renderer.domElement);

createLighting(scene);

const controls = new OrbitControls(
    camera,
    renderer.domElement
);

controls.enableDamping = true;
controls.target.set(0, 1, 0);


/* =========================================================
   TEST GROUND
========================================================= */

const groundGeometry =
    new THREE.CircleGeometry(12, 32);

const groundMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x10221f,
        roughness: 0.9,
        flatShading: true
    });

const ground =
    new THREE.Mesh(
        groundGeometry,
        groundMaterial
    );

ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;

scene.add(ground);


/* =========================================================
   TEST CRYSTAL
========================================================= */

const crystalGeometry =
    new THREE.OctahedronGeometry(1, 0);

const crystalMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x55ddff,
        emissive: 0x159dff,
        emissiveIntensity: 1.5,
        flatShading: true
    });

const crystal =
    new THREE.Mesh(
        crystalGeometry,
        crystalMaterial
    );

crystal.position.y = 1.2;
crystal.castShadow = true;

scene.add(crystal);


/* =========================================================
   TEST ROCKS
========================================================= */

const rockMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x303744,
        roughness: 1,
        flatShading: true
    });

for (let i = 0; i < 12; i++) {

    const rock =
        new THREE.Mesh(
            new THREE.DodecahedronGeometry(
                0.45,
                0
            ),
            rockMaterial
        );

    const angle =
        (i / 12) * Math.PI * 2;

    const radius = 4 + Math.random() * 4;

    rock.position.set(
        Math.cos(angle) * radius,
        0.3,
        Math.sin(angle) * radius
    );

    rock.scale.set(
        1 + Math.random(),
        0.5 + Math.random(),
        1 + Math.random()
    );

    rock.rotation.set(
        Math.random(),
        Math.random(),
        Math.random()
    );

    rock.castShadow = true;

    scene.add(rock);
}


/* =========================================================
   TEST LIGHT
========================================================= */

const crystalLight =
    new THREE.PointLight(
        0x00d9ff,
        4,
        8
    );

crystalLight.position.set(
    0,
    2,
    0
);

scene.add(crystalLight);


/* =========================================================
   ANIMATION
========================================================= */

const clock =
    new THREE.Clock();

function animate() {

    requestAnimationFrame(animate);

    const time =
        clock.getElapsedTime();

    crystal.rotation.y =
        time * 0.8;

    crystal.position.y =
        1.2 +
        Math.sin(time * 2) * 0.15;

    crystalLight.intensity =
        3 +
        Math.sin(time * 3) * 1;

    controls.update();

    renderer.render(
        scene,
        camera
    );
}

animate();


/* =========================================================
   RESIZE
========================================================= */

window.addEventListener(
    "resize",
    () => {

        camera.aspect =
            window.innerWidth /
            window.innerHeight;

        camera.updateProjectionMatrix();

        renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );
    }
);
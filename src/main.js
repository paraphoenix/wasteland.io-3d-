
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import { createScene } from "./core/Scene.js";
import { createCamera } from "./core/Camera.js";
import { createRenderer } from "./core/Renderer.js";
import { createLighting } from "./core/Lighting.js";

import { createGround } from "./environment/Ground.js";
import { createTrees } from "./environment/Trees.js";
import { createRocks } from "./environment/Rocks.js";
import { createCrystals } from "./environment/Crystals.js";
import { createMushrooms } from "./environment/Mushrooms.js";
import { createMagicalParticles } from "./environment/MagicalParticles.js";
import { createMountains } from "./environment/Mountains.js";
import { createAncientRuins } from "./environment/AncientRuins.js";

import { createRuneCircle } from "./magic/RuneCircle.js";
import { createMagicOrbs } from "./magic/MagicOrbs.js";

import { createWizard } from "./characters/Wizard.js";

import {
    createThirdPersonCamera
} from "./camera/ThirdPersonCamera.js";


/*
=========================================================
ENGINE
=========================================================
*/

const scene =
    createScene();


const camera =
    createCamera();


const renderer =
    createRenderer();


document
    .getElementById("app")
    .appendChild(
        renderer.domElement
    );


createLighting(
    scene
);


/*
=========================================================
ENVIRONMENT
=========================================================
*/

createGround(
    scene
);


createMountains(
    scene
);


createTrees(
    scene
);


createRocks(
    scene
);


createCrystals(
    scene
);


createMushrooms(
    scene
);


createAncientRuins(
    scene
);


createMagicalParticles(
    scene
);


/*
=========================================================
MAGIC
=========================================================
*/

createRuneCircle(
    scene
);


createMagicOrbs(
    scene
);


/*
=========================================================
WIZARD
=========================================================
*/

const wizard =
    createWizard(
        scene
    );


/*
=========================================================
THIRD PERSON CAMERA
=========================================================
*/

const thirdPersonCamera =
    createThirdPersonCamera(
        camera,
        wizard
    );


/*
=========================================================
INITIAL CAMERA
=========================================================
*/

camera.position.set(
    0,
    5,
    8
);


camera.lookAt(
    0,
    1.5,
    0
);


/*
=========================================================
ANIMATION
=========================================================
*/

const clock =
    new THREE.Clock();


function animate() {

    requestAnimationFrame(
        animate
    );


    const time =
        clock.getElapsedTime();


    /*
    -----------------------------------------------
    UPDATE WIZARD
    -----------------------------------------------
    */

    if (
        wizard.userData &&
        typeof wizard.userData.update ===
        "function"
    ) {

        wizard.userData.update(
            time
        );

    }


    /*
    -----------------------------------------------
    UPDATE ENVIRONMENT
    -----------------------------------------------
    */

    scene.traverse(
        (object) => {

            if (
                object === wizard
            ) {

                return;

            }


            if (
                object.userData &&
                typeof object.userData.update ===
                "function"
            ) {

                object.userData.update(
                    time
                );

            }

        }
    );


    /*
    -----------------------------------------------
    CAMERA
    -----------------------------------------------
    */

    thirdPersonCamera.update();


    /*
    -----------------------------------------------
    RENDER
    -----------------------------------------------
    */

    renderer.render(
        scene,
        camera
    );

}


animate();


/*
=========================================================
RESIZE
=========================================================
*/

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

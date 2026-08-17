from pathlib import Path
import sys


# =========================================================
# PROJECT LOCATION
# =========================================================

HERE = Path.cwd()

if (HERE / "src").exists() and (HERE / "package.json").exists():

    ROOT = HERE

elif (
    (HERE / "arcane-wilds" / "src").exists()
    and
    (HERE / "arcane-wilds" / "package.json").exists()
):

    ROOT = HERE / "arcane-wilds"

else:

    print()
    print("ERROR: Could not find the arcane-wilds project.")
    print()
    print("Run this installer from either:")
    print()
    print("  arcane-wilds/")
    print()
    print("or its parent folder.")
    print()

    sys.exit(1)


SRC = ROOT / "src"


# =========================================================
# FILES
# =========================================================

FILES = {

    # -----------------------------------------------------
    # THIRD PERSON CAMERA
    # -----------------------------------------------------

    "src/camera/ThirdPersonCamera.js": r'''
import * as THREE from "three";


export function createThirdPersonCamera(
    camera,
    target
) {

    const offset =
        new THREE.Vector3(
            0,
            5,
            8
        );


    const lookOffset =
        new THREE.Vector3(
            0,
            1.5,
            0
        );


    const desiredPosition =
        new THREE.Vector3();


    const lookTarget =
        new THREE.Vector3();


    const smoothness = 0.08;


    function update() {

        desiredPosition
            .copy(target.position)
            .add(offset);


        camera.position.lerp(
            desiredPosition,
            smoothness
        );


        lookTarget
            .copy(target.position)
            .add(lookOffset);


        camera.lookAt(
            lookTarget
        );

    }


    return {
        update
    };
}
''',


    # -----------------------------------------------------
    # WIZARD
    # -----------------------------------------------------

    "src/characters/Wizard.js": r'''
import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";


export function createWizard(scene) {

    const wizardGroup =
        new THREE.Group();


    wizardGroup.name =
        "ArcaneWizard";


    scene.add(
        wizardGroup
    );


    /*
    =====================================================
    INPUT
    =====================================================
    */

    const keys = {

        w: false,
        a: false,
        s: false,
        d: false

    };


    const movementSpeed = 4;


    window.addEventListener(
        "keydown",
        (event) => {

            const key =
                event.key.toLowerCase();


            if (
                key === "w" ||
                key === "a" ||
                key === "s" ||
                key === "d"
            ) {

                keys[key] = true;

            }

        }
    );


    window.addEventListener(
        "keyup",
        (event) => {

            const key =
                event.key.toLowerCase();


            if (
                key === "w" ||
                key === "a" ||
                key === "s" ||
                key === "d"
            ) {

                keys[key] = false;

            }

        }
    );


    /*
    =====================================================
    LOAD OBJ
    =====================================================
    */

    const loader =
        new OBJLoader();


    loader.load(

        "/models/character/arcane_wizard.obj",

        (object) => {

            console.log(
                "Wizard OBJ loaded"
            );


            /*
            ---------------------------------------------
            MATERIAL
            ---------------------------------------------
            */

            const material =
                new THREE.MeshStandardMaterial({

                    color: 0x40365f,

                    roughness: 0.75,

                    metalness: 0.05,

                    flatShading: true

                });


            object.traverse(
                (child) => {

                    if (
                        child.isMesh
                    ) {

                        child.material =
                            material;


                        child.castShadow =
                            true;


                        child.receiveShadow =
                            true;

                    }

                }
            );


            /*
            ---------------------------------------------
            MODEL
            ---------------------------------------------
            */

            object.scale.set(
                1,
                1,
                1
            );


            object.position.set(
                0,
                0,
                0
            );


            wizardGroup.add(
                object
            );


            /*
            ---------------------------------------------
            MAGIC LIGHT
            ---------------------------------------------
            */

            const purpleLight =
                new THREE.PointLight(
                    0x7b4dff,
                    3,
                    8
                );


            purpleLight.position.set(
                0,
                3,
                1
            );


            wizardGroup.add(
                purpleLight
            );


            const cyanLight =
                new THREE.PointLight(
                    0x00eaff,
                    2,
                    7
                );


            cyanLight.position.set(
                -2,
                2,
                1
            );


            wizardGroup.add(
                cyanLight
            );


            /*
            ---------------------------------------------
            UPDATE
            ---------------------------------------------
            */

            wizardGroup.userData.update =
                function(time) {

                    const direction =
                        new THREE.Vector3();


                    if (keys.w) {

                        direction.z -= 1;

                    }


                    if (keys.s) {

                        direction.z += 1;

                    }


                    if (keys.a) {

                        direction.x -= 1;

                    }


                    if (keys.d) {

                        direction.x += 1;

                    }


                    /*
                    -------------------------------------
                    MOVEMENT
                    -------------------------------------
                    */

                    if (
                        direction.lengthSq() > 0
                    ) {

                        direction.normalize();


                        wizardGroup.position.x +=
                            direction.x *
                            movementSpeed *
                            0.016;


                        wizardGroup.position.z +=
                            direction.z *
                            movementSpeed *
                            0.016;


                        /*
                        ---------------------------------
                        FACE MOVEMENT
                        ---------------------------------
                        */

                        const targetRotation =
                            Math.atan2(
                                direction.x,
                                direction.z
                            );


                        let difference =
                            targetRotation -
                            wizardGroup.rotation.y;


                        difference =
                            Math.atan2(
                                Math.sin(difference),
                                Math.cos(difference)
                            );


                        wizardGroup.rotation.y +=
                            difference * 0.15;

                    }


                    /*
                    -------------------------------------
                    IDLE / WALK BOB
                    -------------------------------------
                    */

                    if (
                        direction.lengthSq() === 0
                    ) {

                        wizardGroup.position.y =
                            Math.sin(
                                time * 1.5
                            ) * 0.04;

                    } else {

                        wizardGroup.position.y =
                            Math.sin(
                                time * 8
                            ) * 0.015;

                    }


                    /*
                    -------------------------------------
                    MAGIC PULSE
                    -------------------------------------
                    */

                    purpleLight.intensity =
                        2.5 +
                        Math.sin(
                            time * 3
                        ) * 0.5;


                    cyanLight.intensity =
                        1.5 +
                        Math.sin(
                            time * 4
                        ) * 0.4;

                };

        },


        (xhr) => {

            if (
                xhr.total > 0
            ) {

                console.log(
                    "Wizard:",
                    Math.round(
                        (
                            xhr.loaded /
                            xhr.total
                        ) * 100
                    ) + "%"
                );

            }

        },


        (error) => {

            console.error(
                "Wizard loading failed:",
                error
            );

        }

    );


    return wizardGroup;
}
''',


    # -----------------------------------------------------
    # MAIN
    # -----------------------------------------------------

    "src/main.js": r'''
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
THIRD PERSON CONTROLS
=========================================================
*/

const controls =
    new OrbitControls(
        camera,
        renderer.domElement
    );


controls.enableDamping =
    true;


controls.dampingFactor =
    0.05;


controls.minDistance =
    5;


controls.maxDistance =
    35;


controls.maxPolarAngle =
    Math.PI / 2.05;


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
    WIZARD
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
    ENVIRONMENT
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
'''
}


# =========================================================
# INSTALL
# =========================================================

def install():

    print()
    print("==============================================")
    print("       ARCANE WILDS v0.05 INSTALLER")
    print("==============================================")
    print()

    print("Project:")
    print(ROOT)
    print()

    for filename, content in FILES.items():

        path = ROOT / filename

        path.parent.mkdir(
            parents=True,
            exist_ok=True
        )

        path.write_text(
            content,
            encoding="utf-8"
        )

        print(
            "[UPDATED]",
            filename
        )

    print()
    print("==============================================")
    print("       v0.05 INSTALL COMPLETE")
    print("==============================================")
    print()

    print("Added:")
    print()
    print("  Third-person camera")
    print("  Smooth camera follow")
    print("  Wizard movement")
    print("  Wizard rotation")
    print("  Existing environment preserved")
    print("  Existing magic preserved")
    print()

    print("Run:")
    print()
    print("  npm run dev")
    print()

    print("Version: 0.05.0")
    print()


if __name__ == "__main__":
    install()

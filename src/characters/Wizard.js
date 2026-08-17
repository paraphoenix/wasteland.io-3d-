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
    MOVEMENT
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
    OBJ LOADER
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
            MATERIAL
            */

            const material =
                new THREE.MeshStandardMaterial({

                    color: 0x40365f,

                    roughness: 0.75,

                    metalness: 0.05,

                    flatShading: true

                });


            /*
            APPLY MATERIAL
            */

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
            SCALE
            */

            object.scale.set(
                1,
                1,
                1
            );


            /*
            POSITION
            */

            object.position.set(
                0,
                0,
                0
            );


            wizardGroup.add(
                object
            );


            /*
            =================================================
            MAGIC LIGHTS
            =================================================
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
            =================================================
            UPDATE
            =================================================
            */

            wizardGroup.userData.update =
                function(time) {

                    /*
                    -----------------------------------------
                    MOVEMENT VECTOR
                    -----------------------------------------
                    */

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
                    -----------------------------------------
                    MOVE
                    -----------------------------------------
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
                        -------------------------------------
                        FACE MOVEMENT DIRECTION
                        -------------------------------------
                        */

                        const targetRotation =
                            Math.atan2(
                                direction.x,
                                direction.z
                            );


                        wizardGroup.rotation.y +=
                            (
                                targetRotation -
                                wizardGroup.rotation.y
                            ) *
                            0.15;

                    }


                    /*
                    -----------------------------------------
                    IDLE FLOAT
                    -----------------------------------------
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
                    -----------------------------------------
                    MAGIC LIGHT PULSE
                    -----------------------------------------
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


        /*
        =====================================================
        LOADING
        =====================================================
        */

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


        /*
        =====================================================
        ERROR
        =====================================================
        */

        (error) => {

            console.error(
                "Wizard loading failed:",
                error
            );

        }

    );


    return wizardGroup;
}
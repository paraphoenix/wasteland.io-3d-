import * as THREE from "three";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";
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
    MATERIAL LOADER
    =====================================================
    */

    const mtlLoader =
        new MTLLoader();


    mtlLoader.load(

        "/models/character/arcane_wizard.mtl",


        (materials) => {

            console.log(
                "Wizard MTL loaded"
            );


            materials.preload();


            /*
            =============================================
            OBJ LOADER
            =============================================
            */

            const objLoader =
                new OBJLoader();


            objLoader.setMaterials(
                materials
            );


            objLoader.load(

                "/models/character/arcane_wizard.obj",


                (object) => {

                    console.log(
                        "Wizard OBJ + MTL loaded"
                    );


                    /*
                    =====================================
                    MODEL
                    =====================================
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


                    /*
                    =====================================
                    SHADOWS
                    =====================================
                    */

                    object.traverse(
                        (child) => {

                            if (
                                child.isMesh
                            ) {

                                child.castShadow =
                                    true;


                                child.receiveShadow =
                                    true;


                                /*
                                Keep the materials
                                from the MTL.
                                */

                                if (
                                    child.material
                                ) {

                                    child.material
                                        .flatShading =
                                        true;

                                    child.material
                                        .needsUpdate =
                                        true;

                                }

                            }

                        }
                    );


                    wizardGroup.add(
                        object
                    );


                    /*
                    =====================================
                    MAGIC LIGHTS
                    =====================================
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
                    =====================================
                    UPDATE
                    =====================================
                    */

                    wizardGroup.userData.update =
                        function(time) {

                            const direction =
                                new THREE.Vector3();


                            /*
                            -----------------------------
                            INPUT
                            -----------------------------
                            */

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
                            -----------------------------
                            MOVEMENT
                            -----------------------------
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
                                -------------------------
                                FACE MOVEMENT
                                -------------------------
                                */

                                const targetRotation =
                                    Math.atan2(
                                        direction.x,
                                        direction.z
                                    );


                                let rotationDifference =
                                    targetRotation -
                                    wizardGroup.rotation.y;


                                rotationDifference =
                                    Math.atan2(
                                        Math.sin(
                                            rotationDifference
                                        ),
                                        Math.cos(
                                            rotationDifference
                                        )
                                    );


                                wizardGroup.rotation.y +=
                                    rotationDifference *
                                    0.15;

                            }


                            /*
                            -----------------------------
                            IDLE / WALK FLOAT
                            -----------------------------
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
                            -----------------------------
                            PURPLE MAGIC
                            -----------------------------
                            */

                            purpleLight.intensity =
                                2.5 +
                                Math.sin(
                                    time * 3
                                ) * 0.5;


                            /*
                            -----------------------------
                            CYAN MAGIC
                            -----------------------------
                            */

                            cyanLight.intensity =
                                1.5 +
                                Math.sin(
                                    time * 4
                                ) * 0.4;

                        };

                },


                /*
                =========================================
                OBJ PROGRESS
                =========================================
                */

                (xhr) => {

                    if (
                        xhr.total > 0
                    ) {

                        console.log(
                            "Wizard OBJ:",
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
                =========================================
                OBJ ERROR
                =========================================
                */

                (error) => {

                    console.error(
                        "Wizard OBJ loading failed:",
                        error
                    );

                }

            );

        },


        /*
        ================================================
        MTL PROGRESS
        ================================================
        */

        undefined,


        /*
        ================================================
        MTL ERROR
        ================================================
        */

        (error) => {

            console.error(
                "Wizard MTL loading failed:",
                error
            );

        }

    );


    return wizardGroup;
}
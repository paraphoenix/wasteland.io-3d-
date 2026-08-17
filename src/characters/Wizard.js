import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";


export function createWizard(scene) {

    console.log("================================");
    console.log("WIZARD SYSTEM STARTING");
    console.log("================================");


    const wizardGroup =
        new THREE.Group();

    wizardGroup.name =
        "ArcaneWizard";


    scene.add(
        wizardGroup
    );


    /*
    =====================================================
    TEST MARKER
    =====================================================
    */

    const marker =
        new THREE.Mesh(

            new THREE.SphereGeometry(
                0.3,
                8,
                8
            ),

            new THREE.MeshStandardMaterial({

                color: 0xff00ff,

                emissive: 0xff00ff,

                emissiveIntensity: 3
            })
        );


    marker.position.y =
        3;


    wizardGroup.add(
        marker
    );


    /*
    =====================================================
    OBJ LOADER
    =====================================================
    */

    const loader =
        new OBJLoader();


    const modelPath =
        "/models/character/arcane_wizard.obj";


    console.log(
        "Loading wizard:",
        modelPath
    );


    loader.load(

        modelPath,


        /*
        SUCCESS
        */

        (object) => {

            console.log(
                "================================"
            );

            console.log(
                "WIZARD OBJ LOADED SUCCESSFULLY"
            );

            console.log(
                object
            );

            console.log(
                "================================"
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


                        if (
                            child.geometry
                        ) {

                            child.geometry
                                .computeVertexNormals();
                        }

                    }

                }
            );


            /*
            =================================================
            MODEL SCALE
            =================================================
            */

            object.scale.set(
                1,
                1,
                1
            );


            /*
            =================================================
            MODEL POSITION
            =================================================
            */

            object.position.set(
                0,
                0,
                0
            );


            /*
            =================================================
            ADD MODEL
            =================================================
            */

            wizardGroup.add(
                object
            );


            /*
            REMOVE TEST MARKER
            */

            wizardGroup.remove(
                marker
            );


            /*
            =================================================
            MAGIC LIGHT
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
            ANIMATION
            =================================================
            */

            wizardGroup.userData.update =
                function(time) {

                    wizardGroup.position.y =
                        Math.sin(
                            time * 1.5
                        ) * 0.04;


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
        PROGRESS
        =====================================================
        */

        (xhr) => {

            if (
                xhr.total > 0
            ) {

                console.log(
                    "Wizard loading:",
                    Math.round(
                        (
                            xhr.loaded /
                            xhr.total
                        ) * 100
                    ) + "%"
                );

            } else {

                console.log(
                    "Wizard loading..."
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
                "================================"
            );

            console.error(
                "WIZARD OBJ FAILED TO LOAD"
            );

            console.error(
                error
            );

            console.error(
                "PATH:",
                modelPath
            );

            console.error(
                "================================"
            );

        }

    );


    return wizardGroup;
}
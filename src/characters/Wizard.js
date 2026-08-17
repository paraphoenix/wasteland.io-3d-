import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export function createWizard(scene) {

    const wizardGroup = new THREE.Group();

    wizardGroup.name = "ArcaneWizard";

    scene.add(wizardGroup);


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


    /*
    =====================================================
    GLB
    =====================================================
    */

    let wizardModel = null;

    let mixer = null;

    let rightHand = null;

    let staff = null;

    let staffGem = null;


    /*
    =====================================================
    MAGIC
    =====================================================
    */

    let purpleLight = null;
    let cyanLight = null;

    let lightning = null;

    let casting = false;

    let castTimer = 0;

    const castDuration = 1.0;


    /*
    =====================================================
    HAND BASE ROTATION
    =====================================================
    */

    let handBaseRotation =
        new THREE.Euler();


    /*
    =====================================================
    INPUT
    =====================================================
    */

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

            if (
                key === "e" &&
                !event.repeat
            ) {

                startCast();

            }

            if (
                event.code === "Space" &&
                !event.repeat
            ) {

                startCast();

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
    FIND HAND / STAFF
    =====================================================
    */

    function findParts(object) {

        const meshes = [];

        object.traverse(
            (child) => {

                if (
                    child.isMesh
                ) {

                    meshes.push(
                        child
                    );

                }

            }
        );


        /*
        -------------------------------------------------
        FIRST TRY NAMES
        -------------------------------------------------
        */

        object.traverse(
            (child) => {

                const name =
                    child.name
                        .toLowerCase();


                if (
                    !rightHand &&
                    (
                        name.includes("righthand") ||
                        name.includes("right_hand") ||
                        name.includes("right hand") ||
                        name === "hand.r" ||
                        name.includes("hand_r")
                    )
                ) {

                    rightHand =
                        child;

                }


                if (
                    !staff &&
                    (
                        name === "staff" ||
                        name.includes("staff")
                    )
                ) {

                    staff =
                        child;

                }


                if (
                    !staffGem &&
                    (
                        name.includes("staffgem") ||
                        name.includes("staff_gem") ||
                        name.includes("gem")
                    )
                ) {

                    staffGem =
                        child;

                }

            }
        );


        /*
        -------------------------------------------------
        FALLBACK TO YOUR ORIGINAL OBJ ORDER
        -------------------------------------------------

        7 = Right Hand
        10 = Staff
        11 = Staff Gem
        -------------------------------------------------
        */

        if (
            !rightHand &&
            meshes[6]
        ) {

            rightHand =
                meshes[6];

        }


        if (
            !staff &&
            meshes[9]
        ) {

            staff =
                meshes[9];

        }


        if (
            !staffGem &&
            meshes[10]
        ) {

            staffGem =
                meshes[10];

        }


        if (rightHand) {

            rightHand.name =
                "RightHand";

            handBaseRotation.copy(
                rightHand.rotation
            );

            console.log(
                "RIGHT HAND FOUND:",
                rightHand
            );

        } else {

            console.warn(
                "RIGHT HAND NOT FOUND"
            );

        }


        if (staff) {

            staff.name =
                "Staff";

            console.log(
                "STAFF FOUND:",
                staff
            );

        }


        if (staffGem) {

            staffGem.name =
                "StaffGem";

            console.log(
                "STAFF GEM FOUND:",
                staffGem
            );

        }

    }


    /*
    =====================================================
    STAFF POSITION
    =====================================================
    */

    function getStaffPosition() {

        const position =
            new THREE.Vector3();


        if (staffGem) {

            staffGem.getWorldPosition(
                position
            );

            return position;

        }


        if (staff) {

            staff.getWorldPosition(
                position
            );

            return position;

        }


        wizardGroup.getWorldPosition(
            position
        );

        position.y += 3;

        return position;

    }


    /*
    =====================================================
    FORWARD
    =====================================================
    */

    function getForwardDirection() {

        const direction =
            new THREE.Vector3(
                0,
                0,
                -1
            );

        direction.applyQuaternion(
            wizardGroup.quaternion
        );

        direction.normalize();

        return direction;

    }


    /*
    =====================================================
    START CAST
    =====================================================
    */

    function startCast() {

        if (casting) {

            return;

        }

        casting = true;

        castTimer = 0;

        console.log(
            "⚡ ARCANE WIZARD CASTING"
        );

    }


    /*
    =====================================================
    LIGHTNING
    =====================================================
    */

    function castLightning() {

        if (lightning) {

            scene.remove(
                lightning
            );

            lightning = null;

        }


        const group =
            new THREE.Group();


        const start =
            getStaffPosition();


        const direction =
            getForwardDirection();


        const distance =
            16;


        const end =
            start.clone().add(
                direction
                    .clone()
                    .multiplyScalar(
                        distance
                    )
            );


        const points = [];

        const segments = 20;


        for (
            let i = 0;
            i <= segments;
            i++
        ) {

            const t =
                i / segments;


            const point =
                new THREE.Vector3()
                    .lerpVectors(
                        start,
                        end,
                        t
                    );


            if (
                i !== 0 &&
                i !== segments
            ) {

                const side =
                    new THREE.Vector3(
                        1,
                        0.35,
                        0.15
                    );

                side.applyQuaternion(
                    wizardGroup.quaternion
                );


                point.add(
                    side.multiplyScalar(
                        (
                            Math.random() -
                            0.5
                        ) * 0.65
                    )
                );


                point.y +=
                    (
                        Math.random() -
                        0.5
                    ) * 0.55;

            }


            points.push(
                point
            );

        }


        const geometry =
            new THREE.BufferGeometry()
                .setFromPoints(
                    points
                );


        /*
        -------------------------------------------------
        WHITE CORE
        -------------------------------------------------
        */

        const core =
            new THREE.Line(
                geometry,
                new THREE.LineBasicMaterial({
                    color: 0xffffff
                })
            );


        group.add(
            core
        );


        /*
        -------------------------------------------------
        PURPLE GLOW
        -------------------------------------------------
        */

        const glow =
            new THREE.Line(
                geometry,
                new THREE.LineBasicMaterial({

                    color: 0x704cff,

                    transparent: true,

                    opacity: 0.6

                })
            );


        glow.scale.set(
            1.8,
            1.8,
            1.8
        );


        group.add(
            glow
        );


        /*
        -------------------------------------------------
        LIGHT FLASH
        -------------------------------------------------
        */

        const flash =
            new THREE.PointLight(
                0x805cff,
                15,
                10
            );


        flash.position.copy(
            start
        );


        group.add(
            flash
        );


        scene.add(
            group
        );


        lightning =
            group;


        if (purpleLight) {

            purpleLight.intensity =
                12;

        }


        if (cyanLight) {

            cyanLight.intensity =
                8;

        }


        setTimeout(
            () => {

                if (
                    lightning === group
                ) {

                    scene.remove(
                        group
                    );

                    lightning =
                        null;

                }

            },
            220
        );

    }


    /*
    =====================================================
    HAND CAST ANIMATION
    =====================================================
    */

    function updateCast(delta) {

        if (!casting) {

            return;

        }


        castTimer +=
            delta;


        const progress =
            Math.min(
                castTimer /
                castDuration,
                1
            );


        /*
        =================================================
        CHARGE
        =================================================
        */

        if (
            progress < 0.40
        ) {

            const p =
                progress /
                0.40;


            const eased =
                p * p *
                (3 - 2 * p);


            /*
            BIG ROTATION
            */

            rightHand.rotation.x =
                handBaseRotation.x +
                THREE.MathUtils.lerp(
                    0,
                    -Math.PI * 1.15,
                    eased
                );


            rightHand.rotation.y =
                handBaseRotation.y +
                THREE.MathUtils.lerp(
                    0,
                    Math.PI * 0.75,
                    eased
                );


            rightHand.rotation.z =
                handBaseRotation.z +
                THREE.MathUtils.lerp(
                    0,
                    -Math.PI * 0.55,
                    eased
                );

        }


        /*
        =================================================
        RELEASE
        =================================================
        */

        else if (
            progress < 0.62
        ) {

            const p =
                (
                    progress -
                    0.40
                ) /
                0.22;


            const eased =
                p * p *
                (3 - 2 * p);


            rightHand.rotation.x =
                handBaseRotation.x +
                THREE.MathUtils.lerp(
                    -Math.PI * 1.15,
                    Math.PI * 0.65,
                    eased
                );


            rightHand.rotation.y =
                handBaseRotation.y +
                THREE.MathUtils.lerp(
                    Math.PI * 0.75,
                    -Math.PI * 0.35,
                    eased
                );


            rightHand.rotation.z =
                handBaseRotation.z +
                THREE.MathUtils.lerp(
                    -Math.PI * 0.55,
                    Math.PI * 0.35,
                    eased
                );


            /*
            FIRE LIGHTNING ONCE
            */

            if (
                castTimer >= 0.50 &&
                castTimer - delta < 0.50
            ) {

                castLightning();

            }

        }


        /*
        =================================================
        RETURN
        =================================================
        */

        else {

            const p =
                Math.min(
                    (
                        progress -
                        0.62
                    ) /
                    0.38,
                    1
                );


            const eased =
                p * p *
                (3 - 2 * p);


            rightHand.rotation.x =
                THREE.MathUtils.lerp(
                    handBaseRotation.x +
                    Math.PI * 0.65,

                    handBaseRotation.x,

                    eased
                );


            rightHand.rotation.y =
                THREE.MathUtils.lerp(
                    handBaseRotation.y -
                    Math.PI * 0.35,

                    handBaseRotation.y,

                    eased
                );


            rightHand.rotation.z =
                THREE.MathUtils.lerp(
                    handBaseRotation.z +
                    Math.PI * 0.35,

                    handBaseRotation.z,

                    eased
                );

        }


        /*
        =================================================
        GEM ENERGY
        =================================================
        */

        const charge =
            Math.sin(
                Math.min(
                    progress * Math.PI,
                    Math.PI
                )
            );


        if (staffGem) {

            const scale =
                1 +
                charge * 0.25;


            staffGem.scale.set(
                scale,
                scale,
                scale
            );

        }


        /*
        =================================================
        LIGHT
        =================================================
        */

        if (purpleLight) {

            purpleLight.intensity =
                2.5 +
                charge * 9;

        }


        if (cyanLight) {

            cyanLight.intensity =
                1.5 +
                charge * 6;

        }


        /*
        =================================================
        FINISH
        =================================================
        */

        if (
            progress >= 1
        ) {

            casting =
                false;

            castTimer =
                0;


            rightHand.rotation.copy(
                handBaseRotation
            );


            if (staffGem) {

                staffGem.scale.set(
                    1,
                    1,
                    1
                );

            }

        }

    }


    /*
    =====================================================
    LOAD GLB
    =====================================================
    */

    const loader =
        new GLTFLoader();


    loader.load(

        "/models/character/arcane_wizard.glb",

        (gltf) => {

            console.log(
                "Arcane Wizard GLB loaded"
            );


            wizardModel =
                gltf.scene;


            wizardModel.name =
                "WizardModel";


            /*
            -------------------------------------------------
            MODEL SETTINGS
            -------------------------------------------------
            */

            wizardModel.traverse(
                (child) => {

                    if (
                        child.isMesh
                    ) {

                        child.castShadow =
                            true;

                        child.receiveShadow =
                            true;

                    }

                }
            );


            /*
            -------------------------------------------------
            ADD MODEL
            -------------------------------------------------
            */

            wizardGroup.add(
                wizardModel
            );


            /*
            -------------------------------------------------
            FIND PARTS
            -------------------------------------------------
            */

            findParts(
                wizardModel
            );


            /*
            -------------------------------------------------
            ANIMATIONS
            -------------------------------------------------
            */

            if (
                gltf.animations &&
                gltf.animations.length > 0
            ) {

                mixer =
                    new THREE.AnimationMixer(
                        wizardModel
                    );

                console.log(
                    "GLB animations:",
                    gltf.animations
                );

            }


            /*
            -------------------------------------------------
            LIGHTS
            -------------------------------------------------
            */

            purpleLight =
                new THREE.PointLight(
                    0x7b4dff,
                    2.5,
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


            cyanLight =
                new THREE.PointLight(
                    0x00eaff,
                    1.5,
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


            console.log(
                "Wizard ready"
            );

        },

        (xhr) => {

            if (
                xhr.total > 0
            ) {

                console.log(
                    "Wizard GLB:",
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
                "Wizard GLB loading failed:",
                error
            );

        }

    );


    /*
    =====================================================
    UPDATE
    =====================================================
    */

    wizardGroup.userData.update =
        function(time) {

            /*
            -------------------------------------------------
            MOVEMENT
            -------------------------------------------------
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
                        Math.sin(
                            difference
                        ),
                        Math.cos(
                            difference
                        )
                    );


                wizardGroup.rotation.y +=
                    difference * 0.15;

            }


            /*
            -------------------------------------------------
            FLOAT
            -------------------------------------------------
            */

            if (!casting) {

                wizardGroup.position.y =
                    Math.sin(
                        time * 1.5
                    ) * 0.04;

            }


            /*
            -------------------------------------------------
            GLB ANIMATION MIXER
            -------------------------------------------------
            */

            if (mixer) {

                mixer.update(
                    0.016
                );

            }


            /*
            -------------------------------------------------
            CAST
            -------------------------------------------------
            */

            updateCast(
                0.016
            );


            /*
            -------------------------------------------------
            IDLE LIGHT
            -------------------------------------------------
            */

            if (
                !casting &&
                purpleLight
            ) {

                purpleLight.intensity =
                    2.5 +
                    Math.sin(
                        time * 3
                    ) * 0.5;

            }


            if (
                !casting &&
                cyanLight
            ) {

                cyanLight.intensity =
                    1.5 +
                    Math.sin(
                        time * 4
                    ) * 0.4;

            }

        };


    return wizardGroup;

}
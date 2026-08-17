import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";


export function createWizard(scene) {

    /*
    =====================================================
    WIZARD ROOT
    =====================================================
    */

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


    /*
    =====================================================
    GLB
    =====================================================
    */

    let wizardModel = null;

    let mixer = null;

    let animations = [];

    let idleAction = null;

    let castAction = null;

    let currentAction = null;


    /*
    =====================================================
    STAFF
    =====================================================
    */

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

    const castDuration = 0.9;


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
    FIND STAFF
    =====================================================
    */

    function findStaff(object) {

        object.traverse(
            (child) => {

                if (!child.isMesh) {

                    return;

                }


                const name =
                    child.name.toLowerCase();


                if (
                    name.includes("staffgem") ||
                    name.includes("staff_gem") ||
                    name.includes("gem")
                ) {

                    if (!staffGem) {

                        staffGem =
                            child;

                    }

                }


                if (
                    name === "staff" ||
                    name.includes("staff")
                ) {

                    if (!staff) {

                        staff =
                            child;

                    }

                }

            }
        );


        /*
        If the GLB has no names,
        use mesh order as fallback.
        */

        if (!staff || !staffGem) {

            let meshes = [];


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
            Previous OBJ structure:

            10 = Staff
            11 = Staff Gem
            */

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

        }


        if (staff) {

            staff.name =
                "Staff";

        }


        if (staffGem) {

            staffGem.name =
                "StaffGem";

        }


        console.log(
            "Staff:",
            staff
        );


        console.log(
            "Staff Gem:",
            staffGem
        );

    }


    /*
    =====================================================
    FIND ANIMATIONS
    =====================================================
    */

    function setupAnimations(
        gltf
    ) {

        animations =
            gltf.animations || [];


        console.log(
            "GLB animations:",
            animations.length
        );


        animations.forEach(
            (clip, index) => {

                console.log(
                    "Animation",
                    index,
                    ":",
                    clip.name,
                    "duration:",
                    clip.duration
                );

            }
        );


        if (
            !wizardModel ||
            animations.length === 0
        ) {

            console.log(
                "No embedded animations found."
            );

            return;

        }


        mixer =
            new THREE.AnimationMixer(
                wizardModel
            );


        /*
        Try to identify animations
        by their names.
        */

        const idleClip =
            animations.find(
                (clip) => {

                    const name =
                        clip.name.toLowerCase();

                    return (
                        name.includes("idle")
                    );

                }
            );


        const castClip =
            animations.find(
                (clip) => {

                    const name =
                        clip.name.toLowerCase();

                    return (
                        name.includes("cast") ||
                        name.includes("attack") ||
                        name.includes("spell") ||
                        name.includes("lightning") ||
                        name.includes("shoot")
                    );

                }
            );


        if (idleClip) {

            idleAction =
                mixer.clipAction(
                    idleClip
                );

        }


        if (castClip) {

            castAction =
                mixer.clipAction(
                    castClip
                );

        }


        /*
        If there is only one animation,
        use it as idle.
        */

        if (
            animations.length === 1 &&
            !idleAction
        ) {

            idleAction =
                mixer.clipAction(
                    animations[0]
                );

        }


        /*
        Start idle.
        */

        if (idleAction) {

            idleAction.play();

            currentAction =
                idleAction;

        }


        console.log(
            "Wizard animation system ready"
        );

    }


    /*
    =====================================================
    PLAY CAST ANIMATION
    =====================================================
    */

    function playCastAnimation() {

        if (
            !mixer ||
            !castAction
        ) {

            return;

        }


        if (
            currentAction &&
            currentAction !== castAction
        ) {

            currentAction.fadeOut(
                0.12
            );

        }


        castAction.reset();

        castAction.setLoop(
            THREE.LoopOnce,
            1
        );

        castAction.clampWhenFinished =
            true;

        castAction.fadeIn(
            0.12
        );

        castAction.play();

        currentAction =
            castAction;


        /*
        Return to idle
        after the animation.
        */

        const duration =
            castAction.getClip()
                .duration;


        setTimeout(
            () => {

                if (
                    !casting &&
                    idleAction
                ) {

                    castAction.fadeOut(
                        0.12
                    );

                    idleAction.reset();

                    idleAction.fadeIn(
                        0.12
                    );

                    idleAction.play();

                    currentAction =
                        idleAction;

                }

            },
            duration * 1000
        );

    }


    /*
    =====================================================
    STAFF WORLD POSITION
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


        /*
        Fallback
        */

        wizardGroup
            .getWorldPosition(
                position
            );


        position.y += 3;

        return position;

    }


    /*
    =====================================================
    FORWARD DIRECTION
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


        casting =
            true;

        castTimer =
            0;


        console.log(
            "⚡ ARCANE CAST"
        );


        playCastAnimation();

    }


    /*
    =====================================================
    LIGHTNING
    =====================================================
    */

    function castLightning() {

        /*
        Remove previous lightning.
        */

        if (lightning) {

            scene.remove(
                lightning
            );

            lightning =
                null;

        }


        const group =
            new THREE.Group();


        /*
        Start exactly at staff.
        */

        const start =
            getStaffPosition();


        /*
        Forward from wizard.
        */

        const direction =
            getForwardDirection();


        const distance =
            14;


        const end =
            start.clone().add(
                direction
                    .clone()
                    .multiplyScalar(
                        distance
                    )
            );


        /*
        =================================================
        ZIGZAG
        =================================================
        */

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
                        0.2
                    );


                side.applyQuaternion(
                    wizardGroup.quaternion
                );


                point.add(
                    side.multiplyScalar(
                        (
                            Math.random() -
                            0.5
                        ) * 0.55
                    )
                );


                point.y +=
                    (
                        Math.random() -
                        0.5
                    ) * 0.5;

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
        =================================================
        CORE
        =================================================
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
        =================================================
        PURPLE GLOW
        =================================================
        */

        const glow =
            new THREE.Line(
                geometry,
                new THREE.LineBasicMaterial({

                    color: 0x714cff,

                    transparent: true,

                    opacity: 0.5

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
        =================================================
        LIGHT FLASH
        =================================================
        */

        const flash =
            new THREE.PointLight(
                0x805cff,
                12,
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


        /*
        =================================================
        MAGIC LIGHT PULSE
        =================================================
        */

        if (purpleLight) {

            purpleLight.intensity =
                12;

        }


        if (cyanLight) {

            cyanLight.intensity =
                8;

        }


        /*
        =================================================
        REMOVE LIGHTNING
        =================================================
        */

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
            180
        );

    }


    /*
    =====================================================
    CAST UPDATE
    =====================================================
    */

    function updateCast(
        delta
    ) {

        if (!casting) {

            return;

        }


        castTimer +=
            delta;


        /*
        Lightning fires
        roughly halfway through
        the casting motion.
        */

        if (
            castTimer >= 0.45 &&
            castTimer - delta < 0.45
        ) {

            castLightning();

        }


        /*
        Finish procedural cast timer.

        The actual hand movement
        comes from the GLB animation.
        */

        if (
            castTimer >= castDuration
        ) {

            casting =
                false;

            castTimer =
                0;


            if (
                purpleLight
            ) {

                purpleLight.intensity =
                    2.5;

            }


            if (
                cyanLight
            ) {

                cyanLight.intensity =
                    1.5;

            }


            /*
            Return to idle animation.
            */

            if (
                idleAction &&
                castAction
            ) {

                castAction.fadeOut(
                    0.12
                );

                idleAction.reset();

                idleAction.fadeIn(
                    0.12
                );

                idleAction.play();

                currentAction =
                    idleAction;

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
            =================================================
            MODEL
            =================================================
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


            /*
            =================================================
            ADD MODEL
            =================================================
            */

            wizardGroup.add(
                wizardModel
            );


            /*
            =================================================
            FIND STAFF
            =================================================
            */

            findStaff(
                wizardModel
            );


            /*
            =================================================
            ANIMATIONS
            =================================================
            */

            setupAnimations(
                gltf
            );


            /*
            =================================================
            MAGIC LIGHT
            =================================================
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
                "Arcane Wizard ready"
            );

        },


        /*
        =================================================
        PROGRESS
        =================================================
        */

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


        /*
        =================================================
        ERROR
        =================================================
        */

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
            =================================================
            MOVEMENT
            =================================================
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
                    difference *
                    0.15;

            }


            /*
            =================================================
            IDLE FLOAT
            =================================================
            */

            if (!casting) {

                wizardGroup.position.y =
                    Math.sin(
                        time * 1.5
                    ) * 0.04;

            }


            /*
            =================================================
            GLB ANIMATION MIXER
            =================================================
            */

            if (mixer) {

                mixer.update(
                    0.016
                );

            }


            /*
            =================================================
            CAST
            =================================================
            */

            updateCast(
                0.016
            );


            /*
            =================================================
            MAGIC PULSE
            =================================================
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
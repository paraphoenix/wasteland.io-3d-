import * as THREE from "three";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";


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
    WIZARD PARTS
    =====================================================
    */

    let staff = null;
    let staffGem = null;
    let leftHand = null;          // new – left hand mesh (if found)


    /*
    =====================================================
    SPELL STATE
    =====================================================
    */

    let casting = false;
    let castTime = 0;
    const castDuration = 0.75;
    let spell = null;


    /*
    =====================================================
    MAGIC LIGHTS
    =====================================================
    */

    let purpleLight = null;
    let cyanLight = null;


    /*
    =====================================================
    KEYBOARD
    =====================================================
    */

    window.addEventListener("keydown", (event) => {
        const key = event.key.toLowerCase();

        if (key === "w" || key === "a" || key === "s" || key === "d") {
            keys[key] = true;
        }

        if (key === "e" && !event.repeat) {
            castLightning();
        }
    });

    window.addEventListener("keyup", (event) => {
        const key = event.key.toLowerCase();

        if (key === "w" || key === "a" || key === "s" || key === "d") {
            keys[key] = false;
        }
    });


    /*
    =====================================================
    FIND WIZARD PARTS
    =====================================================
    */

    function findParts(object) {
        let partNumber = 0;

        object.traverse((child) => {
            if (!child.isMesh) return;

            partNumber++;

            // existing staff references
            if (partNumber === 10) staff = child;
            if (partNumber === 11) staffGem = child;

            // try to catch a left-hand mesh by name (common in many models)
            const name = (child.name || "").toLowerCase();
            if (
                (name.includes("hand") || name.includes("palm") || name.includes("wrist")) &&
                (name.includes("left") || name.includes("l_") || name.includes("_l"))
            ) {
                leftHand = child;
            }

            // fallback – you can change this number after inspecting the console
            if (partNumber === 6 && !leftHand) {
                leftHand = child;
            }
        });

        console.log("Staff:", staff);
        console.log("Staff Gem:", staffGem);
        console.log("Left Hand:", leftHand);
    }


    /*
    =====================================================
    GET LEFT HAND WORLD POSITION
    =====================================================
    */

    function getLeftHandPosition() {
        // Prefer the actual mesh if we found it
        if (leftHand) {
            const pos = new THREE.Vector3();
            leftHand.getWorldPosition(pos);
            return pos;
        }

        // Fallback – approximate left-hand location relative to the wizard
        // (height ~ chest / shoulder, offset to the left side)
        const localOffset = new THREE.Vector3(-1.35, 2.55, 0.15);
        localOffset.applyQuaternion(wizardGroup.quaternion);

        return wizardGroup.position.clone().add(localOffset);
    }


    /*
    =====================================================
    GET WIZARD FORWARD
    =====================================================
    */

    function getForwardDirection() {
        const direction = new THREE.Vector3(0, 0, -1);
        direction.applyQuaternion(wizardGroup.quaternion);
        direction.normalize();
        return direction;
    }


    /*
    =====================================================
    CAST LIGHTNING
    =====================================================
    */

    function castLightning() {
        if (casting) return;

        casting = true;
        castTime = 0;

        console.log("⚡ CASTING LIGHTNING FROM LEFT HAND");

        createLightning();
    }


    /*
    =====================================================
    CREATE LIGHTNING
    =====================================================
    */

    function createLightning() {
        if (spell) {
            scene.remove(spell);
            spell = null;
        }

        const group = new THREE.Group();

        const start = getLeftHandPosition();          // ← now from left hand
        const direction = getForwardDirection();

        const distance = 14;
        const speed = 28;

        /*
        =================================================
        CORE
        =================================================
        */

        const boltGeometry = new THREE.BufferGeometry();
        const positions = new Float32Array(2 * 3);

        positions[0] = start.x;
        positions[1] = start.y;
        positions[2] = start.z;
        positions[3] = start.x;
        positions[4] = start.y;
        positions[5] = start.z;

        boltGeometry.setAttribute(
            "position",
            new THREE.BufferAttribute(positions, 3)
        );

        const coreMaterial = new THREE.LineBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 1
        });

        const core = new THREE.Line(boltGeometry, coreMaterial);
        group.add(core);

        /*
        =================================================
        GLOW
        =================================================
        */

        const glowMaterial = new THREE.LineBasicMaterial({
            color: 0x704cff,
            transparent: true,
            opacity: 0.6
        });

        const glow = new THREE.Line(boltGeometry, glowMaterial);
        group.add(glow);

        /*
        =================================================
        LIGHT
        =================================================
        */

        const light = new THREE.PointLight(0x8d6cff, 5, 8);
        light.position.copy(start);
        group.add(light);

        /*
        =================================================
        SPELL DATA
        =================================================
        */

        group.userData.start = start.clone();
        group.userData.direction = direction.clone();
        group.userData.distance = distance;
        group.userData.speed = speed;
        group.userData.travel = 0;
        group.userData.core = core;
        group.userData.glow = glow;
        group.userData.light = light;
        group.userData.life = 0;

        /*
        =================================================
        SPELL UPDATE
        =================================================
        */

        group.userData.update = function (delta) {
            this.travel += this.speed * delta;

            const traveled = Math.min(this.travel, this.distance);

            const head = this.start
                .clone()
                .add(this.direction.clone().multiplyScalar(traveled));

            // Lightning zigzag
            const points = [];
            const segments = 12;

            for (let i = 0; i <= segments; i++) {
                const t = i / segments;
                const point = new THREE.Vector3().lerpVectors(this.start, head, t);

                if (i !== 0 && i !== segments) {
                    const side = new THREE.Vector3(1, 0.4, 0.2);
                    side.applyQuaternion(wizardGroup.quaternion);
                    point.add(side.multiplyScalar((Math.random() - 0.5) * 0.45));
                }

                points.push(point);
            }

            const array = new Float32Array(points.length * 3);
            for (let i = 0; i < points.length; i++) {
                array[i * 3] = points[i].x;
                array[i * 3 + 1] = points[i].y;
                array[i * 3 + 2] = points[i].z;
            }

            this.core.geometry.setAttribute(
                "position",
                new THREE.BufferAttribute(array, 3)
            );
            this.core.geometry.attributes.position.needsUpdate = true;
            this.glow.geometry = this.core.geometry;

            this.light.position.copy(head);
            this.light.intensity = 3 + Math.random() * 5;

            if (this.travel >= this.distance) {
                this.life += delta;
                if (this.life > 0.08) {
                    scene.remove(spell);
                    spell = null;
                }
            }
        };

        scene.add(group);
        spell = group;
    }


    /*
    =====================================================
    LOAD MATERIAL
    =====================================================
    */

    const mtlLoader = new MTLLoader();

    mtlLoader.load(
        "/models/character/arcane_wizard.mtl",

        (materials) => {
            materials.preload();

            const objLoader = new OBJLoader();
            objLoader.setMaterials(materials);

            objLoader.load(
                "/models/character/arcane_wizard.obj",

                (object) => {
                    console.log("Arcane Wizard loaded");

                    findParts(object);

                    // Shadows + flat shading
                    object.traverse((child) => {
                        if (child.isMesh) {
                            child.castShadow = true;
                            child.receiveShadow = true;

                            if (child.material) {
                                child.material.flatShading = true;
                                child.material.needsUpdate = true;
                            }
                        }
                    });

                    wizardGroup.add(object);

                    // Purple light
                    purpleLight = new THREE.PointLight(0x7b4dff, 2.5, 8);
                    purpleLight.position.set(0, 3, 1);
                    wizardGroup.add(purpleLight);

                    // Cyan light
                    cyanLight = new THREE.PointLight(0x00eaff, 1.5, 7);
                    cyanLight.position.set(-2, 2, 1);
                    wizardGroup.add(cyanLight);


                    /*
                    =================================================
                    UPDATE
                    =================================================
                    */

                    wizardGroup.userData.update = function (time) {

                        // ---------- MOVEMENT ----------
                        const direction = new THREE.Vector3();

                        if (keys.w) direction.z -= 1;
                        if (keys.s) direction.z += 1;
                        if (keys.a) direction.x -= 1;
                        if (keys.d) direction.x += 1;

                        if (direction.lengthSq() > 0) {
                            direction.normalize();

                            wizardGroup.position.x += direction.x * movementSpeed * 0.016;
                            wizardGroup.position.z += direction.z * movementSpeed * 0.016;

                            const targetRotation = Math.atan2(direction.x, direction.z);
                            let difference = targetRotation - wizardGroup.rotation.y;
                            difference = Math.atan2(Math.sin(difference), Math.cos(difference));
                            wizardGroup.rotation.y += difference * 0.15;
                        }

                        // ---------- IDLE FLOAT ----------
                        if (!casting) {
                            wizardGroup.position.y = Math.sin(time * 1.5) * 0.04;
                        }

                        // ---------- CASTING + LEFT HAND ROTATION ----------
                        if (casting) {
                            castTime += 0.016;

                            // Spin / rotate the left hand while casting
                            if (leftHand) {
                                leftHand.rotation.z += 0.25;          // continuous spin
                                // optional extra motion:
                                // leftHand.rotation.x = Math.sin(time * 12) * 0.4;
                            }

                            if (purpleLight) {
                                purpleLight.intensity = 4 + Math.sin(time * 15) * 1.5;
                            }
                            if (cyanLight) {
                                cyanLight.intensity = 3 + Math.sin(time * 18) * 1.2;
                            }

                            if (castTime >= castDuration) {
                                casting = false;
                                castTime = 0;

                                // Reset hand rotation when cast ends
                                if (leftHand) {
                                    leftHand.rotation.set(0, 0, 0);
                                }
                            }
                        }

                        // ---------- UPDATE LIGHTNING ----------
                        if (spell && spell.userData.update) {
                            spell.userData.update(0.016);
                        }

                        // ---------- NORMAL MAGIC LIGHTS ----------
                        if (!casting && purpleLight) {
                            purpleLight.intensity = 2.5 + Math.sin(time * 3) * 0.5;
                        }
                        if (!casting && cyanLight) {
                            cyanLight.intensity = 1.5 + Math.sin(time * 4) * 0.4;
                        }
                    };
                },

                (xhr) => {
                    if (xhr.total > 0) {
                        console.log(
                            "Wizard OBJ:",
                            Math.round((xhr.loaded / xhr.total) * 100) + "%"
                        );
                    }
                },

                (error) => {
                    console.error("Wizard OBJ loading failed:", error);
                }
            );
        },

        undefined,

        (error) => {
            console.error("Wizard MTL loading failed:", error);
        }
    );

    return wizardGroup;
}
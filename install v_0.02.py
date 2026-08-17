from pathlib import Path
import sys

PROJECT_NAME = "arcane-wilds"
ROOT = Path.cwd() / PROJECT_NAME


FILES = {

    # =====================================================
    # MAIN
    # =====================================================

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


/*
=========================================================
ENGINE
=========================================================
*/

const scene = createScene();

const camera = createCamera();

const renderer = createRenderer();

document
    .getElementById("app")
    .appendChild(renderer.domElement);

createLighting(scene);


/*
=========================================================
CONTROLS
=========================================================
*/

const controls = new OrbitControls(
    camera,
    renderer.domElement
);

controls.enableDamping = true;
controls.dampingFactor = 0.05;

controls.minDistance = 5;
controls.maxDistance = 35;

controls.maxPolarAngle =
    Math.PI / 2.05;

controls.target.set(
    0,
    1.5,
    0
);


/*
=========================================================
ENVIRONMENT
=========================================================
*/

createGround(scene);

createMountains(scene);

createTrees(scene);

createRocks(scene);

createCrystals(scene);

createMushrooms(scene);

createAncientRuins(scene);

createMagicalParticles(scene);


/*
=========================================================
MAGIC
=========================================================
*/

createRuneCircle(scene);

createMagicOrbs(scene);


/*
=========================================================
ANIMATION
=========================================================
*/

const clock = new THREE.Clock();

function animate() {

    requestAnimationFrame(animate);

    const time =
        clock.getElapsedTime();

    controls.update();

    scene.traverse((object) => {

        if (
            object.userData &&
            typeof object.userData.update === "function"
        ) {
            object.userData.update(time);
        }

    });

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
''',


    # =====================================================
    # GROUND
    # =====================================================

    "src/environment/Ground.js": r'''
import * as THREE from "three";


export function createGround(scene) {

    const geometry =
        new THREE.CircleGeometry(
            25,
            32
        );


    const material =
        new THREE.MeshStandardMaterial({

            color: 0x101b20,

            roughness: 0.95,

            flatShading: true
        });


    const ground =
        new THREE.Mesh(
            geometry,
            material
        );


    ground.rotation.x =
        -Math.PI / 2;


    ground.receiveShadow = true;


    scene.add(ground);


    return ground;
}
''',


    # =====================================================
    # TREES
    # =====================================================

    "src/environment/Trees.js": r'''
import * as THREE from "three";


function random(min, max) {

    return min +
        Math.random() *
        (max - min);
}


function createTree(
    scene,
    x,
    z,
    scale
) {

    const tree =
        new THREE.Group();


    /*
    TRUNK
    */

    const trunkGeometry =
        new THREE.CylinderGeometry(
            0.18 * scale,
            0.32 * scale,
            2.5 * scale,
            6
        );


    const trunkMaterial =
        new THREE.MeshStandardMaterial({

            color: 0x39271e,

            roughness: 0.9,

            flatShading: true
        });


    const trunk =
        new THREE.Mesh(
            trunkGeometry,
            trunkMaterial
        );


    trunk.position.y =
        1.25 * scale;


    trunk.castShadow = true;


    tree.add(trunk);


    /*
    FOLIAGE
    */

    const leafMaterial =
        new THREE.MeshStandardMaterial({

            color: 0x14312d,

            roughness: 0.9,

            flatShading: true
        });


    const lower =
        new THREE.Mesh(
            new THREE.ConeGeometry(
                1.5 * scale,
                2.5 * scale,
                7
            ),
            leafMaterial
        );


    lower.position.y =
        2.5 * scale;


    lower.castShadow = true;


    tree.add(lower);


    const middle =
        new THREE.Mesh(
            new THREE.ConeGeometry(
                1.15 * scale,
                2.1 * scale,
                7
            ),
            leafMaterial
        );


    middle.position.y =
        3.8 * scale;


    middle.castShadow = true;


    tree.add(middle);


    const top =
        new THREE.Mesh(
            new THREE.ConeGeometry(
                0.75 * scale,
                1.7 * scale,
                7
            ),
            leafMaterial
        );


    top.position.y =
        4.9 * scale;


    top.castShadow = true;


    tree.add(top);


    /*
    POSITION
    */

    tree.position.set(
        x,
        0,
        z
    );


    tree.rotation.y =
        random(0, Math.PI);


    scene.add(tree);


    return tree;
}


export function createTrees(scene) {

    const trees = [];


    for (let i = 0; i < 28; i++) {

        const angle =
            Math.random() *
            Math.PI *
            2;


        const radius =
            random(8, 23);


        const x =
            Math.cos(angle) *
            radius;


        const z =
            Math.sin(angle) *
            radius;


        const scale =
            random(0.8, 1.5);


        trees.push(
            createTree(
                scene,
                x,
                z,
                scale
            )
        );
    }


    return trees;
}
''',


    # =====================================================
    # ROCKS
    # =====================================================

    "src/environment/Rocks.js": r'''
import * as THREE from "three";


function random(min, max) {

    return min +
        Math.random() *
        (max - min);
}


export function createRocks(scene) {

    const material =
        new THREE.MeshStandardMaterial({

            color: 0x303743,

            roughness: 1,

            flatShading: true
        });


    const rocks = [];


    for (let i = 0; i < 45; i++) {

        const geometry =
            new THREE.DodecahedronGeometry(
                random(0.35, 0.7),
                0
            );


        const rock =
            new THREE.Mesh(
                geometry,
                material
            );


        const angle =
            Math.random() *
            Math.PI *
            2;


        const radius =
            random(5, 23);


        rock.position.set(

            Math.cos(angle) *
                radius,

            random(0.2, 0.5),

            Math.sin(angle) *
                radius
        );


        rock.scale.set(

            random(0.8, 1.5),

            random(0.5, 1.1),

            random(0.8, 1.4)
        );


        rock.rotation.set(

            random(0, Math.PI),

            random(0, Math.PI),

            random(0, Math.PI)
        );


        rock.castShadow = true;

        rock.receiveShadow = true;


        scene.add(rock);

        rocks.push(rock);
    }


    return rocks;
}
''',


    # =====================================================
    # CRYSTALS
    # =====================================================

    "src/environment/Crystals.js": r'''
import * as THREE from "three";


function random(min, max) {

    return min +
        Math.random() *
        (max - min);
}


const crystalMaterial =
    new THREE.MeshStandardMaterial({

        color: 0x55ddff,

        emissive: 0x159dff,

        emissiveIntensity: 1.8,

        roughness: 0.15,

        metalness: 0.1,

        flatShading: true
    });


function createCluster(
    scene,
    x,
    z,
    scale
) {

    const group =
        new THREE.Group();


    for (let i = 0; i < 5; i++) {

        const crystal =
            new THREE.Mesh(

                new THREE.OctahedronGeometry(
                    random(0.25, 0.55) *
                    scale,
                    0
                ),

                crystalMaterial
            );


        crystal.position.set(

            random(-0.5, 0.5) *
                scale,

            random(0.3, 0.9) *
                scale,

            random(-0.5, 0.5) *
                scale
        );


        crystal.scale.y =
            random(1.4, 2.6);


        crystal.rotation.y =
            random(0, Math.PI);


        crystal.castShadow = true;


        group.add(crystal);
    }


    group.position.set(
        x,
        0,
        z
    );


    scene.add(group);


    const light =
        new THREE.PointLight(
            0x00d9ff,
            2.5,
            7
        );


    light.position.set(
        x,
        1.2,
        z
    );


    scene.add(light);


    group.userData.update =
        function(time) {

            group.rotation.y =
                time * 0.08;


            light.intensity =
                2.2 +
                Math.sin(
                    time * 3
                ) * 0.6;
        };


    return group;
}


export function createCrystals(scene) {

    const clusters = [];


    clusters.push(
        createCluster(
            scene,
            -5,
            -2,
            1.5
        )
    );


    clusters.push(
        createCluster(
            scene,
            5,
            -5,
            1.2
        )
    );


    clusters.push(
        createCluster(
            scene,
            -8,
            6,
            1
        )
    );


    clusters.push(
        createCluster(
            scene,
            7,
            7,
            0.9
        )
    );


    return clusters;
}
''',


    # =====================================================
    # MUSHROOMS
    # =====================================================

    "src/environment/Mushrooms.js": r'''
import * as THREE from "three";


function createMushroom(
    scene,
    x,
    z,
    scale
) {

    const group =
        new THREE.Group();


    const stem =
        new THREE.Mesh(

            new THREE.CylinderGeometry(
                0.1 * scale,
                0.16 * scale,
                0.55 * scale,
                6
            ),

            new THREE.MeshStandardMaterial({

                color: 0xc7cad3,

                roughness: 0.8,

                flatShading: true
            })
        );


    stem.position.y =
        0.27 * scale;


    group.add(stem);


    const cap =
        new THREE.Mesh(

            new THREE.ConeGeometry(
                0.42 * scale,
                0.3 * scale,
                8
            ),

            new THREE.MeshStandardMaterial({

                color: 0x704cff,

                emissive: 0x3514a0,

                emissiveIntensity: 1.2,

                flatShading: true
            })
        );


    cap.position.y =
        0.62 * scale;


    group.add(cap);


    group.position.set(
        x,
        0,
        z
    );


    scene.add(group);


    const light =
        new THREE.PointLight(
            0x8a5cff,
            0.5,
            3
        );


    light.position.set(
        x,
        0.6,
        z
    );


    scene.add(light);


    return group;
}


export function createMushrooms(scene) {

    const mushrooms = [];


    for (let i = 0; i < 30; i++) {

        const angle =
            Math.random() *
            Math.PI *
            2;


        const radius =
            5 +
            Math.random() * 17;


        mushrooms.push(

            createMushroom(

                scene,

                Math.cos(angle) *
                    radius,

                Math.sin(angle) *
                    radius,

                0.5 +
                    Math.random() *
                    0.8
            )
        );
    }


    return mushrooms;
}
''',


    # =====================================================
    # MOUNTAINS
    # =====================================================

    "src/environment/Mountains.js": r'''
import * as THREE from "three";


export function createMountains(scene) {

    const material =
        new THREE.MeshStandardMaterial({

            color: 0x101827,

            roughness: 1,

            flatShading: true
        });


    for (let i = 0; i < 14; i++) {

        const mountain =
            new THREE.Mesh(

                new THREE.ConeGeometry(

                    3 +
                        Math.random() * 3,

                    7 +
                        Math.random() * 6,

                    6
                ),

                material
            );


        const angle =
            (i / 14) *
            Math.PI *
            2;


        const radius = 25;


        mountain.position.set(

            Math.cos(angle) *
                radius,

            3,

            Math.sin(angle) *
                radius
        );


        mountain.rotation.y =
            Math.random() *
            Math.PI;


        scene.add(mountain);
    }
}
''',


    # =====================================================
    # ANCIENT RUINS
    # =====================================================

    "src/environment/AncientRuins.js": r'''
import * as THREE from "three";


export function createAncientRuins(scene) {

    const material =
        new THREE.MeshStandardMaterial({

            color: 0x34394b,

            roughness: 1,

            flatShading: true
        });


    for (let i = 0; i < 9; i++) {

        const stone =
            new THREE.Mesh(

                new THREE.CylinderGeometry(

                    0.4,

                    0.6,

                    1 +
                        Math.random(),

                    6
                ),

                material
            );


        const angle =
            (i / 9) *
            Math.PI *
            2;


        const radius = 4.3;


        stone.position.set(

            Math.cos(angle) *
                radius,

            0.7,

            Math.sin(angle) *
                radius
        );


        stone.rotation.y =
            Math.random() *
            Math.PI;


        stone.rotation.z =
            -0.15 +
            Math.random() *
            0.3;


        stone.castShadow = true;


        scene.add(stone);
    }
}
''',


    # =====================================================
    # MAGICAL PARTICLES
    # =====================================================

    "src/environment/MagicalParticles.js": r'''
import * as THREE from "three";


export function createMagicalParticles(scene) {

    const count = 500;


    const geometry =
        new THREE.BufferGeometry();


    const positions =
        new Float32Array(
            count * 3
        );


    const speeds = [];


    for (let i = 0; i < count; i++) {

        positions[i * 3] =
            -20 +
            Math.random() * 40;


        positions[i * 3 + 1] =
            0.2 +
            Math.random() * 8;


        positions[i * 3 + 2] =
            -20 +
            Math.random() * 40;


        speeds.push(
            0.2 +
            Math.random() * 0.8
        );
    }


    geometry.setAttribute(

        "position",

        new THREE.BufferAttribute(
            positions,
            3
        )
    );


    const material =
        new THREE.PointsMaterial({

            color: 0x70eaff,

            size: 0.055,

            transparent: true,

            opacity: 0.75,

            blending:
                THREE.AdditiveBlending,

            depthWrite: false
        });


    const particles =
        new THREE.Points(
            geometry,
            material
        );


    scene.add(particles);


    particles.userData.update =
        function() {

            const array =
                geometry
                    .attributes
                    .position
                    .array;


            for (
                let i = 0;
                i < count;
                i++
            ) {

                array[i * 3 + 1] +=
                    speeds[i] *
                    0.008;


                if (
                    array[i * 3 + 1] > 8
                ) {

                    array[i * 3 + 1] =
                        0.2;
                }
            }


            geometry
                .attributes
                .position
                .needsUpdate = true;
        };


    return particles;
}
''',


    # =====================================================
    # RUNE CIRCLE
    # =====================================================

    "src/magic/RuneCircle.js": r'''
import * as THREE from "three";


export function createRuneCircle(scene) {

    const group =
        new THREE.Group();


    const material =
        new THREE.MeshBasicMaterial({

            color: 0x49dfff,

            transparent: true,

            opacity: 0.75,

            side: THREE.DoubleSide
        });


    const outer =
        new THREE.Mesh(

            new THREE.RingGeometry(
                2.2,
                2.27,
                48
            ),

            material
        );


    outer.rotation.x =
        -Math.PI / 2;


    group.add(outer);


    const inner =
        new THREE.Mesh(

            new THREE.RingGeometry(
                1.45,
                1.52,
                32
            ),

            material
        );


    inner.rotation.x =
        -Math.PI / 2;


    group.add(inner);


    for (let i = 0; i < 12; i++) {

        const rune =
            new THREE.Mesh(

                new THREE.BoxGeometry(
                    0.12,
                    0.03,
                    0.45
                ),

                material
            );


        const angle =
            (i / 12) *
            Math.PI *
            2;


        rune.position.set(

            Math.cos(angle) *
                1.85,

            0.035,

            Math.sin(angle) *
                1.85
        );


        rune.rotation.y =
            -angle;


        group.add(rune);
    }


    group.userData.update =
        function(time) {

            outer.rotation.z =
                time * 0.15;


            inner.rotation.z =
                -time * 0.3;


            group.scale.setScalar(

                1 +
                Math.sin(time * 2) *
                0.025
            );
        };


    scene.add(group);


    return group;
}
''',


    # =====================================================
    # MAGIC ORBS
    # =====================================================

    "src/magic/MagicOrbs.js": r'''
import * as THREE from "three";


export function createMagicOrbs(scene) {

    const group =
        new THREE.Group();


    const material =
        new THREE.MeshBasicMaterial({
            color: 0x9c7cff
        });


    for (let i = 0; i < 20; i++) {

        const orb =
            new THREE.Mesh(

                new THREE.SphereGeometry(
                    0.04 +
                    Math.random() * 0.07,

                    6,

                    6
                ),

                material
            );


        orb.position.set(

            -10 +
                Math.random() * 20,

            1 +
                Math.random() * 6,

            -10 +
                Math.random() * 20
        );


        orb.userData.offset =
            Math.random() *
            Math.PI *
            2;


        group.add(orb);
    }


    group.userData.update =
        function(time) {

            group.children.forEach(
                (orb) => {

                    orb.position.y +=

                        Math.sin(

                            time * 1.5 +
                            orb.userData.offset

                        ) * 0.003;

                }
            );
        };


    scene.add(group);


    return group;
}
'''
}


def install():

    print()
    print("==========================================")
    print("       ARCANE WILDS v0.02 INSTALLER")
    print("==========================================")
    print()


    if not ROOT.exists():

        print("ERROR:")
        print()

        print(
            "The arcane-wilds project was not found."
        )

        print()

        print(
            "Run this script from the folder"
        )

        print(
            "that contains the arcane-wilds folder."
        )

        print()

        print(
            "Expected:"
        )

        print(
            "wasteland.io/"
        )

        print(
            "    arcane-wilds/"
        )

        print()

        sys.exit(1)


    print(
        "Updating project:"
    )

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
    print("==========================================")
    print("       ARCANE WILDS v0.02 READY")
    print("==========================================")
    print()

    print("Installed:")
    print()

    print("  Ground")
    print("  Mountains")
    print("  Trees")
    print("  Rocks")
    print("  Magical Crystals")
    print("  Glowing Mushrooms")
    print("  Ancient Ruins")
    print("  Magical Particles")
    print("  Rune Circle")
    print("  Floating Magic Orbs")

    print()

    print("Start the game:")
    print()

    print("  cd arcane-wilds")
    print("  npm run dev")

    print()

    print("Version: 0.02.0")
    print()


if __name__ == "__main__":

    install()

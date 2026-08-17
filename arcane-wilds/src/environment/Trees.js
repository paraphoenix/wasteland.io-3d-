
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

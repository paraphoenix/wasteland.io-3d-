
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

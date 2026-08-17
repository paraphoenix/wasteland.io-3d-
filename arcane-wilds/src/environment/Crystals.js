
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

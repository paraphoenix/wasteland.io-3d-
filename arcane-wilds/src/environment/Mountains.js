
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

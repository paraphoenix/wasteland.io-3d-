
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

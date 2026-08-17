
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

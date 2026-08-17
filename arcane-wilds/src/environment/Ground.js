
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

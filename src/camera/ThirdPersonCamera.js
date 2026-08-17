
import * as THREE from "three";


export function createThirdPersonCamera(
    camera,
    target
) {

    const offset =
        new THREE.Vector3(
            0,
            5,
            8
        );


    const lookOffset =
        new THREE.Vector3(
            0,
            1.5,
            0
        );


    const currentPosition =
        new THREE.Vector3();


    const desiredPosition =
        new THREE.Vector3();


    const lookTarget =
        new THREE.Vector3();


    const smoothness = 0.08;


    function update() {

        desiredPosition
            .copy(target.position)
            .add(offset);


        currentPosition.lerp(
            desiredPosition,
            smoothness
        );


        camera.position.copy(
            currentPosition
        );


        lookTarget
            .copy(target.position)
            .add(lookOffset);


        camera.lookAt(
            lookTarget
        );
    }


    return {
        update
    };
}

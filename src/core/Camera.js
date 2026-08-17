import * as THREE from "three";

export function createCamera() {

    const camera =
        new THREE.PerspectiveCamera(
            50,
            window.innerWidth /
            window.innerHeight,
            0.1,
            1000
        );

    camera.position.set(
        10,
        7,
        14
    );

    return camera;
}

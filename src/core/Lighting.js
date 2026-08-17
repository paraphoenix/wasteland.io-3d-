import * as THREE from "three";

export function createLighting(scene) {

    const ambient =
        new THREE.AmbientLight(
            0x26345f,
            1.2
        );

    scene.add(ambient);


    const moonLight =
        new THREE.DirectionalLight(
            0x9eb7ff,
            1
        );

    moonLight.position.set(
        -10,
        18,
        -8
    );

    moonLight.castShadow = true;

    moonLight.shadow.mapSize.width =
        2048;

    moonLight.shadow.mapSize.height =
        2048;

    moonLight.shadow.camera.left =
        -25;

    moonLight.shadow.camera.right =
        25;

    moonLight.shadow.camera.top =
        25;

    moonLight.shadow.camera.bottom =
        -25;

    scene.add(moonLight);
}

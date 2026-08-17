import * as THREE from "three";

export function createScene() {

    const scene = new THREE.Scene();

    scene.background =
        new THREE.Color(0x050713);

    scene.fog =
        new THREE.FogExp2(
            0x081026,
            0.018
        );

    return scene;
}

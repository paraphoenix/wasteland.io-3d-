
import * as THREE from "three";


export function createRuneCircle(scene) {

    const group =
        new THREE.Group();


    const material =
        new THREE.MeshBasicMaterial({

            color: 0x49dfff,

            transparent: true,

            opacity: 0.75,

            side: THREE.DoubleSide
        });


    const outer =
        new THREE.Mesh(

            new THREE.RingGeometry(
                2.2,
                2.27,
                48
            ),

            material
        );


    outer.rotation.x =
        -Math.PI / 2;


    group.add(outer);


    const inner =
        new THREE.Mesh(

            new THREE.RingGeometry(
                1.45,
                1.52,
                32
            ),

            material
        );


    inner.rotation.x =
        -Math.PI / 2;


    group.add(inner);


    for (let i = 0; i < 12; i++) {

        const rune =
            new THREE.Mesh(

                new THREE.BoxGeometry(
                    0.12,
                    0.03,
                    0.45
                ),

                material
            );


        const angle =
            (i / 12) *
            Math.PI *
            2;


        rune.position.set(

            Math.cos(angle) *
                1.85,

            0.035,

            Math.sin(angle) *
                1.85
        );


        rune.rotation.y =
            -angle;


        group.add(rune);
    }


    group.userData.update =
        function(time) {

            outer.rotation.z =
                time * 0.15;


            inner.rotation.z =
                -time * 0.3;


            group.scale.setScalar(

                1 +
                Math.sin(time * 2) *
                0.025
            );
        };


    scene.add(group);


    return group;
}

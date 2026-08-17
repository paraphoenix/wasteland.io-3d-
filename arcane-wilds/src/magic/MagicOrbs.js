
import * as THREE from "three";


export function createMagicOrbs(scene) {

    const group =
        new THREE.Group();


    const material =
        new THREE.MeshBasicMaterial({
            color: 0x9c7cff
        });


    for (let i = 0; i < 20; i++) {

        const orb =
            new THREE.Mesh(

                new THREE.SphereGeometry(
                    0.04 +
                    Math.random() * 0.07,

                    6,

                    6
                ),

                material
            );


        orb.position.set(

            -10 +
                Math.random() * 20,

            1 +
                Math.random() * 6,

            -10 +
                Math.random() * 20
        );


        orb.userData.offset =
            Math.random() *
            Math.PI *
            2;


        group.add(orb);
    }


    group.userData.update =
        function(time) {

            group.children.forEach(
                (orb) => {

                    orb.position.y +=

                        Math.sin(

                            time * 1.5 +
                            orb.userData.offset

                        ) * 0.003;

                }
            );
        };


    scene.add(group);


    return group;
}

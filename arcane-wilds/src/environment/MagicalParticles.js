
import * as THREE from "three";


export function createMagicalParticles(scene) {

    const count = 500;


    const geometry =
        new THREE.BufferGeometry();


    const positions =
        new Float32Array(
            count * 3
        );


    const speeds = [];


    for (let i = 0; i < count; i++) {

        positions[i * 3] =
            -20 +
            Math.random() * 40;


        positions[i * 3 + 1] =
            0.2 +
            Math.random() * 8;


        positions[i * 3 + 2] =
            -20 +
            Math.random() * 40;


        speeds.push(
            0.2 +
            Math.random() * 0.8
        );
    }


    geometry.setAttribute(

        "position",

        new THREE.BufferAttribute(
            positions,
            3
        )
    );


    const material =
        new THREE.PointsMaterial({

            color: 0x70eaff,

            size: 0.055,

            transparent: true,

            opacity: 0.75,

            blending:
                THREE.AdditiveBlending,

            depthWrite: false
        });


    const particles =
        new THREE.Points(
            geometry,
            material
        );


    scene.add(particles);


    particles.userData.update =
        function() {

            const array =
                geometry
                    .attributes
                    .position
                    .array;


            for (
                let i = 0;
                i < count;
                i++
            ) {

                array[i * 3 + 1] +=
                    speeds[i] *
                    0.008;


                if (
                    array[i * 3 + 1] > 8
                ) {

                    array[i * 3 + 1] =
                        0.2;
                }
            }


            geometry
                .attributes
                .position
                .needsUpdate = true;
        };


    return particles;
}

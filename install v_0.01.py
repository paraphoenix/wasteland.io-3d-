from pathlib import Path
import subprocess
import sys

PROJECT_NAME = "arcane-wilds"
ROOT = Path.cwd() / PROJECT_NAME


FILES = {
    "package.json": """{
  "name": "arcane-wilds",
  "version": "0.01.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "three": "^0.128.0"
  },
  "devDependencies": {
    "vite": "^7.0.0"
  }
}
""",

    "index.html": """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Arcane Wilds v0.01</title>
</head>
<body>

    <div id="app"></div>

    <script type="module" src="/src/main.js"></script>

</body>
</html>
""",

    "src/main.js": """import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import { createScene } from "./core/Scene.js";
import { createCamera } from "./core/Camera.js";
import { createRenderer } from "./core/Renderer.js";
import { createLighting } from "./core/Lighting.js";

const scene = createScene();
const camera = createCamera();
const renderer = createRenderer();

document.getElementById("app").appendChild(
    renderer.domElement
);

createLighting(scene);

const controls = new OrbitControls(
    camera,
    renderer.domElement
);

controls.enableDamping = true;
controls.dampingFactor = 0.05;

controls.target.set(
    0,
    1,
    0
);

const clock = new THREE.Clock();

function animate() {

    requestAnimationFrame(animate);

    const delta = clock.getDelta();

    controls.update();

    renderer.render(
        scene,
        camera
    );
}

animate();

window.addEventListener(
    "resize",
    () => {

        camera.aspect =
            window.innerWidth /
            window.innerHeight;

        camera.updateProjectionMatrix();

        renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );
    }
);
""",

    "src/core/Scene.js": """import * as THREE from "three";

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
""",

    "src/core/Camera.js": """import * as THREE from "three";

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
""",

    "src/core/Renderer.js": """import * as THREE from "three";

export function createRenderer() {

    const renderer =
        new THREE.WebGLRenderer({
            antialias: true
        });

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );

    renderer.setPixelRatio(
        Math.min(
            window.devicePixelRatio,
            2
        )
    );

    renderer.shadowMap.enabled = true;

    renderer.shadowMap.type =
        THREE.PCFSoftShadowMap;

    return renderer;
}
""",

    "src/core/Lighting.js": """import * as THREE from "three";

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
"""
}


def create_project():

    print()
    print("======================================")
    print("     ARCANE WILDS v0.01 INSTALLER")
    print("======================================")
    print()

    ROOT.mkdir(
        parents=True,
        exist_ok=True
    )

    for filename, content in FILES.items():

        path = ROOT / filename

        path.parent.mkdir(
            parents=True,
            exist_ok=True
        )

        path.write_text(
            content,
            encoding="utf-8"
        )

        print("[FILE]", path)

    print()
    print("Project files created.")
    print()


def install_npm():

    print("Installing npm dependencies...")
    print()

    result = subprocess.run(
        ["npm", "install"],
        cwd=ROOT,
        shell=True
    )

    if result.returncode != 0:

        print()
        print("npm install failed.")
        print()
        print("Make sure Node.js and npm are installed.")
        sys.exit(result.returncode)

    print()
    print("npm dependencies installed.")


def main():

    create_project()

    install_npm()

    print()
    print("======================================")
    print("       ARCANE WILDS v0.01 READY")
    print("======================================")
    print()
    print("Project created at:")
    print(ROOT)
    print()
    print("Run:")
    print()
    print("cd arcane-wilds")
    print("npm run dev")
    print()
    print("Current engine:")
    print("- Three.js")
    print("- Vite")
    print("- Scene")
    print("- Camera")
    print("- Renderer")
    print("- Lighting")
    print("- OrbitControls")
    print()
    print("Next: v0.02 magical low-poly environment")
    print()


if __name__ == "__main__":
    main()

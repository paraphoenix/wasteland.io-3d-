from pathlib import Path

PROJECT_NAME = "arcane-wilds"

folders = [
    "src",
    "src/core",
    "src/environment",
    "src/magic",
    "src/characters",
    "src/world",
    "src/ui",
    "assets",
    "assets/textures",
    "assets/models",
    "assets/sounds",
]

files = {
    "index.html": """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Arcane Wilds</title>
</head>
<body>

    <div id="app"></div>

    <script type="module" src="/src/main.js"></script>

</body>
</html>
""",

    "src/main.js": """import * as THREE from "three";

console.log("Arcane Wilds v0.00");
""",

    "src/core/Scene.js": """import * as THREE from "three";

export function createScene() {
    const scene = new THREE.Scene();

    scene.background = new THREE.Color(0x050713);

    return scene;
}
""",

    "src/core/Camera.js": """import * as THREE from "three";

export function createCamera() {
    const camera = new THREE.PerspectiveCamera(
        50,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );

    camera.position.set(10, 7, 14);

    return camera;
}
""",

    "src/core/Renderer.js": """import * as THREE from "three";

export function createRenderer() {
    const renderer = new THREE.WebGLRenderer({
        antialias: true
    });

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );

    renderer.setPixelRatio(
        Math.min(window.devicePixelRatio, 2)
    );

    renderer.shadowMap.enabled = true;

    return renderer;
}
""",

    "src/core/Lighting.js": """import * as THREE from "three";

export function createLighting(scene) {
    const ambient = new THREE.AmbientLight(
        0x26345f,
        1.2
    );

    scene.add(ambient);

    const moonLight = new THREE.DirectionalLight(
        0x9eb7ff,
        1
    );

    moonLight.position.set(
        -10,
        18,
        -8
    );

    moonLight.castShadow = true;

    scene.add(moonLight);
}
""",

    "src/environment/Ground.js": """export function createGround(scene) {
    console.log("Ground system ready");
}
""",

    "src/environment/Trees.js": """export function createTrees(scene) {
    console.log("Tree system ready");
}
""",

    "src/environment/Rocks.js": """export function createRocks(scene) {
    console.log("Rock system ready");
}
""",

    "src/environment/Mountains.js": """export function createMountains(scene) {
    console.log("Mountain system ready");
}
""",

    "src/environment/Crystals.js": """export function createCrystals(scene) {
    console.log("Crystal system ready");
}
""",

    "src/environment/Mushrooms.js": """export function createMushrooms(scene) {
    console.log("Mushroom system ready");
}
""",

    "src/environment/AncientRuins.js": """export function createAncientRuins(scene) {
    console.log("Ancient ruins system ready");
}
""",

    "src/environment/MagicalParticles.js": """export function createMagicalParticles(scene) {
    console.log("Magical particle system ready");
}
""",

    "src/magic/RuneCircle.js": """export function createRuneCircle(scene) {
    console.log("Rune circle system ready");
}
""",

    "src/magic/MagicOrbs.js": """export function createMagicOrbs(scene) {
    console.log("Magic orb system ready");
}
""",

    "src/magic/MagicBeams.js": """export function createMagicBeams(scene) {
    console.log("Magic beam system ready");
}
""",

    "src/magic/MagicCrystal.js": """export function createMagicCrystal(scene) {
    console.log("Magic crystal system ready");
}
""",

    "src/characters/Wizard.js": """export function createWizard(scene) {
    console.log("Wizard character system ready");
}
""",

    "src/world/World.js": """export class World {

    constructor(scene) {
        this.scene = scene;
    }

    init() {
        console.log("World initialized");
    }

    update(delta) {
    }
}
""",

    "src/world/WorldObjects.js": """export class WorldObjects {

    constructor(scene) {
        this.scene = scene;
        this.objects = [];
    }

    add(object) {
        this.objects.push(object);
        this.scene.add(object);
    }

    clear() {
        this.objects.forEach(object => {
            this.scene.remove(object);
        });

        this.objects = [];
    }
}
""",

    "src/world/WorldGenerator.js": """export class WorldGenerator {

    constructor(scene) {
        this.scene = scene;
    }

    generate() {
        console.log("World generator ready");
    }
}
""",

    "src/ui/UI.js": """export function createUI() {
    console.log("Arcane Wilds UI ready");
}
""",

    "package.json": """{
    "name": "arcane-wilds",
    "version": "0.00.0",
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
"""
}


def create_project():
    root = Path(PROJECT_NAME)

    if root.exists():
        print(f"Project already exists: {root.resolve()}")
        return

    root.mkdir()

    print()
    print("Creating Arcane Wilds v0.00...")
    print()

    for folder in folders:
        path = root / folder
        path.mkdir(parents=True, exist_ok=True)
        print(f"[DIR]  {path}")

    for filename, content in files.items():
        path = root / filename
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(content, encoding="utf-8")
        print(f"[FILE] {path}")

    print()
    print("===================================")
    print(" Arcane Wilds v0.00 CREATED")
    print("===================================")
    print()
    print(f"Project: {root.resolve()}")
    print()
    print("Next:")
    print(f"  cd {PROJECT_NAME}")
    print("  npm install")
    print("  npm run dev")
    print()


if __name__ == "__main__":
    create_project()

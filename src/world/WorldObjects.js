export class WorldObjects {

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

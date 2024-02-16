export class TagsManager {

    constructor() {

        this.actionQueue;
        this.tagged;
        this.lights;
        this.buttons;
        this.mirrors;
        this.mirrorsShoot;
        this.triggerBoxes;
        this.cubeBox;

    }

    async Init() {
        this.actionQueue = [];
        this.tagged = [];
        this.lights = [];
        this.buttons = [];

        this.mirrors = [];
        let mirrorsShoot = [];
        for (let i = 0; i < mirrors.length; i++)
            mirrorsShoot[i] = false;
        this.mirrorsShoot = mirrorsShoot;

        let triggerBoxes = [];
        let cinematicTrigger = await SDK3DVerse.engineAPI.findEntitiesByNames('Cinematic trigger');
        triggerBoxes.push(...cinematicTrigger);
        triggerBoxes.push(...cubeBox);
        this.triggerBoxes = triggerBoxes;
    }
}
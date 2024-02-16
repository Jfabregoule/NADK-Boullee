import { sceneRefUUID } from "../../config.js";

export class FocusedBeamManager {

    constructor() {

        this.isShooting;
        this.lightTemplate;
        this.focusedBeams;
        
    }

    async Init() {

        this.isShooting = false;

        const lightTemplate = new SDK3DVerse.EntityTemplate();
        lightTemplate.attachComponent("scene_ref", { value: sceneRefUUID });
        lightTemplate.attachComponent('local_transform', { position : [0, 0, 0] });
        this.lightTemplate = lightTemplate

        this.focusedBeams = [];

    }
}
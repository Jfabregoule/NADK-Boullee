export class GameManager {

    constructor() {
        this.hasSeenCinematic;
        
        this.actionQueue;

        this.tagged;
        this.lights;
        this.buttons;
        this.mirrors;
        this.mirrorsShoot;
        this.triggerBoxes;
        
        this.tmp;
        this.firstCinematicTrigger;
        
        
        this.cubeBox;


        this.red;
        this.purple;
        this.light;


        /*
        let hasSeenCinematic = false;
        let isShooting;
        const actionQueue = [];
    
        const persos = await SDK3DVerse.engineAPI.findEntitiesByNames('Player');
        const perso = persos[0];
    
        let players = await SDK3DVerse.engineAPI.findEntitiesByNames('First Person Controller');
        let player = players[0];
        const camera = SDK3DVerse.engineAPI.cameraAPI.getActiveViewports()[0];
    
        const lightTemplate = new SDK3DVerse.EntityTemplate();
        lightTemplate.attachComponent("scene_ref", { value: '5cbfd358-45d9-4442-b4bf-dd1b4db5776f' });
        lightTemplate.attachComponent('local_transform', { position : [0, 0, 0] });
    
        let lights = [];
    
        isShooting = false;
    
        let tmp = await SDK3DVerse.engineAPI.findEntitiesByNames('Cinematic trigger');
        let FirstCinematicTrigger = tmp[0];
    
        let cubeBox = await SDK3DVerse.engineAPI.findEntitiesByNames('Cube box');
    
        let triggerBoxes = [];
        let buttons = [];
        triggerBoxes.push(...tmp);
        triggerBoxes.push(...cubeBox);
    
        let mirrors = [];
        let MirrorsShoot = [];
    
        for (let i = 0; i < mirrors.length; i++)
            MirrorsShoot[i] = false;
    
        let focusedBeams = [];
    
        let isGrabbing = false;
        let grabbedEntity;
        let grabbable = [];
    
        let isBehavior = true;
    
        let tagged = [];
    
        let enigmaDetectors;
        let enigmaEntities;
        const wall = (await SDK3DVerse.engineAPI.findEntitiesByNames('wall'))[0];
        const wall2 = (await SDK3DVerse.engineAPI.findEntitiesByNames('wall2'))[0];
        const codeInteract = (await SDK3DVerse.engineAPI.findEntitiesByNames('codeInteract'))[0]
        let red = false;
        let purple = false;
        let light = false;
        let code = ['1','2','3'];
        let codeTry = []
        let lastBtn  = null
        */
    }
}
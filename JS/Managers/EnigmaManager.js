import { Blocks } from "../Enigmas/Blocks";
import { code } from "../../config";

export class EnigmaManager {

    constructor() {

        // Button Enigma
        this.code;
        this.codeTry;
        this.codeInteract;
        this.lastBtn;

        // Wall Enigma
        this.enigmaDetectors;
        this.enigmaEntities;
        this.wallOne;
        this.wallTwo;
        this.blocks;
    }

    async Init() {

        // Button Enigma
        this.code = code;
        this.codeTry = [];
        this.codeInteract = (await SDK3DVerse.engineAPI.findEntitiesByNames('codeInteract'))[0];
        this.lastBtn = null;

        // Wall Enigma
        this.enigmaDetectors = [];
        this.enigmaEntities = [];
        this.wallOne = (await SDK3DVerse.engineAPI.findEntitiesByNames('wall'))[0];
        this.wallTwo = (await SDK3DVerse.engineAPI.findEntitiesByNames('wall2'))[0];
    }

}
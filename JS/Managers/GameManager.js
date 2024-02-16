import { CinematicManager } from "./CinematicManager.js";
import { EnemyManager } from "./EnemyManager.js";
import { EnigmaManager } from "./EnigmaManager.js";
import { FocusedBeamManager } from "./FocusedBeamManager.js";
import { GrabManager } from "./GrabManager.js";
import { PlayerManager } from "./PlayerManager.js";
import { TagsManager } from "./TagsManager.js";

export class GameManager {

    constructor() {

        this.cinematicManager;
        this.enemyManager;
        this.enigmaManager;
        this.focusedBeamManager;
        this.grabManager;
        this.playerManager;
        this.tagsManager;

    }

    async Init() {

        const cinematicManager = new CinematicManager;
        this.cinematicManager = await cinematicManager.Init();

        const enemyManager = new EnemyManager;
        this.enemyManager = await enemyManager.Init();

        const enigmaManager = new EnigmaManager;
        this.enigmaManager = await enigmaManager.Init();

        const focusedBeamManager = new FocusedBeamManager;
        this.focusedBeamManager = await focusedBeamManager.Init();

        const grabManager = new GrabManager;
        this.grabManager = await grabManager.Init();

        const playerManager = new PlayerManager;
        this.playerManager = await playerManager.Init();

        const tagsManager = new TagsManager;
        this.tagsManager = await tagsManager.Init();
    }
}
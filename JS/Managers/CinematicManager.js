export class CinematicManager {

    constructor() {
        
        this.hasSeenCinematic;
        this.firstCinematicTrigger;

    }

    async Init() {

        this.hasSeenCinematic = false;
        let cinematicTrigger = await SDK3DVerse.engineAPI.findEntitiesByNames('Cinematic trigger');
        this.firstCinematicTrigger = cinematicTrigger[0];

    }
}
export class GrabManager {

    constructor() {

        this.isGrabbing;
        this.grabbedEntity;
        this.grabbable;

    }

    async Init() {

        this.isGrabbing = false;
        this.grabbable = [];

    }
}
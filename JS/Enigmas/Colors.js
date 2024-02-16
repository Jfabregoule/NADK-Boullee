export class Colors {

    constructor() {
        this.red = false;
        this.purple = false;
        this.light = false;
    }

    toggleRed() {
        this.red = !this.red;
    }

    togglePurple() {
        this.purple = !this.purple;
    }

    toggleLight() {
        this.light = !this.light;
    }

    allTrue() {
        if(this.red && this.purple && this.light) {
            return true;
        }
        return false;
    }
}
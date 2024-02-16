export class Blocks {

    constructor() {
        this.blockOne;
        this.blockTwo;
        this.blockThree;
    }

    Init() {
        this.blockOne = false;
        this.blockTwo = false;
        this.blockThree = false;
    }

    ToggleBlockOne() {
        this.blockOne = !this.blockOne;
    }

    ToggleBlockTwo() {
        this.blockTwo = !this.blockTwo;
    }

    ToggleBlockThree() {
        this.blockThree = !this.blockThree;
    }

    IsAllTrue() {
        if(this.blockOne && this.blockTwo && this.blockThree) {
            return true;
        }
        return false;
    }
}
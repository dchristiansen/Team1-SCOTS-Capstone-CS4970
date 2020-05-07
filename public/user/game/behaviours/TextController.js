import Base from "../../engine/Base.js"


export default class Timer extends Base.Behavior {
    timer;
    text;
    constructor(timer, text) {
        super();
        this.timer = timer;
        this.text = text;
    }

    start() {}

    update() {

        if (this.timer.startTime == -1) {
            this.text.text = "Press Spacebar in time with the beat!";
        } else if (this.timer.currentCycle != 1 && this.timer.currentTime < this.timer.startTime + this.timer.soundPhaseTime / 2) {
            this.text.text = "The sound is coming back. Use this time to get back on beat!";
        } else if (this.timer.currentTime < this.timer.startTime + this.timer.soundPhaseTime / 4 * 3) {
            this.text.text = "The sound will soon fade out. Keep tapping after the sound fades out!";
        } else if (this.timer.currentTime < this.timer.startTime + this.timer.soundPhaseTime) {
            this.text.text = "The sound is fading out. Keep Tapping!";
        } else {
            this.text.text = "Keep tapping!";
        }
    }
}
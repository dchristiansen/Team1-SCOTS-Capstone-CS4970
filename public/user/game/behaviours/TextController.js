import Base from "../../engine/Base.js"


export default class Timer extends Base.Behavior {
    constructor(timer, text) {
        super();
        this.timer = timer;
        this.text = text;
    }

    start() {}

    update() {

        if (this.timer.startTime == -1){
            this.text.text = "Press Spacebar in time with the beat!";
        } else if (this.timer.currentTime < this.timer.startTime + this.timer.soundPhaseTime / 4 * 3) {
            this.text.text = "The sound will soon fade out. Keep tapping after the sound fades out!";
        } else if (this.timer.currentTime < this.timer.startTime + this.timer.soundPhaseTime){
            this.text.text = "The sound is fading out. Keep Tapping!";
        } else if (this.timer.currentTime > this.timer.startTime + this.timer.soundPhaseTime + this.timer.noSoundPhaseTime / 4 * 3 && this.timer.currentCycle != this.timer.cycles){
            this.text.text = "The sound is coming back. Use this time to get back on beat!";
        } else {
            this.text.text = "Keep tapping!";
        }
    }
}
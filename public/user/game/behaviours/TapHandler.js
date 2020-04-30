import Base from "../../engine/Base.js"
import TapInfo from "../data/TapInfo.js"
import Timer from "./Timer.js"

export default class TapHandler extends Base.Behavior {
    constructor(bpm) {
        super();
        this.beatTime = Math.round(60000 / bpm);
        this.startTime = -1;
        this.lastTap = 0;
        this.soundOn = true;
        this.side = 0;
        this.tapDataSoundOff = [];
        this.tapDataTotal = [];
        this.currentCycle = 1;
    }

    start() {
        this.timer = this.gameObject.getComponent(Timer);
    }

    tapDown() {
        let date = new Date();
        let currentTime = date.getTime();
        //First tap, set startTime to that tap
        if (this.timer.startTime == -1) {
            this.startTime = this.timer.startTimer();
            //this.startTime = this.timer.startTime;
        }
        let timing = ((currentTime - this.startTime) % this.beatTime);
        if (timing > this.beatTime / 2) {
            timing = timing - this.beatTime;
        }
        this.tapInfo = new TapInfo(currentTime - this.startTime - timing, this.beatTime, currentTime - this.startTime, "none", currentTime - this.startTime - this.lastTap, this.soundOn, this.side, this.currentCycle);
        this.lastTap = currentTime - this.startTime;

        return this.tapInfo.delta;
    }

    tapUp() {
        let date = new Date();
        let currentTime = date.getTime()
        this.tapInfo.releaseTime = currentTime - this.startTime;
        this.tapInfo.updateDuration();
        if (!this.timer.soundOn && !this.timer.gameOver)
            this.tapDataSoundOff.push(this.tapInfo);
        this.tapDataTotal.push(this.tapInfo);
        console.log(this.tapInfo);
    }
}
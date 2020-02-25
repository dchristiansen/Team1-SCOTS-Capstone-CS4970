import Base from "../../engine/Base.js"
import TapInfo from "../../TapInfo.js"

export default class TapHandler extends Base.Behavior {

    startTime = -1;
    beatTime = 0;
    lastTap = 0;
    soundOn = true;
    side = 0;
    tapInfo;

    constructor(beatTime) {
        super();
        this.beatTime = 5000;
    }

    tapDown() {
        let date = new Date();
        let currentTime = date.getTime();
        //First tap, set startTime to that tap
        if(this.startTime == -1) {
            this.startTime = currentTime;
        }
        let timing = ((currentTime - this.startTime) % this.beatTime);
        if (timing > this.beatTime / 2) {
            timing = timing - this.beatTime;
        }
        this.tapInfo = new TapInfo(currentTime - this.startTime - timing, this.beatTime, currentTime - this.startTime, "none", currentTime - this.startTime - this.lastTap, this.soundOn, this.side);
        this.lastTap = currentTime - this.startTime;

        return this.tapInfo.delta;
    }

    tapUp() {
        let date = new Date();
        let currentTime = date.getTime()
        this.tapInfo.releaseTime = currentTime - this.startTime;
        this.tapInfo.updateDuration();
        // if (this.soundOn) {
        //     tapDataSoundOn.push(this.tapInfo);
        // } else {
        //     tapDataSoundOff.push(this.tapInfo);
        // }
        console.log(this.tapInfo);
    }
}
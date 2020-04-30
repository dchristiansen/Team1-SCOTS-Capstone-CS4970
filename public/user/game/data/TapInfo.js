class TapInfo{
    constructor(beat, beatLength, pressTime, releaseTime, timeSinceLast, soundOn, side, cycleNumber){
        this.beat = beat;
        this.prevBeat = beat - beatLength;
        this.nextBeat = beat + beatLength;
        this.pressTime = pressTime;
        this.releaseTime = releaseTime;
        this.duration = releaseTime - pressTime;
        this.delta = pressTime - beat;
        this.nextDelta = pressTime - this.nextBeat;
        this.prevDelta = pressTime - this.prevBeat;
        this.timeSinceLast = timeSinceLast;
        this.soundOn = soundOn;
        this.side = side;
        this.cycleNumber = cycleNumber;
    }
    updateDuration(){
        this.duration = this.releaseTime - this.pressTime;
    }
}
export default TapInfo;
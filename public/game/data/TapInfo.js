class TapInfo{
    beat;
    prevBeat;
    nextBeat;
    pressTime;
    releaseTime;
    duration;
    delta;
    nextDelta;
    prevDelta;
    timeSinceLast;
    soundOn;
    side;
    constructor(beat, beatLength, pressTime, releaseTime, timeSinceLast, soundOn, side){
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
    }
    updateDuration(){
        this.duration = this.releaseTime - this.pressTime;
    }
}
export default TapInfo;
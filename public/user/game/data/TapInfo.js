//File: /user/game/data/TapInfo.js

//Description: Creates a TapInfo object which holds all the information about a single button press during the game.

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
    cycleNumber;
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
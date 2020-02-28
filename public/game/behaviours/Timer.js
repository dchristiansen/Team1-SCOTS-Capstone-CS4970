import Base from "../../engine/Base.js"
import ScoreCalculator from "./ScoreCalculator.js"
import TapHandler from "./TapHandler.js"


export default class Timer extends Base.Behavior {
    currentTime;
    startTime = -1;
    beatTime;
    phaseTime;
    phaseSwitchTime;
    endTime;
    tapHandler;
    soundOn = true;
    scoreCalculator;
    gameOver = false;
    interval;
    beatSound;
    mostRecentBeat;
    volumeChange;

    constructor(beatTime, phaseTime) {
        super();
        this.beatTime = beatTime;
        this.phaseTime = phaseTime;
    }

    start() {
        this.scoreCalculator = this.gameObject.getComponent(ScoreCalculator);
        this.beatSound = new Audio("./game/assets/beat.wav");
        this.volumeChange = 1 / (((0.25 * (this.phaseTime / 1000))) / (this.beatTime / 1000));
        this.interval = setInterval(this.playBeat.bind(this), this.beatTime);
    }

    playBeat() {
        //Check if volume needs to be lowered, if so lower it
        if (this.currentTime >= (this.startTime + (0.75 * this.phaseTime))  && this.startTime != -1) {
            let newVolume = this.beatSound.volume - this.volumeChange;
            if (newVolume < 0) {
                newVolume = 0;
            }
            console.log("Lowering volume to " + newVolume);
            this.beatSound.volume = newVolume;
        }
        this.beatSound.play();
        this.mostRecentBeat = new Date().getTime();
    }

    startTimer() {
        this.tapHandler = this.gameObject.getComponent(TapHandler);
        this.startTime = this.mostRecentBeat;
        this.phaseSwitchTime = this.startTime + this.phaseTime;
        this.endTime = this.phaseSwitchTime + this.phaseTime + (this.beatTime/2);
        this.tapHandler.startTime = this.startTime;
        return this.startTime;
    }

    update() {
        this.currentTime = new Date().getTime();
        if(this.soundOn) {
            if(this.currentTime > this.phaseSwitchTime + (this.beatTime / 2)) {
                console.log("Turning sound off");
                this.soundOn = false;
                clearInterval(this.interval);
            }
            //TODO: Add the volume decrement algorithm
        } else {
            if(this.currentTime > this.endTime) {
                if(!this.gameOver) {
                    this.gameOver = true;
                    console.log(this.scoreCalculator.calculateScore(this.tapHandler.tapDataSoundOff, this.beatTime, this.phaseTime));
                }
            }
        }
    }
}
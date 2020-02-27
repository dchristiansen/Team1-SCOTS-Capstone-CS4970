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

    constructor(beatTime, phaseTime) {
        super();
        this.beatTime = beatTime;
        this.phaseTime = phaseTime;
    }

    start() {
        this.scoreCalculator = this.gameObject.getComponent(ScoreCalculator);
        this.interval = setInterval(this.playBeat, this.beatTime);
    }

    playBeat() {
        this.beatSound = new Audio("beat.wav");
        this.beatSound.play();
    }

    startTimer() {
        this.tapHandler = this.gameObject.getComponent(TapHandler);
        this.currentTime = new Date().getTime();
        this.startTime = this.currentTime;
        this.phaseSwitchTime = this.startTime + this.phaseTime;
        this.endTime = this.phaseSwitchTime + this.phaseTime;
    }

    update() {
        this.currentTime = new Date().getTime();
        if(this.soundOn) {
            if(this.currentTime > this.phaseSwitchTime) {
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
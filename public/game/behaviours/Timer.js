import Base from "../../engine/Base.js"
import ScoreCalculator from "./ScoreCalculator.js"
import TapHandler from "./TapHandler.js"


export default class Timer extends Base.Behavior {
    currentTime;
    startTime = -1;
    beatTime;
    soundPhaseTime;
    noSoundPhaseTime;
    phaseSwitchTime;
    cycles;
    feedback;
    endTime;
    tapHandler;
    soundOn = true;
    scoreCalculator;
    gameOver = false;
    interval;
    beatSound;
    mostRecentBeat = 0;
    volumeChange;

    constructor(bpm, soundPhaseTime, noSoundPhaseTime, cycles, feedback) {
        super();
        this.beatTime = 60000/bpm;
        this.soundPhaseTime = soundPhaseTime*1000;
        this.noSoundPhaseTime = noSoundPhaseTime*1000;
        this.cycles = cycles;
        this.feedback = feedback;

        console.log("in timer");
    }

    start() {
        console.log(this.beatTime + " " + this.soundPhaseTime + " " + this.noSoundPhaseTime + " " + this.cycles + " " + this.feedback);

        this.scoreCalculator = this.gameObject.getComponent(ScoreCalculator);
        this.beatSound = new Audio("./game/assets/newbeat.wav");
        this.volumeChange = 1 / (((0.25 * (this.soundPhaseTime / 1000))) / (this.beatTime / 1000));
        this.interval = setInterval(this.playBeat.bind(this), this.beatTime);
    }

    playBeat() {
        //Check if volume needs to be lowered, if so lower it
        if (this.currentTime >= (this.startTime + (0.75 * this.soundPhaseTime))  && this.startTime != -1) {
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
        this.phaseSwitchTime = this.startTime + this.soundPhaseTime;
        this.endTime = this.phaseSwitchTime + this.noSoundPhaseTime + (this.beatTime/2);
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
        } else {
            if(this.currentTime > this.endTime) {
                if(!this.gameOver) {
                    this.gameOver = true;
                    sessionStorage.setItem('score', this.scoreCalculator.calculateScore(this.tapHandler.tapDataSoundOff, this.beatTime, this.noSoundPhaseTime));
                    sessionStorage.setItem('data', JSON.stringify(this.tapHandler.tapDataSoundOff));
                    document.location.href = "./results.html";
                }
            }
        }
    }
}
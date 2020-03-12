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
    endTime;
    tapHandler;
    soundOn = true;
    scoreCalculator;
    gameOver = false;
    interval;
    beatSound;
    mostRecentBeat = 0;
    volumeChange;
    currentCycle = 1;

    constructor(bpm, soundPhaseTime, noSoundPhaseTime, cycles) {
        super();
        this.beatTime = 60000/bpm;
        this.soundPhaseTime = soundPhaseTime*1000;
        this.noSoundPhaseTime = noSoundPhaseTime*1000;
        this.cycles = cycles;
    }

    start() {
        this.scoreCalculator = this.gameObject.getComponent(ScoreCalculator);
        this.beatSound = new Audio("./game/assets/newbeat.wav");

        //Algorithm to determine the amount of volume change each beat once 3/4 of the way through soundPhase
        this.volumeChange = 1 / (((0.25 * (this.soundPhaseTime / 1000))) / (this.beatTime / 1000));

        //Bind the variables that are being set in playBeat
        this.interval = setInterval(this.playBeat.bind(this), this.beatTime);
        this.mostRecentBeat = new Date().getTime();
    }

    playBeat() {
        //Check if we're in the sound on phase
        if(this.soundOn) {
            //Check if volume needs to be lowered (3/4 of the way through soundPhase), if so lower it
            if (this.currentTime >= (this.startTime + (0.75 * this.soundPhaseTime))  && this.startTime != -1) {
                let newVolume = this.beatSound.volume - this.volumeChange;
                if (newVolume < 0) {
                    newVolume = 0;
                }
                console.log("Lowering volume to " + newVolume);
                this.beatSound.volume = newVolume;
            }
            this.beatSound.play();
        }
        //If we're in the sound off phase, check if we're not on the last cycle
        else if(this.currentCycle != this.cycles) {
            //If not on the last cycle, check if we need to raise volume (3/4 of the way through soundOffPhase)
            if (this.currentTime >= (this.phaseSwitchTime + (0.75 * this.noSoundPhaseTime))  && this.startTime != -1) {
                let newVolume = this.beatSound.volume + this.volumeChange;
                if (newVolume > 1) {
                    newVolume = 1;
                }
                console.log("Increasing volume to " + newVolume);
                this.beatSound.volume = newVolume;
            }
            this.beatSound.play();
        }
        this.mostRecentBeat = new Date().getTime();
    }

    startTimer() {
        this.tapHandler = this.gameObject.getComponent(TapHandler);

        //Set the start time to the most recent beat that they are trying to hit
        this.startTime = this.mostRecentBeat;
        this.phaseSwitchTime = this.startTime + this.soundPhaseTime;
        this.endTime = this.phaseSwitchTime + this.noSoundPhaseTime + (this.beatTime/2);
        this.tapHandler.startTime = this.startTime;
        console.log("Start time is " + this.startTime);
        return this.startTime;
    }

    update() {
        this.currentTime = new Date().getTime();
        //If we're in the sound phase
        if(this.soundOn) {
            if(this.currentTime > this.phaseSwitchTime + (this.beatTime / 2)) {
                console.log("Turning sound off");
                this.soundOn = false;
            }
        //In the sound off phase
        } else {
            //If the current time we are at is the final time
            if(this.currentTime > this.endTime) {
                if(!this.gameOver) {
                    //If we are on the last cycle
                    if(this.currentCycle == this.cycles) {
                        this.gameOver = true;
                        sessionStorage.setItem('score', this.scoreCalculator.calculateScore(this.tapHandler.tapDataSoundOff, this.beatTime, this.noSoundPhaseTime, this.cycles));
                        sessionStorage.setItem('data', JSON.stringify(this.tapHandler.tapDataSoundOff));
                        document.location.href = "./results.html";
                    } else {
                        //Reset everything for the next cycle
                        console.log("Resetting");
                        this.currentCycle++;
                        this.startTimer();
                        this.beatSound.volume = 1;
                        this.soundOn = true;
                        this.tapHandler.currentCycle = this.currentCycle;
                    }
                }
            }
        }
    }
}
//File: /user/game/behaviours/Timer.js

//Description: An EdGE behavior which controls the flow of the game over time.

//Controls the start and end of the game and plays the beat sound during the game.

import Base from "../../engine/Base.js"
import ScoreCalculator from "./ScoreCalculator.js"
import TapHandler from "./TapHandler.js"
import { createSession } from "../../..//Data.js"


export default class Timer extends Base.Behavior {
    bpm;
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
    soundMax = true;

    constructor(bpm, soundPhaseTime, noSoundPhaseTime, cycles) {
        super();
        this.bpm = bpm;
        this.beatTime = Math.round(60000 / bpm);
        this.soundPhaseTime = soundPhaseTime * 1000;
        this.noSoundPhaseTime = noSoundPhaseTime * 1000;
        this.cycles = cycles;
    }

    /*
        start
        params: none
        returns: none
        Initializes this behavior. Called when EdGE intializes
    */
    start() {
        this.scoreCalculator = this.gameObject.getComponent(ScoreCalculator);
        this.beatSound = new Audio("./game/assets/newbeat.wav");

        //Algorithm to determine the amount of volume change each beat once 3/4 of the way through soundPhase
        this.volumeChange = 1 / (((0.25 * (this.soundPhaseTime / 1000))) / (this.beatTime / 1000));

        //Bind the variables that are being set in playBeat
        this.interval = setInterval(this.playBeat.bind(this), this.beatTime);
        this.mostRecentBeat = new Date().getTime();
    }

    /*
        playBeat
        params: none
        Handles any necessary volume changes and plays the beat sound.
    */
    playBeat() {
        //Check if we're in the sound on phase
        if (this.soundOn) {

            //Check if the sound has maxed out if we are in a new cycle
            if (!this.soundMax) {
                let newVolume = this.beatSound.volume + this.volumeChange;
                if (newVolume >= 1) {
                    newVolume = 1;
                    this.soundMax = true;
                }
                this.beatSound.volume = newVolume
            }

            //Check if volume needs to be lowered (3/4 of the way through soundPhase), if so lower it
            if (this.currentTime >= (this.startTime + (0.75 * this.soundPhaseTime)) && this.startTime != -1) {
                let newVolume = this.beatSound.volume - this.volumeChange;
                if (newVolume < 0) {
                    newVolume = 0;
                }
                this.beatSound.volume = newVolume;
            }
            this.beatSound.play();
        }
        this.mostRecentBeat = new Date().getTime();
    }

    /*
        startTimer
        params: none
        returns: start time of the game
        Sets the timings of future timer events based on the player's first button press.
    */
    startTimer() {
        this.tapHandler = this.gameObject.getComponent(TapHandler);

        //Set the start time to the most recent beat that they are trying to hit
        this.startTime = this.mostRecentBeat;

        //Set remaining timing events based on this start time
        this.phaseSwitchTime = this.startTime + this.soundPhaseTime;
        this.endTime = this.phaseSwitchTime + this.noSoundPhaseTime + (this.beatTime / 2);
        this.tapHandler.startTime = this.startTime;
        this.soundOn = true;
        this.tapHandler.soundOn = true;
        return this.startTime;
    }

    /*
        update
        params: none
        returns: none
        Runs this behavior's logic. Called every frame by EdGE
    */
    update() {
        this.currentTime = new Date().getTime();
        //If we're in the sound phase
        if (this.soundOn) {
            if (this.currentTime > this.phaseSwitchTime + (this.beatTime / 2)) {
                this.soundOn = false;
                this.beatSound.volume = 0;
                this.tapHandler.soundOn = false;
                this.beatSound.volume = 0;
                this.soundMax = false;
            }
            //If we're in the sound off phase
        } else {
            //If the cycle has ended
            if (this.currentTime > this.endTime) {
                if (!this.gameOver) {
                    //If we are on the last cycle
                    if (this.currentCycle == this.cycles) {
                        this.gameOver = true;
                        let feedback = sessionStorage.getItem('feedback');
                        let assignmentId = sessionStorage.getItem('aid');
                        let stringJson = JSON.parse(JSON.stringify(this.tapHandler.tapDataTotal));
                        let tapArrayString = [];

                        //Create the comma separated string to be stored in the database
                        stringJson.forEach(tap => {
                            let stringToInput = tap.cycleNumber + "," + tap.soundOn + "," + tap.beat + "," + tap.pressTime + "," + tap.releaseTime + "," + tap.timeSinceLast + "," + tap.delta + "," + tap.duration;
                            tapArrayString.push(stringToInput);
                        });

                        //Create a reference to this for use within the auth functions
                        let ref = this;
                        firebase.auth().onAuthStateChanged(async function (firebaseUser) {
                            //If the player is logged in
                            if (firebaseUser) {

                                //Set all of the sessionStorage information for use on the graph page
                                let score = ref.scoreCalculator.newCalculateScore(ref.tapHandler.tapDataSoundOff, ref.beatTime)
                                sessionStorage.setItem('totalTapArray', JSON.stringify(ref.tapHandler.tapDataTotal));
                                sessionStorage.setItem('score', score);
                                sessionStorage.setItem('data', JSON.stringify(ref.tapHandler.tapDataSoundOff));

                                //Save the session to the database using the array of csv strings
                                let sesh = await createSession(assignmentId, ref.bpm, ref.soundPhaseTime, ref.noSoundPhaseTime, ref.cycles, feedback, firebaseUser.uid, tapArrayString, score);

                                document.location.href = "/user/results.html";

                                //If the player is NOT logged in
                            } else {
                                //Set all of the sessionStorage information for use on the graph page
                                sessionStorage.setItem('totalTapArray', JSON.stringify(ref.tapHandler.tapDataTotal));
                                sessionStorage.setItem('score', ref.scoreCalculator.newCalculateScore(ref.tapHandler.tapDataSoundOff, ref.beatTime));
                                sessionStorage.setItem('data', JSON.stringify(ref.tapHandler.tapDataSoundOff));
                                document.location.href = "/user/results.html";
                            }
                        });
                    } else {
                        //Reset everything for the next cycle
                        this.currentCycle++;
                        this.startTimer();
                        this.tapHandler.currentCycle = this.currentCycle;
                    }
                }
            }
        }
    }
}
//File: /user/game/behaviours/TapHandler.js

//Description: Creates TapInfo objects based off of the player's button presses

import Base from "../../engine/Base.js"
import TapInfo from "../data/TapInfo.js"
import Timer from "./Timer.js"

export default class TapHandler extends Base.Behavior {

    startTime = -1;
    beatTime = 0;
    lastTap = 0;
    soundOn = true;
    side = 0;
    tapInfo;
    timer;
    tapDataSoundOff = [];
    tapDataTotal = [];
    currentCycle = 1;

    constructor(bpm) {
        super();
        this.beatTime = Math.round(60000/bpm);
    }

    /*
		start
		params: none
		returns: none
		Initializes this behavior. Called when EdGE intializes
	*/
    start() {
        //Get a reference to the game's Timer behavior.
        this.timer = this.gameObject.getComponent(Timer);
    }

    /*
		tapDown
		params: none
		returns: delta of the tap relative to nearest beat
		Handles the initial button press of a tap
	*/
    tapDown() {
        //Record the current time
        let date = new Date();
        let currentTime = date.getTime();
        //First tap, set startTime to the time of the tap
        if(this.timer.startTime == -1) {
            this.startTime = this.timer.startTimer();
        }
        //Caculate the delta (time difference between button press and last beat)
        let timing = ((currentTime - this.startTime) % this.beatTime);
        //If the press is more than 50% late, compare it to the next beat instead
        if (timing > this.beatTime / 2) {
            timing = timing - this.beatTime;
        }
        //Calculate time since last tap
        let timeSinceLast = currentTime - this.startTime - this.lastTap;
        
        //Create a TapInfo object based on the tap
        this.tapInfo = new TapInfo(currentTime - this.startTime - timing, this.beatTime, currentTime - this.startTime, "none", timeSinceLast, this.soundOn, this.side, this.currentCycle);
        
        //Save time of this tap
        this.lastTap = currentTime - this.startTime;

        return this.tapInfo.delta;
    }

    /*
		tapUp
		params: none
		returns: none
		Handles the final button release of a tap
	*/
    tapUp() {
        //Record the current time
        let date = new Date();
        let currentTime = date.getTime()

        //Set the release time of the TapInfo object
        this.tapInfo.releaseTime = currentTime - this.startTime;

        //Use the release time to calculate the duration of the press
        this.tapInfo.updateDuration();
        
        //Save the completed TapInfo object to the arrays of taps
        if(!this.timer.soundOn && !this.timer.gameOver)
            this.tapDataSoundOff.push(this.tapInfo);
        this.tapDataTotal.push(this.tapInfo);
    }
}
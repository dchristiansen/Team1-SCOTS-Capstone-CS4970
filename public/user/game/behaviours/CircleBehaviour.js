//File: /user/game/behaviours/CircleBehaviour.js

//Description: An EdGE behavior which controls the appearance of the feedback circle

import Base from "../../engine/Base.js"
import Input from "../../engine/base/Input.js"
import CircleComponent from "../../engine/components/CircleComponent.js"
import TapHandler from "./TapHandler.js";

export default class CircleBehaviour extends Base.Behavior {
    circle;
    tapHandler;
    feedback;

    constructor(feedback) {
        super();
        this.feedback = feedback;
    }

    /*
		start
		params: none
		returns: none
		Initializes this behavior. Called when EdGE intializes
	*/
    start() {
        this.circle = this.gameObject.getComponent(CircleComponent);
        this.tapHandler = this.gameObject.getComponent(TapHandler);
    }

    /*
		update
		params: none
		returns: none
		Runs this behavior's logic. Called every frame by EdGE
	*/
    update() {

    }

    /*
		pulse
		params: none
		returns: none
		Recieves keypress events from EdGE and displays the feedback with the circle object
	*/
    pulse() {
        //If a tap is in progress
        if(Input.keys[' '] || Input.touch) {
            //Constsrict the circle
            this.circle.radius = 90;

            //Call the taphandler to handle the press
            let delta = this.tapHandler.tapDown();
            
            //If feedback is enabled
            if(this.feedback == "true") {
                //If we are in the soundOn phase (feedback is not displayed during soundOff)
                if (this.tapHandler.timer.soundOn) {
                    //If the tap is within 33% of the beat, color the circle green
                    if (Math.abs(delta) < this.tapHandler.beatTime / 6) {
                        this.circle.fill = "green";
                    }
                    //If the tap is within 66% of the beat, color the circle yellow
                    else if (Math.abs(delta) < this.tapHandler.beatTime * 2 / 6) {
                        this.circle.fill = "yellow"
                    }
                    //Otherwise color the circle red
                    else {
                        this.circle.fill = "red";
                    }
                }
            }
        } 

        //If a tap is not in progress
        if (!Input.keys[' '] && !Input.touch){
            //Expand the circle and color it white
            this.circle.radius = 100;
            this.circle.fill = "white";
            
            //Call the taphandler to handle the release
            this.tapHandler.tapUp();
        }
    }
}
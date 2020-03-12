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

    start() {
        this.circle = this.gameObject.getComponent(CircleComponent);
        this.tapHandler = this.gameObject.getComponent(TapHandler);
    }

    update() {

    }

    pulse() {
        if(Input.keys[' ']) {
            this.circle.radius = 90;
            let delta = this.tapHandler.tapDown();

            if(this.feedback == "true") {
                if (this.tapHandler.timer.soundOn) {
                    if (Math.abs(delta) < this.tapHandler.beatTime / 6) {
                        this.circle.fill = "green";
                    }
                    else if (Math.abs(delta) < this.tapHandler.beatTime * 2 / 6) {
                        this.circle.fill = "yellow"
                    }
                    else {
                        this.circle.fill = "red";
                    }
                }
            }
        } 

        if (!Input.keys[' ']){
            this.circle.radius = 100;
            this.circle.fill = "white";
            this.tapHandler.tapUp();
        }
    }
}
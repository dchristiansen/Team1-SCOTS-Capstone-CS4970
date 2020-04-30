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
        if(Input.keys[' '] || Input.touch) {
            this.circle.radius = 90;
            let timeSinceLast = this.tapHandler.tapDown();

            console.log(this.tapHandler.beatTime);

            if(this.feedback == "true") {
                if (this.tapHandler.timer.soundOn) {
                    if (Math.abs(timeSinceLast) < this.tapHandler.beatTime + this.tapHandler.beatTime * 0.1) {
                        this.circle.fill = "green";
                    }
                    else if (Math.abs(timeSinceLast) < this.tapHandler.beatTime + this.tapHandler.beatTime * 0.15) {
                        this.circle.fill = "yellow"
                    }
                    else {
                        this.circle.fill = "red";
                    }
                }
            }
        } 

        if (!Input.keys[' '] && !Input.touch){
            this.circle.radius = 100;
            this.circle.fill = "white";
            this.tapHandler.tapUp();
        }
    }
}
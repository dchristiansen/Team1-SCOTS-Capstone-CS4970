import Engine from "../../engine/Engine.js"
import GameObjects from "../GameObjects.js"
import GameBehaviours from "../GameBehaviors.js"

export default class PlayScene extends Engine.Base.Scene{
    constructor(bpm, timeWSound, timeWOSound, cycles, feedback){
        super("PlayScene");

        console.log(bpm + " " + timeWSound + " " + timeWOSound + " " + cycles + " " + feedback);
        console.log("hello");

        let gameObject = new Engine.Base.GameObject(320, 240);
        let circle = new Engine.Components.CircleComponent(100, "white", "black");
        gameObject.addComponent(circle);

        let ScoreCalculator = new GameBehaviours.ScoreCalculator();
        gameObject.addComponent(ScoreCalculator);

        let Timer = new GameBehaviours.Timer(bpm, timeWSound, timeWOSound, cycles, feedback);
        gameObject.addComponent(Timer);

        let TapHandler = new GameBehaviours.TapHandler(bpm);
        gameObject.addComponent(TapHandler);

        let CircleBehaviour = new GameBehaviours.CircleBehaviour();
        gameObject.addComponent(CircleBehaviour);

        this.children.push(gameObject);
    }
}
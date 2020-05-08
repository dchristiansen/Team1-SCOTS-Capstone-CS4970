import Engine from "../../engine/Engine.js"
import GameBehaviours from "../GameBehaviors.js"

export default class PlayScene extends Engine.Base.Scene{
    constructor(bpm, timeWSound, timeWOSound, cycles, feedback){
        super("PlayScene");

        let gameObject = new Engine.Base.GameObject(320, 240);
        let circle = new Engine.Components.CircleComponent(100, "white", "black");
        gameObject.addComponent(circle);

        let ScoreCalculator = new GameBehaviours.ScoreCalculator();
        gameObject.addComponent(ScoreCalculator);

        let Timer = new GameBehaviours.Timer(bpm, timeWSound, timeWOSound, cycles);
        gameObject.addComponent(Timer);

        let guideText = new Engine.Base.GameObject(0, -150);
        let text = new Engine.Components.TextComponent("", "20px Roboto", "white");
        let textController = new GameBehaviours.TextController(Timer, text);
        guideText.addComponent(text);
        guideText.addComponent(textController);
        gameObject.children.push(guideText);

        let TapHandler = new GameBehaviours.TapHandler(bpm);
        gameObject.addComponent(TapHandler);

        let CircleBehaviour = new GameBehaviours.CircleBehaviour(feedback);
        gameObject.addComponent(CircleBehaviour);

        this.children.push(gameObject);
    }
}
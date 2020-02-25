import Engine from "../../engine/Engine.js"
import GameObjects from "../GameObjects.js"
import GameBehaviours from "../GameBehaviors.js"

export default class PlayScene extends Engine.Base.Scene{
    constructor(){
        super("PlayScene");

        let circleObject = new Engine.Base.GameObject(100, 100);
        let circle = new Engine.Components.CircleComponent(100, "white", "black");
        circleObject.addComponent(circle);

        let TapHandler = new GameBehaviours.TapHandler();
        circleObject.addComponent(TapHandler);

        let CircleBehaviour = new GameBehaviours.CircleBehaviour();
        circleObject.addComponent(CircleBehaviour);


        this.children.push(circleObject);
    }
}
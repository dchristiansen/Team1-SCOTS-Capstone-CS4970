import Engine from "../../engine/Engine.js"
import GameObjects from "../GameObjects.js"
import GameBehaviours from "../GameBehaviors.js"


export default class ScoreScene extends Engine.Base.Scene{
    constructor(){
        super("ScoreScene");

        let scoreObject = new Engine.Base.GameObject(100, 100);

        this.children.push(scoreObject);
    }
}
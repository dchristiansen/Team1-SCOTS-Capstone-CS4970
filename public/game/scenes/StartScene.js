import Engine from "../../engine/Engine.js"
import GameObjects from "../GameObjects.js"
import GameBehaviours from "../GameBehaviors.js"


export default class StartScene extends Engine.Base.Scene{
    constructor(){
        super("StartScene");
        let startObject = new Engine.Base.GameObject(100, 100);
        
        let text = new Engine.Components.TextComponent("Slam me to play", "30px Times", "purple");
        startObject.addComponent(text);

        this.children.push(startObject);
    }
}
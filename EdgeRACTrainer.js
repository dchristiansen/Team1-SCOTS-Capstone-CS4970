import Scenes from "./game/Scenes.js"
import SceneManager from "./game/SceneManager.js"
import Engine from "./engine/Engine.js"
import Scene from "./engine/base/Scene.js"

let startScene = new Scenes.StartScene();
let playScene = new Scenes.PlayScene();

SceneManager.addScene(startScene);
SceneManager.addScene(playScene);
SceneManager.currentScene = "PlayScene";

document.body.addEventListener('keydown', keydown);
document.body.addEventListener('keyup', keyup);

let Input = Engine.Base.Input;

function keydown(event) {
    if(Input.keys[event.key] != true)
        Input.down[event.key] = true;
    Input.keys[event.key] = true;

    pulse(event);
}

function keyup(event) {
    if(Input.keys[event.key] != false)
        Input.up[event.key] = true;
    Input.keys[event.key] = false;

    pulse(event);
}

let canv, ctx;

function main() {
    canv = document.querySelector("#canv");
    ctx = canv.getContext('2d');

    setInterval(gameLoop, 33);
}

function gameLoop() {
    Input.swapUpDownArrays();
    update();
    draw(ctx);
}

function update() {
    SceneManager.currentScene.update();
}

function draw(ctx) {
    SceneManager.currentScene.draw(ctx, canv.width, canv.height);
}

function pulse(event) {
    SceneManager.currentScene.pulse(event);
}

main();
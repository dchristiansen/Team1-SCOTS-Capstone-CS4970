import Scenes from "./game/Scenes.js"
import SceneManager from "./game/SceneManager.js"
import Engine from "./engine/Engine.js"
import Scene from "./engine/base/Scene.js"

let playScene;

let bpm = sessionStorage.getItem("bpm");
let timeWSound = sessionStorage.getItem("timeWSound");
let timeWOSound = sessionStorage.getItem("timeWOSound");
let cycles = sessionStorage.getItem("cycles");
let feedback = sessionStorage.getItem("feedback");

document.body.addEventListener('keydown', keydown);
document.body.addEventListener('keyup', keyup);

let Input = Engine.Base.Input;
let pressed = false;

function keydown(event) {
    event.stopPropagation();
    if(Input.keys[event.key] != true)
        Input.down[event.key] = true;
    Input.keys[event.key] = true;

    if(!pressed) {
        pressed = true;
        pulse();
    }
}

function keyup(event) {
    if(Input.keys[event.key] != false)
        Input.up[event.key] = true;
    Input.keys[event.key] = false;

    pressed = false;
    pulse();
}

let canv, ctx;

function slamMeToPlay() {
    playScene = new Scenes.PlayScene(bpm, timeWSound, timeWOSound, cycles, feedback);

    SceneManager.addScene(playScene);
    SceneManager.currentScene = "PlayScene";

    canv = document.querySelector("#gameCanvas");
    ctx = canv.getContext('2d');
    let button = document.querySelector("#startButton");
    canv.classList.remove("hidden");
    button.style.display = "none";
   
    //console.log(bpm + " " + timeWSound + " " + timeWOSound + " " + cycles + " " + feedback);

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

function pulse() {
    SceneManager.currentScene.pulse();
}

let button = document.querySelector("#startButton");
button.onclick = slamMeToPlay;
import Scenes from "./game/Scenes.js"
import SceneManager from "./game/SceneManager.js"
import Engine from "./engine/Engine.js"

const FRAMES_PER_SECOND = 30;
const MILLIS_PER_SECOND = 1000;
const MILLIS_PER_FRAME = MILLIS_PER_SECOND / FRAMES_PER_SECOND;

let canv, ctx;

let playScene;

let bpm = sessionStorage.getItem("bpm");
let timeWSound = sessionStorage.getItem("timeWSound");
let timeWOSound = sessionStorage.getItem("timeWOSound");
let cycles = sessionStorage.getItem("cycles");
let feedback = sessionStorage.getItem("feedback");

document.body.addEventListener('keydown', keydown);
document.body.addEventListener('keyup', keyup);
window.addEventListener('touchstart', touchstart);
window.addEventListener('touchend', touchend);

let Input = Engine.Base.Input;
let pressed = false;

function touchstart(event){
    if(Input.touch != true)
        Input.touchdown = true;
    Input.touch = true;

    if(!pressed) {
        pressed = true;
        pulse();
    }
}

function touchend(event){
    if(Input.touch != false)
        Input.touchup = true;
    Input.touch = false;

    pressed = false;
    pulse();
}

function keydown(event) {
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

function playGame() {
    playScene = new Scenes.PlayScene(bpm, timeWSound, timeWOSound, cycles, feedback);

    SceneManager.addScene(playScene);
    SceneManager.currentScene = "PlayScene";

    canv = document.querySelector("#gameCanvas");
    ctx = canv.getContext('2d');
    let button = document.querySelector("#startButton");
    let instructions = document.querySelector("#instructions");
    canv.classList.remove("hidden");
    button.style.display = "none";
    instructions.style.display = "none";

    setInterval(gameLoop, MILLIS_PER_FRAME);
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

function checkToPlayGame() {
    let readyToPlay = true;

    if(!sessionStorage.getItem("bpm")){
        readyToPlay = false;
    }else if(!sessionStorage.getItem("timeWSound")){
        readyToPlay = false;
    }else if(!sessionStorage.getItem("timeWOSound")){
        readyToPlay = false;
    }else if(!sessionStorage.getItem("cycles")){
        readyToPlay = false;
    }else if(!sessionStorage.getItem("feedback")){
        readyToPlay = false;
    }

    if(readyToPlay) {
        playGame();
    } else {
        let location = "/user/parameters.html";
        firebase.auth().onAuthStateChanged(user => {
            if(user){
                location = "/user/userdashboard.html";
            }
        });

        window.alert("No parameters selected, returning to parameter select");
        window.location = location;
    }
}

let button = document.querySelector("#startButton");
button.onclick = checkToPlayGame;
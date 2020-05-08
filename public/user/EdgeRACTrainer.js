import Scenes from "./game/Scenes.js"
import SceneManager from "./game/SceneManager.js"
import Engine from "./engine/Engine.js"

const FRAMES_PER_SECOND = 30;
const MILLIS_PER_SECOND = 1000;
const MILLIS_PER_FRAME = MILLIS_PER_SECOND / FRAMES_PER_SECOND;

let playScene;

//Get the gameplay parameters from the browser's sessionStorage
let bpm = sessionStorage.getItem("bpm");
let timeWSound = sessionStorage.getItem("timeWSound");
let timeWOSound = sessionStorage.getItem("timeWOSound");
let cycles = sessionStorage.getItem("cycles");
let feedback = sessionStorage.getItem("feedback");

//Set the input eventListeners
document.body.addEventListener('keydown', keydown);
document.body.addEventListener('keyup', keyup);
window.addEventListener('touchstart', touchstart);
window.addEventListener('touchend', touchend);

let Input = Engine.Base.Input;
let pressed = false;

/*
	touchstart
	params: event - the input event
	returns: none
	handles the start of a touchscreen tap
*/
function touchstart(event){
    //If a touchscreen tap is not already in progress
    if(Input.touch != true){
        //A tap started this frame
        Input.touchdown = true;
    }

    //A tap is now in progress
    Input.touch = true;

    //If a game press is not already in progress
    if(!pressed) {
        //A game press is now in progress
        pressed = true;

        //Send an input event out through EdGE
        pulse();
    }
}

/*
	touchend
	params: event - the input event
	returns: none
	handles the end of a touchscreen tap
*/
function touchend(event){
    //If a touchscreen tap is currently in progress
    if(Input.touch != false)
        //the touchscreen released this frame
        Input.touchup = true;
    //A tap is no longer in progress
    Input.touch = false;

    //A game press is no longer in progress
    pressed = false;

    //Send an input event out through EdGE
    pulse();
}

/*
	keydown
	params: event - the input event
	returns: none
	handles the start of a keypress
*/
function keydown(event) {
    //If a press of this key is not currently in progress
    if(Input.keys[event.key] != true)
        //A press started this frame
        Input.down[event.key] = true;
    //A press is now in progress
    Input.keys[event.key] = true;

    //If a game press is not already in progress
    if(!pressed) {
        //A game press is now in progress
        pressed = true;

        //Send an input event out through EdGE
        pulse();
    }
}

/*
	keyup
	params: event - the input event
	returns: none
	handles the release of a keypress
*/
function keyup(event) {
    //If a press of this key is currently in progress
    if(Input.keys[event.key] != false)
        //A press ended this frame
        Input.up[event.key] = true;
    //A press of this key is no longer in progress
    Input.keys[event.key] = false;

    //A game press is no longer in progress
    pressed = false;
    pulse();
}

let canv, ctx;

function playGame() {
    //Create a PlayScene
    playScene = new Scenes.PlayScene(bpm, timeWSound, timeWOSound, cycles, feedback);

    //Add the PlayScene to the SceneManager and switch to it
    SceneManager.addScene(playScene);
    SceneManager.currentScene = "PlayScene";

    //Reveal the game canvas and hide the pregame instructions and start button
    canv = document.querySelector("#gameCanvas");
    ctx = canv.getContext('2d');
    let button = document.querySelector("#startButton");
    let instructions = document.querySelector("#instructions");
    canv.classList.remove("hidden");
    button.style.display = "none";
    instructions.style.display = "none";

    //start the gameloop
    setInterval(gameLoop, MILLIS_PER_FRAME);
}

/*
	gameLoop
	params: none
	returns: none
	EdGE engine driver. Every frame handles updates for input, updates all game objects, and renders all game objects
*/
function gameLoop() {
    Input.swapUpDownArrays();
    update();
    draw(ctx);
}

/*
	update
	params: none
	returns: none
	calls the update function for the current scene, which calls update for all objects in the current scene
*/
function update() {
    SceneManager.currentScene.update();
}

/*
	draw
	params: ctx - the 2d context of the game canvas
	returns: none
	calls the draw function for the current scene, which calls draw for all objects in the current scene
*/
function draw(ctx) {
    SceneManager.currentScene.draw(ctx, canv.width, canv.height);
}

/*
	pulse
	params: none
	returns: none
	calls the pulse function for the current scene, which calls pulse for all objects in the current scene. Used for event based input
*/
function pulse() {
    SceneManager.currentScene.pulse();
}

/*
	checkToPlayGame
	params: none
	returns: none
	Verifies that the game can be played
*/
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
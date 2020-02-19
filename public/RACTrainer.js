import TapInfo from "./TapInfo.js";
import Circle from "./Circle.js";

let cnv = document.querySelector("#canv");
let ctx = cnv.getContext("2d");
const HITS_TO_START = 10;
let bpm = 120;
let beatTime = 60000 / bpm;
let beatSound = new Audio("beat.wav");
let data = [];
let date = new Date();
let startTime = date.getTime();
let tapInfo;
let lastTap = 0;
let soundOn = true;
let side = "right";
let ready = true;
let startBeats = 0;
let currentBeat = 0;
setInterval(playBeat, beatTime);
setInterval(draw, 1000 / 20);
let circle = new Circle(320, 240, 100, "white", "black");

function playBeat() {
    //TODO: Maintain and check soundOn variable
    if (soundOn) {
        beatSound.play();
    }
}

function draw() {
    ctx.save();
    {
        ctx.fillStyle = "white";
        ctx.strokeStyle = "black";
        ctx.font = "72px Arial";
        ctx.fillRect(0, 0, 640, 480);
        circle.draw(ctx);
    }
    ctx.restore();
}

function keyPressDown(event) {
    if (event.key == " " && ready) {
        circle.goalRadius = 90;
        date = new Date();
        ready = false;
        let currentTime = date.getTime();
        let timing = ((currentTime - startTime) % beatTime);
        if (timing > beatTime / 2) {
            timing = +timing - +beatTime;
        }
        tapInfo = new TapInfo(currentTime - startTime - timing, beatTime, currentTime - startTime, "none", currentTime - startTime - lastTap, soundOn, side);
        lastTap = currentTime - startTime;

        if (startBeats < HITS_TO_START) {
            if (startBeats == 0) {
                circle.fill = "darkolivegreen";
                currentBeat = currentTime - startTime - timing + beatTime;
                startBeats++;
            }
            else if (tapInfo.beat == currentBeat) {
                circle.fill = "darkolivegreen";
                currentBeat += beatTime;
                startBeats++;
                if (startBeats >= HITS_TO_START) {
                    circle.fill = "white"
                    soundOn = false;
                }
            }
            else {
                circle.fill = "red";
                startBeats = 0;
            }
        }
    }

}

function keyPressUp(event) {
    if (event.key == " ") {
        circle.goalRadius = 100;
        date = new Date();
        let currentTime = date.getTime()
        tapInfo.releaseTime = currentTime - startTime;
        tapInfo.updateDuration();
        data.push(tapInfo);
        ready = true;
        console.log(tapInfo);
    }

}
document.addEventListener("keydown", keyPressDown);
document.addEventListener("keyup", keyPressUp);
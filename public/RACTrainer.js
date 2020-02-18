import TapInfo from "./TapInfo.js";

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

function playBeat() {
    //TODO: Maintain and check soundOn variable
    if (soundOn){
        beatSound.play();
    }
}

function keyPressDown(event) {
    if (event.key == " " && ready) {
        date = new Date();
        ready = false;
        let currentTime = date.getTime();
        let timing = ((currentTime - startTime) % beatTime);
        if (timing > beatTime / 2) {
            timing = +timing - +beatTime;
        }
        ctx.save();
        {
            ctx.fillStyle = "white";
            ctx.strokeStyle = "black";
            ctx.font = "72px Arial";
            ctx.fillRect(0, 0, 640, 480);
            ctx.strokeText(timing + "ms", 100, 240)
        }
        tapInfo = new TapInfo(currentTime - startTime - timing, beatTime, currentTime - startTime, "none", currentTime - startTime - lastTap, soundOn, side);
        lastTap = currentTime - startTime;

        if (startBeats < HITS_TO_START){
            if (startBeats == 0){
                currentBeat = currentTime - startTime - timing + beatTime;
                startBeats++;
            }
            else if (tapInfo.beat == currentBeat)
            {
                currentBeat += beatTime;
                startBeats++;
                if (startBeats >= HITS_TO_START){
                    soundOn = false;
                }
            }
            else{
                startBeats = 0;
            }
        }
    }

}

function keyPressUp(event) {
    if (event.key == " ") {
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
let ctx = document.getElementById('Results').getContext('2d');
let score = sessionStorage.getItem('score');
let data = sessionStorage.getItem('totalTapArray');
let soundOnTime = sessionStorage.getItem('timeWSound');
let soundOffTime = sessionStorage.getItem('timeWOSound');
let cycles = sessionStorage.getItem('cycles');
let bpm = sessionStorage.getItem('bpm');
let total = sessionStorage.getItem('totalTapArray');

data = JSON.parse(data);

//console.log(soundOnTime);
//console.log(soundOffTime);
soundOnTime*=1000;
soundOffTime*=1000;
console.log(data);

let yMax = 0, yMin = -1, xMax = 0;

//Creating the x,y pair array
let chartArray = [];
let prev;
data.forEach(tap => {

    let timeSinceLast = tap.timeSinceLast;
    //Calculate pressTime taking into account cycle number
    let pressTime = tap.pressTime+((parseInt(soundOnTime)+parseInt(soundOffTime))*(tap.cycleNumber-1));

    //On sound reset get a negative number, this fixes the bug, might want to investigate a fix in taphandler
    if(timeSinceLast < 0) {
        timeSinceLast = (pressTime - prev.pressTime);
    }

    //Get the max y value
    if(timeSinceLast > yMax) {
        yMax = timeSinceLast;
    }

    if(yMin == -1 || timeSinceLast < yMin) {
        yMin = timeSinceLast;
    }

    chartArray.push({x: pressTime, y: timeSinceLast});
    prev = tap;
});

xMax = chartArray[chartArray.length-1].x;

console.log(chartArray);

// //Calculate the green, yellow, and red line positions based off of the bpm
// let beatTime = 60000/bpm;
// //Ensure that the graph extends to include the final beat, since we actually have a half beat extra
// lastBeat += 0.5*(beatTime/1000);
// let greenY = beatTime/6;
// let yellowY = beatTime * 2 / 6;
// let greenZonePos = [{x: 0, y: greenY}, {x: lastBeat, y: greenY}];
// let greenZoneNeg = [{x: 0, y: greenY*-1}, {x: lastBeat, y: greenY*-1}];
// let yellowZonePos = [{x: 0, y: yellowY}, {x: lastBeat, y: yellowY}];
// let yellowZoneNeg = [{x: 0, y: yellowY*-1}, {x: lastBeat, y: yellowY*-1}];
// let redZonePos = [{x: 0, y: yMax}, {x: lastBeat, y: yMax}];
// let redZoneNeg = [{x: 0, y: yMin}, {x: lastBeat, y: yMin}];

//Calculating the sound on/sound off lines
let soundOffLine = [{x: soundOnTime, y: yMax}, {x: soundOnTime, y: yMin}];
let soundOnLine = [];
let currentTime = parseInt(soundOnTime);
for(let i = 1; i < cycles; i++) {
    currentTime += parseInt(soundOffTime);
    soundOffLine.push(NaN);
    soundOnLine.push({x: currentTime, y: yMax}, {x: currentTime, y: yMin});
    soundOnLine.push(NaN);
    currentTime += parseInt(soundOnTime);
    soundOffLine.push({x: currentTime, y: yMax}, {x: currentTime, y: yMin});
}


//Create the chart
let myChart = new Chart(ctx, {
    type: 'scatter',
    data: {
        fill: true,
        backgroundColor: 'rgba(255, 99, 132, 1)',
        datasets: [{
            order: 0,
            label: 'Inter-tap Interval',
            data: chartArray,
            pointStyle: 'rectRot',
            radius: 5,
            hoverRadius: 10,
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1.2
        }, 
        // {
        //     data: greenZonePos,
        //     borderColor: 'rgba(44, 155, 8, 0.6)',
        //     borderDash: [5, 15],
        //     type: 'line',
        //     showLine: true,
        //     pointRadius: 0,
        //     fill: false
        // }, {
        //     data: yellowZonePos,
        //     borderColor: 'rgba(218, 251, 8, 0.6)',
        //     borderDash: [5, 15],
        //     type: 'line',
        //     showLine: true,
        //     pointRadius: 0,
        //     fill: false
        // }, {
        //     data: redZonePos,
        //     borderColor: 'rgba(194, 33, 9, 0.6)',
        //     borderDash: [5, 15],
        //     type: 'line',
        //     showLine: true,
        //     pointRadius: 0,
        //     fill: false
        // }, {
        //     data: greenZoneNeg,
        //     borderColor: 'rgba(44, 155, 8, 0.6)',
        //     borderDash: [5, 15],
        //     type: 'line',
        //     showLine: true,
        //     pointRadius: 0,
        //     fill: false
        // }, {
        //     data: yellowZoneNeg,
        //     borderColor: 'rgba(218, 251, 8, 0.6)',
        //     borderDash: [5, 15],
        //     type: 'line',
        //     showLine: true,
        //     pointRadius: 0,
        //     fill: false
        // }, {
        //     data: redZoneNeg,
        //     borderColor: 'rgba(194, 33, 9, 0.6)',
        //     borderDash: [5, 15],
        //     type: 'line',
        //     showLine: true,
        //     pointRadius: 0,
        //     fill: false
        // }, 
        {
            data: soundOffLine,
            borderColor: 'rgba(255, 99, 132, 0.3)',
            borderDash: [5, 15],
            type: 'line',
            showLine: true,
            pointRadius: 0,
            fill: false,
            spanGaps: false
        },
        {
            data: soundOnLine,
            borderColor: 'rgba(12, 176, 12, 0.3)',
            borderDash: [5, 15],
            type: 'line',
            showLine: true,
            pointRadius: 0,
            fill: false,
            spanGaps: false
        }],
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: false,
                    max: yMax,
                    min: yMin
                }
            }],
            xAxes: [{
                ticks: {
                    max: xMax
                }
            }]
        }, 
        legend: {
            labels: {
                //Only display the label for the accuracy of taps
                filter: function(legendItem, data) {
                    return legendItem.datasetIndex == 0;
                }
            }
        }
    }
});

let scoreString = document.querySelector("#score");

score *= 100;
score = Math.round(score*100)/100;


scoreString.innerHTML = "Score: " + score + "%";


function resetToParamSelect() {
    console.log("resetting");
    firebase.auth().onAuthStateChanged(function(user) {
        if(user) {
            console.log("user logged in, going to dashboard");
            window.location = "userdashboard.html";
        } else {
            window.location = "parameters.html";
        }
    });
}


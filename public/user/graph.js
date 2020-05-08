let intervalGraphElement = document.getElementById('intervalGraph');
let asynchronyGraphElement = document.getElementById('asynchronyGraph');
let score = sessionStorage.getItem('score');
let data = sessionStorage.getItem('totalTapArray');
let soundOnTime = sessionStorage.getItem('timeWSound');
let soundOffTime = sessionStorage.getItem('timeWOSound');
let cycles = sessionStorage.getItem('cycles');
let bpm = sessionStorage.getItem('bpm');
let total = sessionStorage.getItem('totalTapArray');

data = JSON.parse(data);

let yMaxInterval = 0, yMinInterval = -1, xMax = 0;

let beatTime = Math.round((60000 / bpm));

let yMaxAsynchrony = beatTime / 2, yMinAsynchrony = -yMaxAsynchrony;

//Creating the x,y pair array for the interval and asynchrony arrays
let intervalChartArray = [];
let asynchronyChartArray = [];
let prev;
data.splice(0, 1);
data.forEach(tap => {

    let timeSinceLast = tap.timeSinceLast;
    //Calculate pressTime taking into account cycle number
    let pressTime = (tap.pressTime/1000) + ((parseInt(soundOnTime) + parseInt(soundOffTime)) * (tap.cycleNumber - 1));
    pressTime = Math.round(pressTime * 100) / 100;

    //Calculate the current beat taking into account cycle number
    let currentBeat = (tap.beat/1000) + ((parseInt(soundOnTime) + parseInt(soundOffTime)) * (tap.cycleNumber - 1));
    currentBeat = Math.round(currentBeat * 100) / 100;

    //If this is a tap within our y-bounds (less than 2 times the beat time)
    if (timeSinceLast < (2 * beatTime) && timeSinceLast > (beatTime / 2)) {
        //On sound reset get a negative number, this fixes the bug, might want to investigate a fix in taphandler
        if (timeSinceLast < 0) {
            timeSinceLast = (pressTime - prev.pressTime);
        }

        //Get the max y value
        if (timeSinceLast > yMaxInterval) {
            yMaxInterval = timeSinceLast;
        }

        if (yMinInterval == -1 || timeSinceLast < yMinInterval) {
            yMinInterval = timeSinceLast;
        }

        intervalChartArray.push({ x: pressTime, y: timeSinceLast });
    }
    
    console.log(tap.delta);
    asynchronyChartArray.push({ x: currentBeat, y: tap.delta});

    prev = tap;
});

xMax = asynchronyChartArray[asynchronyChartArray.length - 1].x;

//Calculate the green, yellow, and red line positions based off of the bpm for the interval chart
let greenYPosInterval = beatTime + (beatTime * 0.1);
let greenYNegInterval = beatTime - (beatTime * 0.1);
let yellowYPosInterval = beatTime + (beatTime * 0.15);
let yellowYNegInterval = beatTime - (beatTime * 0.15);
let redYPosInterval = beatTime + (beatTime * 0.2);
let redYNegInterval = beatTime - (beatTime * 0.2);

let greenZonePosInterval = [{ x: 0, y: greenYPosInterval }, { x: xMax, y: greenYPosInterval }];
let greenZoneNegInterval = [{ x: 0, y: greenYNegInterval }, { x: xMax, y: greenYNegInterval }];
let yellowZonePosInterval = [{ x: 0, y: yellowYPosInterval }, { x: xMax, y: yellowYPosInterval }];
let yellowZoneNegInterval = [{ x: 0, y: yellowYNegInterval }, { x: xMax, y: yellowYNegInterval }];
let redZonePosInterval = [{ x: 0, y: redYPosInterval }, { x: xMax, y: redYPosInterval }];
let redZoneNegInterval = [{ x: 0, y: redYNegInterval }, { x: xMax, y: redYNegInterval }];

//Check if the red zones are greater than the current y min/max, if so set them to be our new min/max
if (redYPosInterval > yMaxInterval) {
    yMaxInterval = redYPosInterval;
}
if (redYNegInterval < yMinInterval) {
    yMinInterval = redYNegInterval;
}

//Calculate the green, yellow, and red line positions based off of the bpm for the asynchrony chart
let greenYPosAsynchrony = beatTime / 6;
let greenYNegAsynchrony = -greenYPosAsynchrony;
let yellowYPosAsynchrony = beatTime / 3;
let yellowYNegAsynchrony = -yellowYPosAsynchrony;
let redYPosAsynchrony = yMaxAsynchrony;
let redYNegAsynchrony = -redYPosAsynchrony;

let greenZonePosAsynchrony = [{ x: 0, y: greenYPosAsynchrony }, { x: xMax, y: greenYPosAsynchrony }];
let greenZoneNegAsynchrony = [{ x: 0, y: greenYNegAsynchrony }, { x: xMax, y: greenYNegAsynchrony }];
let yellowZonePosAsynchrony = [{ x: 0, y: yellowYPosAsynchrony }, { x: xMax, y: yellowYPosAsynchrony }];
let yellowZoneNegAsynchrony = [{ x: 0, y: yellowYNegAsynchrony }, { x: xMax, y: yellowYNegAsynchrony }];
let redZonePosAsynchrony = [{ x: 0, y: redYPosAsynchrony }, { x: xMax, y: redYPosAsynchrony }];
let redZoneNegAsynchrony = [{ x: 0, y: redYNegAsynchrony }, { x: xMax, y: redYNegAsynchrony }];

//Calculate the sound on/sound off lines for interval and asynchrony graphs
let soundOffLineInterval = [{ x: soundOnTime, y: yMaxInterval }, { x: soundOnTime, y: yMinInterval }];
let soundOffLineAsynchrony = [{ x: soundOnTime, y: yMaxAsynchrony }, { x: soundOnTime, y: yMinAsynchrony }];
let soundOnLineInterval = [], soundOnLineAsynchrony = [];
let currentTime = parseInt(soundOnTime);
for (let i = 1; i < cycles; i++) {
    currentTime += parseInt(soundOffTime);
    soundOffLineInterval.push(NaN);
    soundOffLineAsynchrony.push(NaN);
    soundOnLineInterval.push({ x: currentTime, y: yMaxInterval }, { x: currentTime, y: yMinInterval });
    soundOnLineAsynchrony.push({ x: currentTime, y: yMaxAsynchrony }, { x: currentTime, y: yMinAsynchrony });
    soundOnLineInterval.push(NaN);
    soundOnLineAsynchrony.push(NaN);
    currentTime += parseInt(soundOnTime);
    soundOffLineInterval.push({ x: currentTime, y: yMaxInterval }, { x: currentTime, y: yMinInterval });
    soundOffLineAsynchrony.push({ x: currentTime, y: yMaxAsynchrony }, { x: currentTime, y: yMinAsynchrony });
}


//Create the chart for the intertap interval graph
let intervalGraph = new Chart(intervalGraphElement.getContext('2d'), {
    type: 'scatter',
    data: {
        fill: true,
        backgroundColor: 'rgba(255, 99, 132, 1)',
        datasets: [{
            order: 0,
            label: 'Inter-tap Interval',
            data: intervalChartArray,
            pointStyle: 'rectRot',
            radius: 5,
            hoverRadius: 10,
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1.2
        },
        {
            data: greenZonePosInterval,
            borderColor: 'rgba(44, 155, 8, 0.6)',
            borderDash: [5, 15],
            type: 'line',
            showLine: true,
            pointRadius: 0,
            fill: false
        }, {
            data: yellowZonePosInterval,
            borderColor: 'rgba(218, 251, 8, 0.6)',
            borderDash: [5, 15],
            type: 'line',
            showLine: true,
            pointRadius: 0,
            fill: false
        }, {
            data: redZonePosInterval,
            borderColor: 'rgba(194, 33, 9, 0.6)',
            borderDash: [5, 15],
            type: 'line',
            showLine: true,
            pointRadius: 0,
            fill: false
        }, {
            data: greenZoneNegInterval,
            borderColor: 'rgba(44, 155, 8, 0.6)',
            borderDash: [5, 15],
            type: 'line',
            showLine: true,
            pointRadius: 0,
            fill: false
        }, {
            data: yellowZoneNegInterval,
            borderColor: 'rgba(218, 251, 8, 0.6)',
            borderDash: [5, 15],
            type: 'line',
            showLine: true,
            pointRadius: 0,
            fill: false
        }, {
            data: redZoneNegInterval,
            borderColor: 'rgba(194, 33, 9, 0.6)',
            borderDash: [5, 15],
            type: 'line',
            showLine: true,
            pointRadius: 0,
            fill: false
        },
        {
            data: soundOffLineInterval,
            borderColor: 'rgba(255, 99, 132, 0.3)',
            borderDash: [5, 15],
            type: 'line',
            showLine: true,
            pointRadius: 0,
            fill: false,
            spanGaps: false
        },
        {
            data: soundOnLineInterval,
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
                    max: yMaxInterval,
                    min: yMinInterval
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
                filter: function (legendItem, data) {
                    return legendItem.datasetIndex == 0;
                }
            }
        }
    }
});

//Create the chart for the asynchrony graph
let asynchronyGraph = new Chart(asynchronyGraphElement.getContext('2d'), {
    type: 'scatter',
    data: {
        fill: true,
        backgroundColor: 'rgba(255, 99, 132, 1)',
        datasets: [{
            order: 0,
            label: 'Asynchrony',
            data: asynchronyChartArray,
            pointStyle: 'rectRot',
            radius: 5,
            hoverRadius: 10,
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1.2
        },
        {
            data: greenZonePosAsynchrony,
            borderColor: 'rgba(44, 155, 8, 0.6)',
            borderDash: [5, 15],
            type: 'line',
            showLine: true,
            pointRadius: 0,
            fill: false
        }, {
            data: yellowZonePosAsynchrony,
            borderColor: 'rgba(218, 251, 8, 0.6)',
            borderDash: [5, 15],
            type: 'line',
            showLine: true,
            pointRadius: 0,
            fill: false
        }, {
            data: redZonePosAsynchrony,
            borderColor: 'rgba(194, 33, 9, 0.6)',
            borderDash: [5, 15],
            type: 'line',
            showLine: true,
            pointRadius: 0,
            fill: false
        }, {
            data: greenZoneNegAsynchrony,
            borderColor: 'rgba(44, 155, 8, 0.6)',
            borderDash: [5, 15],
            type: 'line',
            showLine: true,
            pointRadius: 0,
            fill: false
        }, {
            data: yellowZoneNegAsynchrony,
            borderColor: 'rgba(218, 251, 8, 0.6)',
            borderDash: [5, 15],
            type: 'line',
            showLine: true,
            pointRadius: 0,
            fill: false
        }, {
            data: redZoneNegAsynchrony,
            borderColor: 'rgba(194, 33, 9, 0.6)',
            borderDash: [5, 15],
            type: 'line',
            showLine: true,
            pointRadius: 0,
            fill: false
        },
        {
            data: soundOffLineAsynchrony,
            borderColor: 'rgba(255, 99, 132, 0.3)',
            borderDash: [5, 15],
            type: 'line',
            showLine: true,
            pointRadius: 0,
            fill: false,
            spanGaps: false
        },
        {
            data: soundOnLineAsynchrony,
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
                    max: yMaxAsynchrony,
                    min: yMinAsynchrony
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
                filter: function (legendItem, data) {
                    return legendItem.datasetIndex == 0;
                }
            }
        }
    }
});

let scoreString = document.querySelector("#score");

score = Math.round(score * 100) / 100;


scoreString.innerHTML = "Score: " + score + "%";


function resetToParamSelect() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            window.location = "userdashboard.html";
        } else {
            window.location = "parameters.html";
        }
    });
}

function changeToIntervalGraph() {
    intervalGraphElement.style.display = "initial";
    asynchronyGraphElement.style.display = "none";
}

function changeToAsynchronyGraph() {
    intervalGraphElement.style.display = "none";
    asynchronyGraphElement.style.display = "initial";
}
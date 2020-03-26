let ctx = document.getElementById('Results').getContext('2d');
let score = sessionStorage.getItem('score');
let data = sessionStorage.getItem('data');
let duration = sessionStorage.getItem('timeWOSound');
let bpm = sessionStorage.getItem('bpm');
let userId = sessionStorage.getItem('uid');
let total = sessionStorage.getItem('totalTapArray');

data = JSON.parse(data);

console.log(userId);

console.log(total);

let chartArray = [];
data.forEach(tap => {
    let beat = Math.round(tap.beat/10)/100;
    let delta = Math.round(tap.delta);
    chartArray.push({x: (beat)*tap.cycleNumber, y: delta})
});
console.log(chartArray);

let yMax = 30000/bpm;
let yMin = yMax * -1;

let myChart = new Chart(ctx, {
type: 'scatter',
data: {
fill: true,
backgroundColor: 'rgba(255, 99, 132, 1)',
datasets: [{
    label: 'Accuracy of taps',
    data: chartArray,
    pointStyle: 'rectRot',
    radius: 5,
    hoverRadius: 10,
    borderColor: 'rgba(255, 99, 132, 1)',
    borderWidth: 1.2
}],

},
options: {
scales: {
    yAxes: [{
        ticks: {
            beginAtZero: false,
            min: yMin,
            max: yMax
        }
    }]
}
}
});

let scoreString = document.querySelector("#score");

score *= 100;
score = Math.round(score*100)/100;


scoreString.innerHTML = "Score: " + score + "%";

//sessionStorage.clear();

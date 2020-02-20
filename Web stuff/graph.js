var ctx = document.getElementById('Results').getContext('2d');
var myChart = new Chart(ctx, {
type: 'line',
data: {
fill: false,
labels: ['10 seconds', '20 seconds', '30 seconds', '40 seconds', '50 seconds', '60 seconds'],
datasets: [{
    label: 'Accuracy of taps',
    data: [-1.3, -5.2, 3.3, 5.1, 2.3, 3.4],
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
            beginAtZero: false
        }
    }]
}
}
});

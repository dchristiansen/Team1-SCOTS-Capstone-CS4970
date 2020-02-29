function start() {
  var x = document.getElementById("circle");
  var y = document.getElementById("startButton");
  x.classList.remove("hidden");
  y.style.display = "none";
  var  q = sessionStorage.getItem("bpm");
  var g = sessionStorage.getItem("timeWSound");
  var z = sessionStorage.getItem("cycles");
  var i = sessionStorage.getItem("timeWOSound");
  var j = sessionStorage.getItem("feedback");
  console.log(g + " " + q + " "+ " "+ z + " "+ i + " " + j)
}

function setParams() {
  var bpm = document.getElementById("BPM").value;
  var timeWSound = document.getElementById("timeWSound").value;
  var cycles = document.getElementById("cycles").value;
  var timeWOSound = document.getElementById("timeWOSound").value;
  var feedback = document.getElementById("feedback").checked;
  sessionStorage.clear();
  sessionStorage.setItem("aid", "Custom Session");
  sessionStorage.setItem("bpm",bpm);
  sessionStorage.setItem("timeWSound",timeWSound);
  sessionStorage.setItem("cycles",cycles);
  sessionStorage.setItem("timeWOSound",timeWOSound);
  sessionStorage.setItem("feedback",feedback);
}

firebase.auth().onAuthStateChanged(user => {
    if(user)
    {
      user.getIdTokenResult().then(idTokenResult => {
        user.admin = idTokenResult.claims.admin;
        // If user is an admin, redirect to rPortal
        if(user.admin)
        {
          alert("Researchers cannot play the game");
          window.location = "/researcher/rPortal.html";
        }
      })
    }
})

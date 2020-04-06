import { createAssignment } from "./Data.js";
// Button to trigger insertAssignment function
var btnSetAssignment = document.getElementById("btnSetAssignment");
/*
    inserts assignment into the database
*/
function insertAssignment() {
    // Grab fields from the document
    var assignmentName = document.getElementById("assignment_name").value;
    var bpm = document.getElementById("BPM").value;
    var timeWSound = document.getElementById("timeWSound").value;
    var cycles = document.getElementById("cycles").value;
    var timeWOSound = document.getElementById("timeWOSound").value;
    var feedback = document.getElementById("feedback").checked;

    var userIDs = [];

    createAssignment(assignmentName, bpm, timeWSound, timeWOSound, cycles, feedback, userIDs);

}
btnSetAssignment.onclick = insertAssignment;

firebase.auth().onAuthStateChanged(user => {
    if(!user) {
        console.log("You are not signed in.");
        window.location = "index.html";
    }

    if(user)
    {
        user.getIdTokenResult().then(idTokenResult => {
            user.admin = idTokenResult.claims.admin;
            if(!user.admin)
            {
                alert("You are not an admin.");
                window.location = "userdashboard.html";
            }
        });
    }
});


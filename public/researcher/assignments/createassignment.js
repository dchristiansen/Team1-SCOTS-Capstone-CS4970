import { createAssignment } from "../..//Data.js";
// Button to trigger insertAssignment function
var btnSetAssignment = document.getElementById("btnSetAssignment");
/*
    insertAssignment:
    Inserts assignment into the database
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

    // Call imported createAssignment function to insert assignment into the database
    createAssignment(assignmentName, bpm, timeWSound, timeWOSound, cycles, feedback, userIDs);

}
btnSetAssignment.onclick = insertAssignment;

// Oberserver for FirebaseAuth
firebase.auth().onAuthStateChanged(user => {
    // If user is not logged in, then redirect to the login page
    if(!user) {
        console.log("You are not signed in.");
        window.location = "/login.html";
    }

    // If a user is signed in
    if(user)
    {
        // Get admin token result
        user.getIdTokenResult().then(idTokenResult => {
            user.admin = idTokenResult.claims.admin;
            // If user is not an admin, redirect to userdashboard
            if(!user.admin)
            {
                alert("You are not an admin.");
                window.location = "/user/userdashboard.html";
            }
        });
    }
});


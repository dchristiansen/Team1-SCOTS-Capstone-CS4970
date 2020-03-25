import { getAssignmentsForUser } from "./Data.js"
(function() {

    const greeting = document.getElementById("greeting");
    var username;
    const btnLogout = document.getElementById("btnLogout");
    const assignmentTable = document.querySelector("#tablebody");

    btnLogout.addEventListener("click", e => {
        firebase.auth().signOut().then(function() {
            window.location = "index.html";
        }).catch(function(error) {
            console.log(error);
        });
    });

    firebase.auth().onAuthStateChanged(async function(user) {
        if (user) {
            username = user.email.split("@")[0];
            greeting.innerHTML = "Welcome, " + username + "!";
            let authId = user.uid;
            //TODO: If user.uid is not the primary key for the user table, query user table to get
            //primary key. Otherwise, save autId into sessionStorage
            sessionStorage.setItem('uid', authId);

            let assignmentsArray = await getAssignmentsForUser(authId);
            console.log(assignmentsArray.dataArray);

            let newHtml="";

            assignmentsArray.dataArray.forEach(assignment => {
                newHtml += "<tr>";
                newHtml += "<td>" + assignment.data.assignmentLabel + "</td>";
                newHtml += "<td>" + assignment.data.parameters.bpm + "</td>";
                newHtml += "<td>" + assignment.data.parameters.soundOnTime + "</td>";
                newHtml += "<td>" + assignment.data.parameters.soundOffTime + "</td>";
                if(assignment.data.parameters.feedback) {
                    newHtml += "<td>On</td>";
                } else {
                    newHtml += "<td>Off</td>";
                }
                newHtml += "<td>" + assignment.data.parameters.cycles + "</td>";
                newHtml += "</tr>";
            });

            assignmentTable.innerHTML += newHtml;
        } else {
          // No user is signed in.
        }
    });


    
}());
import { getAssignmentsForUser } from "./Data.js"


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
            let tr = document.createElement('tr');
            tr.innerHtml = "<tr>";
            //newHtml += "<tr>";
            tr.innerHTML += "<td>" + assignment.data.assignmentLabel + "</td>";
            tr.innerHTML += "<td>" + assignment.data.parameters.bpm + "</td>";
            tr.innerHTML += "<td>" + assignment.data.parameters.soundOnTime + "</td>";
            tr.innerHTML += "<td>" + assignment.data.parameters.soundOffTime + "</td>";
            if(assignment.data.parameters.feedback) {
                tr.innerHTML += "<td>On</td>";
            } else {
                tr.innerHTML += "<td>Off</td>";
            }
            tr.innerHTML += "<td>" + assignment.data.parameters.cycles + "</td>";
            tr.innerHTML += "</tr>";
            tr.setAttribute('data-parameters', assignment.data.assignmentLabel + "," + assignment.data.parameters.bpm + "," + assignment.data.parameters.soundOnTime + ","
            + assignment.data.parameters.soundOffTime + "," + assignment.data.parameters.feedback + "," + assignment.data.parameters.cycles);
            assignmentTable.appendChild(tr);
        });

        //assignmentTable.innerHTML += newHtml;
    } else {
        // No user is signed in.
    }
});

$("#tablebody").on("click", "tr", function(){
    console.log($(this).data('parameters'));
    let params = $(this).data('parameters').split(",");
    console.log(params);

    let assignment = params[0];
    let bpm = params[1];
    let timeWSound = params[2];
    let timeWOSound = params[3];
    let cycles = params[5];
    let feedback = params[4];

    sessionStorage.setItem('aid', assignment);
    sessionStorage.setItem("bpm",bpm);
    sessionStorage.setItem("timeWSound",timeWSound);
    sessionStorage.setItem("cycles",cycles);
    sessionStorage.setItem("timeWOSound",timeWOSound);
    sessionStorage.setItem("feedback",feedback);

    window.location = "start.html";
});
$("td > a").on("click", function(e){
    e.stopPropagation();
});

import { getAssignmentsForUser } from "/Data.js"


const greeting = document.getElementById("greeting");
var username;
const btnLogout = document.getElementById("btnLogout");
const assignmentTable = document.querySelector("#tablebody");

btnLogout.addEventListener("click", e => {
    firebase.auth().signOut().then(function() {
        window.location = "/login.html";
    }).catch(function(error) {
        console.log(error);
    });
});

firebase.auth().onAuthStateChanged(async function(user) {
    if (user) {
        
        // Get admin token result
        user.getIdTokenResult().then(async(idTokenResult) => {
            user.admin = idTokenResult.claims.admin;
            if(!user.admin)
            {
                username = user.email.split("@")[0];
                greeting.innerHTML = "Welcome, " + username + "!";
                let authId = user.uid;
                //TODO: If user.uid is not the primary key for the user table, query user table to get
                //primary key. Otherwise, save autId into sessionStorage
                sessionStorage.setItem('uid', authId);

                //Get all assignments for the current user
                let assignmentsArray = await getAssignmentsForUser(authId);
                //console.log(assignmentsArray.dataArray);

                //For each assignment fetched, add the corresponding row
                assignmentsArray.dataArray.forEach(assignment => {
                    let tr = document.createElement('tr');
                    tr.innerHtml = "<tr>";
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

                    //Set the parameter attribute to the values within the table
                    tr.setAttribute('data-parameters', assignment.data.assignmentLabel + "," + assignment.data.parameters.bpm + "," + assignment.data.parameters.soundOnTime + ","
                    + assignment.data.parameters.soundOffTime + "," + assignment.data.parameters.feedback + "," + assignment.data.parameters.cycles);

                    //Append the row to the table
                    assignmentTable.appendChild(tr);
                });
            }
            else 
            {
                alert("Researchers do not have access to the User Dashboard");
                window.location = "/researcher/rPortal.html";
            }
        });
        

    } else {
        // No user is signed in.
      console.log("No user is signed in");
      window.location = "/login.html";
    }
});

$("#tablebody").on("click", "tr", function(){
    //console.log($(this).data('parameters'));
    //Get the parameters in the form of an array
    let params = $(this).data('parameters').split(",");

    let assignment = params[0];
    let bpm = params[1];
    let timeWSound = params[2];
    let timeWOSound = params[3];
    let cycles = params[5];
    let feedback = params[4];

    //Set all the parameters in sessionStorage
    sessionStorage.clear();
    sessionStorage.setItem('aid', assignment);
    sessionStorage.setItem("bpm",bpm);
    sessionStorage.setItem("timeWSound",timeWSound);
    sessionStorage.setItem("cycles",cycles);
    sessionStorage.setItem("timeWOSound",timeWOSound);
    sessionStorage.setItem("feedback",feedback);

    //Jump to start page
    window.location = "/user/start.html";
});

$("td > a").on("click", function(e){
    e.stopPropagation();
});

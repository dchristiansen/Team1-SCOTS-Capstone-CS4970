import { getUsers } from "./Data.js";

var firestore = firebase.firestore();
const btnSetAssignment = document.getElementById("btnSetAssignment");
const btnAssignToUsers = document.getElementById("btnAssignToUsers");

btnAssignToUsers.addEventListener("click", e => {
    let checkboxes = $("#tablebody input:checked");
    if (checkboxes.length == 0)
    {
        alert("Please select at least one user to assign");
    }
    else
    {
        checkboxes = $("#tablebody input");
        for(let i = 0; i < userData.length; i++)
        {
            if(checkboxes[i].checked)
            {
                let assignTo = userData[i].id;
                if (!assignedUIDs.includes(assignTo))
                {
                    assignedUIDs.push(assignTo);
                }
            }
        }

        let params = new URLSearchParams(location.search);
        let assignmentId = params.get('id');
        var assignmentDoc = firestore.collection("assignments").doc(assignmentId)

        assignmentDoc.update({
            userIDs: assignedUIDs
        }).then(function() {
            alert("Assigned users successfully updated.");
        }).catch(function(error) {
            console.error(error);
        });
    }
});

btnSetAssignment.addEventListener("click", e => {

    var assignmentLabel = document.getElementById("assignment_name").value;
    var bpm = document.getElementById("BPM").value;
    var timeWSound = document.getElementById("timeWSound").value;
    var cycles = document.getElementById("cycles").value;
    var timeWOSound = document.getElementById("timeWOSound").value;
    var feedback = document.getElementById("feedback").checked;

    let params = new URLSearchParams(location.search);
    let assignmentId = params.get('id');

    var parameters = {
        bpm: bpm,
        cycles: cycles,
        feedback: feedback,
        soundOffTime: timeWOSound,
        soundOnTime: timeWSound
    };

    var assignmentDoc = firestore.collection("assignments").doc(assignmentId);

    assignmentDoc.update({
        assignmentLabel: assignmentLabel,
        parameters: parameters
    }).then(function() {
        alert("Assignment successfully updated.");
    }).catch(function(error) {
        console.error(error);
    });
});

async function setHeader(assignmentId) {
    let header = document.querySelector("#assignmentidheader");
    header.innerHTML = "Assignment: " + assignmentId;
}

let assignedUIDs = [];
async function populateParameters(assignmentId) {

    var assignmentDoc = await firestore.collection("assignments").doc(assignmentId);

    await assignmentDoc.get().then(function(doc) {
        if(doc.exists)
        {
            var assignmentLabel = doc.data().assignmentLabel;
            var parameters = doc.data().parameters;

            assignedUIDs = doc.data().userIDs;

            document.getElementById("assignment_name").value = assignmentLabel;
            document.getElementById("BPM").value = parameters.bpm;
            document.getElementById("timeWSound").value = parameters.soundOnTime;
            document.getElementById("timeWOSound").value = parameters.soundOffTime;
            document.getElementById("cycles").value = parameters.cycles;
            
            if (!parameters.feedback)
            {
                document.getElementById("feedback").removeAttribute("checked");
            }
        }
    });
}
let userData;
async function populateUserTable()
{
    let table = document.querySelector("#tablebody");
    let usersCall = await getUsers();
    userData = usersCall.dataArray;
    userData.forEach(function(obj) {
        let tr = document.createElement('tr');
        let td_id = document.createElement('td');
        let td_ses = document.createElement('td');

        let latestSessionTime = obj.data.latestSessionTime;
        if(latestSessionTime)
        {
            latestSessionTime = latestSessionTime.seconds * 1000;
            latestSessionTime = new Date(latestSessionTime);
        }
        else
        {
            latestSessionTime = "N/A";
        }
        td_ses.innerHTML = latestSessionTime;
        td_id.innerHTML = obj.data.userID;
        
        tr.appendChild(td_id);
        tr.appendChild(td_ses);

        let td_checkbox = document.createElement('td');
        let label = document.createElement('label');
        let checkbox = document.createElement('input');
        let span = document.createElement('span');
        checkbox.type = "checkbox";
        label.appendChild(checkbox);
        label.appendChild(span);
        td_checkbox.appendChild(label);
        tr.appendChild(td_checkbox);
        table.appendChild(tr);
    });
}

firebase.auth().onAuthStateChanged(user => {
    if(user)
    {
        user.getIdTokenResult().then(idTokenResult => {
            user.admin = idTokenResult.claims.admin;
            if(user.admin)
            {
                //document.getElementById("btnSetAssignment").onclick = updateAssignment;
                let params = new URLSearchParams(location.search);
                let assignmentId = params.get('id');
                setHeader(assignmentId);
                populateParameters(assignmentId);
                populateUserTable();
            }
            else
            {
                alert("You are not an admin.");
                window.location = "userdashboard.html";
            }
        });
    }
    else
    {
        console.log("You are not signed in.");
        window.location = "index.html";
    }
});
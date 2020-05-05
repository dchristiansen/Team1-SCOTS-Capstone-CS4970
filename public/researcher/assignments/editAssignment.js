import { getUsers } from "../..//Data.js";

var firestore = firebase.firestore();
// Button to set the assignment parameters
const btnSetAssignment = document.getElementById("btnSetAssignment");
// Button to assign assignments to users
const btnAssignToUsers = document.getElementById("btnAssignToUsers");
// Button to delete assignment
const btnDeleteAssignment = document.getElementById("btnDeleteAssignment");

/*
    btnDeleteAssignment:
    Event listener on the button delete an assignment from the database
*/
btnDeleteAssignment.addEventListener("click", e => {
    if(confirm("Are you sure you want to delete this assignment?"))
    {
        // Grab doc id of the current assignment
        let params = new URLSearchParams(location.search);
        let assignmentId = params.get('id');

        // Grab assignment document and then delete the document
        var assignmentDoc = firestore.collection("assignments").doc(assignmentId);
        assignmentDoc.delete().then(function(){
            alert("Successfully deleted assignment");
            window.location = "/researcher/assignments/assignments.html";
        }).catch(function(error) {
            alert("Error deleting assignment: " + error);
        });
    }   
});

/*
    btnAssignToUsers:
    Event Listener on the button to get the array of checked users and
    set the userIDs field in the database for the assignment
*/
btnAssignToUsers.addEventListener("click", e => {
    // Get checkboxes
    let checkboxes = $("#tablebody input:checked");
    
    // Get input of the checkboxes
    checkboxes = $("#tablebody input");
    // Loop through userData array which corresponds to the checkboxes

    var assignedUIDs = [];

    for(let i = 0; i < userData.length; i++)
    {
        // If a checkbox is checked
        if(checkboxes[i].checked)
        {
            // Grab the uid of the ith user in the userData array
            let assignTo = userData[i].id;
            // Push the uid of the user onto the array
            assignedUIDs.push(assignTo);
        }
    }

    // Grab doc id of the current assignment
    let params = new URLSearchParams(location.search);
    let assignmentId = params.get('id');

    // Assignment document reference
    var assignmentDoc = firestore.collection("assignments").doc(assignmentId)

    // Update the userIDs array field with assignedUIDs array
    assignmentDoc.update({
        userIDs: assignedUIDs
    }).then(function() {
        alert("Assigned users successfully updated.");
    }).catch(function(error) {
        console.error(error);
    });
});

/*
    btnSetAssignment
    Event Listener on the button update the assignment
    parameters in the database
*/
btnSetAssignment.addEventListener("click", e => {

    // Get fields from the html document
    var assignmentLabel = document.getElementById("assignment_name").value;
    var bpm = document.getElementById("BPM").value;
    var timeWSound = document.getElementById("timeWSound").value;
    var cycles = document.getElementById("cycles").value;
    var timeWOSound = document.getElementById("timeWOSound").value;
    var feedback = document.getElementById("feedback").checked;


    if (assignmentLabel == null || assignmentLabel == "" ||
         bpm == null || bpm == "" || 
         timeWSound == null || timeWSound == "" ||
         cycles == null || cycles == "" ||
         timeWOSound == null || timeWOSound == "")
    {
        alert("All parameters must be set to edit an assignment");
    }
    else 
    {
        // Get the assignment document id
        let params = new URLSearchParams(location.search);
        let assignmentId = params.get('id');

        // Create parameters object
        var parameters = {
            bpm: bpm,
            cycles: cycles,
            feedback: feedback,
            soundOffTime: timeWOSound,
            soundOnTime: timeWSound
        };

        // Assignment document reference
        var assignmentDoc = firestore.collection("assignments").doc(assignmentId);

        // Update the assignment label and the parameters
        assignmentDoc.update({
            assignmentLabel: assignmentLabel,
            parameters: parameters
        }).then(function() {
            alert("Assignment successfully updated.");
        }).catch(function(error) {
            console.error(error);
        });
    }
});

/*
    setHeader
    parameter: assignmentId
    Set the header with the passed in assignmentId
*/
async function setHeader(assignmentId) {
    let header = document.querySelector("#assignmentidheader");
    var assignmentDoc = await firestore.collection("assignments").doc(assignmentId);
    await assignmentDoc.get().then(function(doc) {
        if(doc.exists)
        {
            header.innerHTML = "Assignment: " + doc.data().assignmentLabel;
        }
    });
}

/*
    populateParameters
    Parameter: assignmentId
    Repopulate the parameter fields based on the assignment that was clicked
    on from previous page
*/
async function populateParameters(assignmentId) {

    // Assignment document reference
    var assignmentDoc = await firestore.collection("assignments").doc(assignmentId);

    // Get the assignment document
    await assignmentDoc.get().then(function(doc) {
        // If the document exists
        if(doc.exists)
        {
            // Get fields from the database
            var assignmentLabel = doc.data().assignmentLabel;
            assignmentLabel = decode(assignmentLabel);

            var parameters = doc.data().parameters;
            // Set the values of the html document
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
/*
    populateUserTable
    Fetch all users and populate the user table
*/
async function populateUserTable(assignmentId)
{
    var assignedUIDs = [];
    var assignmentDoc = await firestore.collection("assignments").doc(assignmentId)

    await assignmentDoc.get().then(function(doc) {
        if(doc.exists)
        {
            assignedUIDs = doc.data().userIDs;
        }
    });

    // Get table from the html document
    let table = document.querySelector("#tablebody");
    // Get users
    let usersCall = await getUsers();
    userData = usersCall.dataArray;
    // Loop through usersData
    userData.forEach(function(obj) {
        // Create a row entry for each user
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
        
        // Append the user id and latest session time to the row
        tr.appendChild(td_id);
        tr.appendChild(td_ses);

        // Create checkbox
        let td_checkbox = document.createElement('td');
        let label = document.createElement('label');
        let checkbox = document.createElement('input');
        let span = document.createElement('span');
        checkbox.type = "checkbox";
        if(assignedUIDs.includes(obj.id))
        {
            checkbox.checked = true;
        }
        label.appendChild(checkbox);
        label.appendChild(span);
        td_checkbox.appendChild(label);

        // Append checkbox to the row
        tr.appendChild(td_checkbox);

        // Append row to the table
        table.appendChild(tr);
    });
}

// Observer for FirebaseAuth
firebase.auth().onAuthStateChanged((user) => {
    // If user is logged in
    if(user)
    {
        // Get admin token result
        user.getIdTokenResult().then(idTokenResult => {
            user.admin = idTokenResult.claims.admin;
            // If user is an admin
            if(user.admin)
            {
                // Get assignmentId from url (selected from previous page)
                let params = new URLSearchParams(location.search);
                let assignmentId = params.get('id');

                // Set the header with assignmentId
                setHeader(assignmentId);
                // Populate the parameters with the assignmentId
                populateParameters(assignmentId);
                // Populate the userTable
                populateUserTable(assignmentId);
            }
            else
            {
                // Alert that user is not admin and return to user dashboard
                alert("You are not an admin.");
                window.location = "/user/userdashboard.html";
            }
        });
    }
    else
    {
        // Not signed in so redirect to login screen
        console.log("You are not signed in.");
        window.location = "/login.html";
    }
});

// Function to select/deselct all checkboxes
$(document).ready(function() {
    $("#btnSelectAll").click(function() {
        let checked = !$(this).data('checked');
        $('input:checkbox').prop('checked', checked);
        $(this).val(checked ? 'uncheck all' : 'check all')
        $(this).data('checked', checked);
    })
})

function decode(str)
{
    var txt = document.createElement('textarea');
    txt.innerHTML = str;
    return txt.value;
}
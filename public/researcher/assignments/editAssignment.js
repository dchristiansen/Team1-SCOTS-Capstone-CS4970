import { getUsers } from "../..//Data.js";

var firestore = firebase.firestore();
// Button to set the assignment parameters
const btnSetAssignment = document.getElementById("btnSetAssignment");
// Button to assign assignments to users
const btnAssignToUsers = document.getElementById("btnAssignToUsers");
// Button to delete assignment
const btnDeleteAssignment = document.getElementById("btnDeleteAssignment");

const table = document.querySelector("#tablebody");
let userData;
let currentUserArray;
let numPages;
let currentPage = 1;
let entriesPerPage = 5;

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

let checkedArray;

/*
    btnAssignToUsers:
    Event Listener on the button to get the array of checked users and
    set the userIDs field in the database for the assignment
*/
btnAssignToUsers.addEventListener("click", e => {
    let assignedUIDs = [];

    for(let i = 0; i < checkedArray.length; i++) {
        if(checkedArray[i] == true) {
            let assignTo = userData[i].id;
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
    assignmentLabel = encode(assignmentLabel);

    var bpm = document.getElementById("BPM").value;
    var timeWSound = document.getElementById("timeWSound").value;
    var cycles = document.getElementById("cycles").value;
    var timeWOSound = document.getElementById("timeWOSound").value;
    var feedback = document.getElementById("feedback").checked;
    var defaultAssignment = document.querySelector("#default").checked;

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
          parameters: parameters,
          default: defaultAssignment,
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
            var defaultAssignment = doc.data().default;
            // Set the values of the html document
            document.getElementById("assignment_name").value = assignmentLabel;
            document.getElementById("BPM").value = parameters.bpm;
            document.getElementById("timeWSound").value = parameters.soundOnTime;
            document.getElementById("timeWOSound").value = parameters.soundOffTime;
            document.getElementById("cycles").value = parameters.cycles;
            document.querySelector("#default").checked = defaultAssignment;
            if (!parameters.feedback)
            {
                document.getElementById("feedback").removeAttribute("checked");
            }
        }
    });
}

/*
    populateUserTable
    Fetch all users and populate the user table
*/
async function populateUserTable(assignmentId, newPage)
{
    table.innerHTML = "";

    let startPosition = (newPage - 1) * entriesPerPage;

    let newArray = currentUserArray.slice(startPosition, startPosition + 5);

    // Loop through usersData
    for(let i = 0; i < newArray.length; i++){
        let obj = newArray[i];
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
        td_ses.innerHTML = latestSessionTime.toLocaleString(navigator.language);
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
        checkbox.addEventListener('input', checkCheckedArray);
        if(checkedArray[i + (currentPage - 1) * entriesPerPage])
        {
            checkbox.checked = true;
        } else {
            checkbox.checked = false;
        }
        label.appendChild(checkbox);
        label.appendChild(span);
        td_checkbox.appendChild(label);

        // Append checkbox to the row
        tr.appendChild(td_checkbox);

        // Append row to the table
        table.appendChild(tr);
    }
    createPagination();
}

/*
  createPagination:
  Creates the pagination icons beneath the table,
  based on the number of pages
*/
function createPagination() {
    pagination.innerHTML = "";
    numPages = Math.ceil(currentUserArray.length / entriesPerPage);

    //Create the left chevron for page scrolling
    let leftChevron = document.createElement('li');
    leftChevron.className = "waves-effect";

    let leftChevronA = document.createElement('a');
    leftChevronA.href = "#!";
    leftChevronA.setAttribute('data-page', "prev");

    let leftChevronIcon = document.createElement('i');
    leftChevronIcon.className = "material-icons";
    leftChevronIcon.innerHTML = "chevron_left";

    leftChevronA.appendChild(leftChevronIcon);
    leftChevron.appendChild(leftChevronA);
    pagination.appendChild(leftChevron);

    //Create the buttons for each page
    for (let i = 0; i < numPages; i++) {
        let current = i + 1;
        let li = document.createElement('li');
        li.id = "page" + current;
        li.className = "waves-effect";
        if (current == currentPage) {
            li.className += " active";
        }

        let a = document.createElement('a');
        a.setAttribute('data-page', current)
        a.innerHTML = current;

        li.appendChild(a);
        pagination.appendChild(li);
    }

    //Add the right chevron for page scrolling
    let rightChevron = document.createElement('li');
    rightChevron.className = "waves-effect";

    let rightChevronA = document.createElement('a');
    rightChevronA.href = "#!";
    rightChevronA.setAttribute('data-page', "next")

    let rightChevronIcon = document.createElement('i');
    rightChevronIcon.className = "material-icons";
    rightChevronIcon.innerHTML = "chevron_right";

    rightChevronA.appendChild(rightChevronIcon);
    rightChevron.appendChild(rightChevronA);
    pagination.appendChild(rightChevron);
}

function checkCheckedArray(e) {
    let index = e.path[3].rowIndex - 1;
    index += (currentPage - 1) * entriesPerPage;
    checkedArray[index] = !checkedArray[index];
}

function getAssignedUsers() {
    for(let i = 0; i < userData.length; i++) {
        if(assignedUIDs.includes(userData[i].id)) {
            checkedArray[i] = true;
        } else {
            checkedArray[i] = false;
        }
    }
}

let assignmentId;
let assignedUIDs = [];

 /* onAuthStateChanged(user)
  Observer for Authentication State:
  If the user is logged in and the user is an admin, then this listener will
  set the header, parameters, and the user table. Otherwise, go back to the user dashboard
  or back to the login screen if not authenticated
*/

firebase.auth().onAuthStateChanged((user) => {
    // If user is logged in
    if(user)
    {
        // Get admin token result
        user.getIdTokenResult().then(async function(idTokenResult) {
            user.admin = idTokenResult.claims.admin;
            // If user is an admin
            if(user.admin)
            {
                // Get assignmentId from url (selected from previous page)
                let params = new URLSearchParams(location.search);
                assignmentId = params.get('id');

                // Set the header with assignmentId
                setHeader(assignmentId);
                // Populate the parameters with the assignmentId
                populateParameters(assignmentId);

                assignedUIDs = [];
                var assignmentDoc = await firestore.collection("assignments").doc(assignmentId)
            
                await assignmentDoc.get().then(function(doc) {
                    if(doc.exists)
                    {
                        assignedUIDs = doc.data().userIDs;
                    }
                });
            
                // Get users
                let usersCall = await getUsers();
                currentUserArray = userData = usersCall.dataArray;

                checkedArray = new Array(userData.length);
            
                numPages = Math.ceil(currentUserArray.length/entriesPerPage);

                getAssignedUsers();

                // Populate the userTable
                populateUserTable(assignmentId, 1);
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
        $('input:checkbox').not("#feedback").prop('checked', checked);
        $(this).val(checked ? 'uncheck all' : 'check all');
        $(this).data('checked', checked);
        for(let i = 0; i < checkedArray.length; i++) {
            checkedArray[i] = checked;
        }
    })
})

$("#pagination").on("click", "a", function changePage(){
    let newPage = $(this).data('page');
  
    //Change to the new page
    if(newPage != currentPage) {
        //For the right chevron
        if(newPage == "next") {
            newPage = currentPage+1;
        }
        //For the left chevron 
        else if(newPage == "prev") {
            newPage = currentPage-1;
        }
  
        //Ensure that the new page can be accessed (in case left or right chevrons move it past the number of pages)
        if(newPage <= numPages && newPage > 0) {
            //Change the current page
            currentPage = newPage;

            populateUserTable(assignmentId, newPage);
    
            //Change the active page in the pagination menu
            document.querySelector("#page" + currentPage).className = "waves-effect";
            document.querySelector("#page" + newPage).className = "waves-effect active";
            }
    }
  });

/*
    decode:
    decodes string when reading encoded string from DB
*/
function decode(str)
{
    var txt = document.createElement('textarea');
    txt.innerHTML = str;
    return txt.value;
}

/*
    encode:
    Encodes assignment label to prevent XSS
*/
function encode(str){
    return String(str).replace(/[^\w. ]/gi, function(c){
       return '&#'+c.charCodeAt(0)+';';
    });
}
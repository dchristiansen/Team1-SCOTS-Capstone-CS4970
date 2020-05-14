import { getAllSessionsForUser } from "../..//Data.js";
import { getUser } from "../..//Data.js";

// From to recover a user's password
const accountRecoveryForm = document.querySelector(".admin-recovery");
// Form to delete a user
const deleteUserForm = document.querySelector(".admin-delete-user");

// Get table from the html document
const table = document.querySelector("#tablebody");
let currentAssignmentArray = [];
let checkedArray;
let numPages;
let currentPage = 1;
let entriesPerPage = 5;

/*
    setHeader
    parameter: userid
    Set the header with the passed in assignmentId
*/
async function setHeader(userid) {
    let header = document.querySelector("#useridheader");
    let usercall = await getUser(userid);
    let username = usercall.data.userID;
    header.innerHTML = "User ID: " + username;
}

/*
    populateTable
    Parameter: userid
    Populates the sessions for a given userid
*/
async function populateTable(newPage) {
    table.innerHTML = "";
    let startPosition = (newPage - 1) * entriesPerPage;
    let newArray = currentAssignmentArray.slice(startPosition, startPosition + 5);

    // Loop through sessionData
    for(let i = 0; i < newArray.length; i++){
        let obj = newArray[i];
        // Create a row entry for each session
        let tr = document.createElement('tr');

        // Create a column for the session id and append the it to the row
        let td_id = document.createElement('td');
        let sessionID = obj.data.assignmentID
        td_id.innerHTML = sessionID;
        tr.appendChild(td_id);

        // Create a column for the latest session time and append it to the row
        let td_time = document.createElement('td');
        let sessionTime = obj.data.sessionTime;
        sessionTime = sessionTime.seconds * 1000;
        sessionTime = new Date(sessionTime);
        td_time.innerHTML = sessionTime.toLocaleString(navigator.language);
        tr.appendChild(td_time);

        // Create a column for the parameters
        let td_params = document.createElement('td');
        // Grab the parameters from obj.data
        let parameters = obj.data.parameters;
        let fbt = "";
        if (parameters.feedback == "true") {

            fbt = "On"
        } else {
            fbt = "Off"
        }
        // Fill in the text with parameter and append the column to the row
        td_params.innerHTML = parameters.bpm + " BPM, " + parameters.soundOnTime + " On, " + parameters.soundOffTime + " Off, " + parameters.cycles + " Cycles, Feedback " + fbt;
        tr.appendChild(td_params);

        // Create checkbox
        let td_checkbox = document.createElement('td');
        let label = document.createElement('label');
        let checkbox = document.createElement('input');
        let span = document.createElement('span');
        checkbox.type = "checkbox";
        checkbox.addEventListener('input', checkCheckedArray);
        if(checkedArray[i + (currentPage - 1) * entriesPerPage]) {
            checkbox.checked = true;
        }
        label.appendChild(checkbox);
        label.appendChild(span);
        td_checkbox.appendChild(label);
        tr.appendChild(td_checkbox);
        table.appendChild(tr);

        // Remove the disabled property for the select all button once table is populated
        let selectBtn = document.querySelector("#select");
        selectBtn.classList.remove("disabled");
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
    numPages = Math.ceil(currentAssignmentArray.length / entriesPerPage);

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

/*
    checkCheckedArray
    Receives: event e
    Changes the value within the checked array corresponding to the checked checkbox
*/
//Issue here with Firefox compatibility. Events are recorded differently on Firefox breaking this function
function checkCheckedArray(e) {
    let index = e.path[3].rowIndex - 1;
    index += (currentPage - 1) * entriesPerPage;
    checkedArray[index] = !checkedArray[index];
}

/*
    download:
    onclick function of the download button that gets
    the selected sessions of a user and downloads them
*/
function download() {
    let checkboxes = $("#tablebody input:checked");
    if (checkboxes.length == 0) {
        alert("Please select at least one session to download")
    } else {
        let sessionsDL = [];
        // Get new zip object
        let zip = new JSZip();
        checkboxes = $("#tablebody input");
        // Iterate through sessionData
        for (let i = 0; i < checkedArray.length; i++) {
            // If a session is checked, push that session into the array
            if (checkedArray[i]) {
                sessionsDL.push({ session: sessionData[i].data, id: i });
            }
        }
        // If there is only one session to be downloaded
        if (sessionsDL.length == 1) {
            // Grab that session
            let session = sessionsDL[0];
            // Format the data
            let data = formatCSV(session.session);
            // Create an Excel Workbook
            let wb = XLSX.utils.book_new()
            // Write the data to an Excel worksheet
            let ws = XLSX.utils.json_to_sheet(data);
            // Add the worksheet to the workbook
            XLSX.utils.book_append_sheet(wb, ws, "session");
            //Download the workbook
            XLSX.writeFile(wb, 'session' + session.id + '.xlsx');
            return;
        } else {
            // Iterate through each session
            sessionsDL.forEach(function (session) {
                // Format the workbook
                let data = formatCSV(session.session);
                let wb = XLSX.utils.book_new()
                let ws = XLSX.utils.json_to_sheet(data);
                XLSX.utils.book_append_sheet(wb, ws, "session");
                // Write workbook data to a binary string
                let wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'binary' });
                // Add binary of workbook to zip file
                zip.file("session" + session.id + ".xlsx", wbout, { binary: true });
            });
            // Download Zip File
            zip.generateAsync({ type: "blob" }).then(function (blob) {
                window.saveAs(blob, "sessions.zip");
            }, function (err) {
                jQuery("#blob").text(err);
            });
        }
    }
}

/*
    formatCsv:
    Parameter: session
    Properly formats the csv file using the template
    from Dr. Marmelat
*/
function formatCSV(session) {
    let parameters = session.parameters;
    let taps = session.taps;
    let score = session.score
    let data = [];
    data.push(["Tempo (BPM)", parameters.bpm]);
    data.push(["Time On (ms)", parameters.soundOnTime]);
    data.push(["Time Off (ms)", parameters.soundOffTime]);
    data.push(["Cycles", parameters.cycles]);
    data.push(["Feedback", parameters.feedback]);
    data.push([]);
    data.push(["Score", score]);
    data.push([]);
    data.push(["Cycle Number", "Sound On", "Beat time (ms)", "Tap time (ms)", "Release time (ms)", "Tap intervals (ms)", "Asynchrony (ms)", "Key-press duration (ms)"]);
    taps.forEach(function (tap) {
        let splitString = tap.split(",");
        data.push([splitString[0], splitString[1], splitString[2], splitString[3], splitString[4], splitString[5], splitString[6], splitString[7]]);
    });
    return data;
}

let sessionData;

/*
  onAuthStateChanged(user)
  Observer for Authentication State:
  If the user is logged in and the user is an admin, then this listener will
  populate the sessions table. Otherwise, go back to the user dashboard
  or back to the login screen if not authenticated
*/
firebase.auth().onAuthStateChanged(user => {
    // If user is logged in
    if (user) {
        // Get admin token result
        user.getIdTokenResult().then(async function(idTokenResult) {
            user.admin = idTokenResult.claims.admin;
            // If user is an admin
            if (user.admin) {
                // Set the onclick method of the download button
                let downloadButton = document.querySelector("#downloadbutton");
                downloadButton.onclick = download;

                // Grab the userid from the url
                let params = new URLSearchParams(location.search);
                let userid = params.get('id');

                // Get sessions
                let sessionsCall = await getAllSessionsForUser(userid);
                currentAssignmentArray = sessionData = sessionsCall.dataArray;

                checkedArray = new Array(sessionData.length);

                // Set the header with userid
                setHeader(userid);
                // Populate table with sessions from the given userid
                populateTable(1);
            }
            else {
                // Alert that you are not an admin and return to the user dashboard
                alert("You are not an admin.");
                window.location = "/user/userdashboard.html";
            }
        });
    }
    else {
        // Not signed in so redirect to login screen
        console.log("You are not signed in.");
        window.location = "/login.html";
    }
});

// Function to select/deselct all checkboxes
$(document).ready(function () {
    $("#select").click(function () {
        let checked = !$(this).data('checked');
        $('input:checkbox').prop('checked', checked);
        $(this).val(checked ? 'uncheck all' : 'check all')
        $(this).data('checked', checked);
        for(let i = 0; i < checkedArray.length; i++) {
            checkedArray[i] = checked;
        }
    });
});

/*
    accountRecoveryForm:
    Listener for the account recovery form that calls on a
    Firebase Cloud Function to change a user's password
*/
accountRecoveryForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if (confirm("Are you sure you want to change this user's password?")) {
        document.getElementById("spinner").style.visibility = "visible";
        // Grab confirmed password
        const confirmPassword = document.getElementById("confirmPassword").value;
        // Grab userid
        let params = new URLSearchParams(location.search);
        let userid = params.get('id');

        // Grab changeUserPassword function from Firebase
        const changeUserPassword = firebase.functions().httpsCallable('changeUserPassword');
        // Change user password, passing in the user id and the confirmed password to the cloud function
        changeUserPassword({ uid: userid, password: confirmPassword }).then(result => {
            document.getElementById("spinner").style.visibility = "hidden";
            alert(result.data.message)
        }).catch(function (error) {
            alert(error.message);
        })
    }
});

/*
    deleteUserForm:
    Listener for the delete user form that calls on a
    Firebase Cloud Function to delete a user from Firebase Auth and Firestore
*/
deleteUserForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Prompt the user of they are sure if they want to delete the user
    if (confirm("Are you sure you want to delete this user?")) {
        document.getElementById("spinner").style.visibility = "visible";
        // Grab userid
        let params = new URLSearchParams(location.search);
        let userid = params.get('id');

        // Get deleteUser function from Firebase
        const deleteUser = firebase.functions().httpsCallable('deleteUser');
        // Call deleteUser passing in the userid of the user to be deleted
        deleteUser({ uid: userid }).then(result => {
            document.getElementById("spinner").style.visibility = "hidden";
            alert(result.data.message);
            window.location = "/researcher/rPortal.html";
        }).catch(function (error) {
            alert(error.message);
        })
    }
});

//Function to handle pressing any of the pagination buttons
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

            populateTable(newPage);
    
            //Change the active page in the pagination menu
            document.querySelector("#page" + currentPage).className = "waves-effect";
            document.querySelector("#page" + newPage).className = "waves-effect active";
            }
    }
  });
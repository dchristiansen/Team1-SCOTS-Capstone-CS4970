import { getAssignmentsForUser } from "/Data.js"


const greeting = document.getElementById("greeting");
var username;

const assignmentTable = document.querySelector("#tablebody");
const pagination = document.querySelector("#pagination");

let assignmentsArray = [];
let currentPage = 1;
let numPages;
let entriesPerPage = 5;

firebase.auth().onAuthStateChanged(async function (user) {
    if (user) {
        username = user.email.split("@")[0];
        greeting.innerHTML = "Welcome, " + username + "!";
        let authId = user.uid;
        //TODO: If user.uid is not the primary key for the user table, query user table to get
        //primary key. Otherwise, save autId into sessionStorage
        sessionStorage.setItem('uid', authId);

        //Get all assignments for the current user
        assignmentsArray = await getAssignmentsForUser(authId);
        let firstArray = assignmentsArray.dataArray.slice(0, 4);

        //For the first five assignments, display them on the table
        populateTable(firstArray);

        //Get the total number of pages for pagination
        numPages = Math.ceil(assignmentsArray.dataArray.length / entriesPerPage);

        createPagination();
    } else {
        // No user is signed in.
        console.log("No user is signed in");
        window.location = "/login.html";
    }
});

function populateTable(assignmentsArray) {
    assignmentTable.innerHTML = "";
    assignmentsArray.forEach(assignment => {
        let tr = document.createElement('tr');
        tr.innerHtml = "<tr>";
        tr.innerHTML += "<td>" + assignment.data.assignmentLabel + "</td>";
        tr.innerHTML += "<td>" + assignment.data.parameters.bpm + "</td>";
        tr.innerHTML += "<td>" + assignment.data.parameters.soundOnTime + "</td>";
        tr.innerHTML += "<td>" + assignment.data.parameters.soundOffTime + "</td>";
        if (assignment.data.parameters.feedback) {
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

function createPagination() {
    //Create the left chevron for page scrolling
    let leftChevron = document.createElement('li');
    leftChevron.className = "waves-effect disabled";

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
        let currentPage = i + 1;
        let li = document.createElement('li');
        li.className = "waves-effect";

        let a = document.createElement('a');
        a.setAttribute('data-page', currentPage)
        a.innerHTML = currentPage;

        li.appendChild(a);
        pagination.appendChild(li);
    }

    //Add the right chevron for page scrolling
    let rightChevron = document.createElement('li');
    rightChevron.className = "waves-effect disabled";

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


$("#tablebody").on("click", "tr", function setGameParameters() {
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
    sessionStorage.setItem("bpm", bpm);
    sessionStorage.setItem("timeWSound", timeWSound);
    sessionStorage.setItem("cycles", cycles);
    sessionStorage.setItem("timeWOSound", timeWOSound);
    sessionStorage.setItem("feedback", feedback);

    //Jump to start page
    window.location = "/user/start.html";
});

$("#pagination").on("click", "a", function changePage() {
    let newPage = $(this).data('page');

    //Change to the new page
    if (newPage != currentPage) {
        if (newPage == "next") {
            newPage = currentPage + 1;
        } else if (newPage == "prev") {
            newPage = currentPage - 1;
        }

        console.log(newPage);

        if (newPage <= numPages && newPage > 0) {
            let startPosition = (newPage - 1) * entriesPerPage;
            let newArray = assignmentsArray.dataArray.slice(startPosition, startPosition + entriesPerPage);
            populateTable(newArray);
            currentPage = newPage;
        }
    }
});

$("td > a").on("click", function (e) {
    e.stopPropagation();
});
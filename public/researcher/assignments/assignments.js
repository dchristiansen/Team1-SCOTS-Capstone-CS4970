import { getUsers } from "../..//Data.js";
import { getAllAssignments } from "../..//Data.js";


// Get the assignment table
const assignmentTable = document.querySelector("#assignmentTableBody")
const pagination = document.querySelector("#pagination");

let assignmentData;
let currentAssignmentArray;
let numPages;
let currentPage = 1;
let entriesPerPage = 5;

/*
  onAuthStateChanged(user)
  Observer for Authentication State:
  If the user is logged in and the user is an admin, then this listener will
  populate the assignments table. Otherwise, go back to the user dashboard
  or back to the login screen if not authenticated
*/
firebase.auth().onAuthStateChanged(user => {
  // If user is logged in
  if(user)
  {
    // Get admin token result
    user.getIdTokenResult().then(async function(idTokenResult) {
      user.admin = idTokenResult.claims.admin;
      // If user is an admin
      if(user.admin)
      {
        // Get assignments
        let assignmentCall = await getAllAssignments();
        currentAssignmentArray = assignmentData = assignmentCall.dataArray;
        
        numPages = Math.ceil(currentAssignmentArray.length/entriesPerPage);

        // Populate the assignment table
        populateTable(1);
      }
      else
      {
        // Alert that user is not an admin and return to userdashboard
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

/*
  populateTable:
  Populates the table with all assignments in the database
*/
async function populateTable(newPage) {
  assignmentTable.innerHTML = "";
  //Calculate the position within the userData array to begin at
  let startPosition = (newPage - 1) * entriesPerPage;

  //Grab the new array to display using populateTable
  let newArray = currentAssignmentArray.slice(startPosition, startPosition + entriesPerPage);

  // Iterate through assignments and create a row in the able
  newArray.forEach(function (obj) {
    // Create a row in the table
    let aTr = document.createElement('tr');

    // Create an assignment name column in the row
    let td_assignName = document.createElement('td');
    // Set the column to be the assignment label
    td_assignName.innerHTML = obj.data.assignmentLabel;

    // Attach a link to the row
    let url = '/researcher/assignments/editAssignment.html?id=' + obj.id;
    aTr.setAttribute('data-href', url);

    // Create a parameters column in the row
    let td_params = document.createElement('td');
    // Grab parameters object
    let parameters = obj.data.parameters;
    // String version of the feedback boolean
    let fbt = "";
    if (parameters.feedback) {
      fbt = "On";
    }
    else {
      fbt = "Off";
    }
    // Populate the text in the paramters column
    td_params.innerHTML = parameters.bpm + " BPM, " + parameters.soundOnTime + " On, " + parameters.soundOffTime + " Off, " + parameters.cycles + " Cycles, Feedback: " + fbt;

    // Append the two columns to the row
    aTr.appendChild(td_assignName);
    aTr.appendChild(td_params);

    // Append the row to the table
    assignmentTable.appendChild(aTr);
  });
  createPagination();
}

/*
  createPagination:
  Creates the pagination icons beneath the table,
  based on the number of pages
*/
function createPagination() {
  pagination.innerHTML = "";
  numPages = Math.ceil(currentAssignmentArray.length/entriesPerPage);

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
    if(current == currentPage) {
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

// Function to filter the assignments by assignment label
$(document).ready(function () {
  $(document.body).on("click", "tr[data-href]", function () {
    window.location.href = this.dataset.href;
  });
  $('#searchAssignment').on('keyup', function () {
    var input, filter;
    currentAssignmentArray = [];
    input = document.getElementById("searchAssignment");
    filter = input.value.toUpperCase();
    assignmentData.forEach(assignment => {
      let assignmentText = assignment.data.assignmentLabel;
      if (assignmentText.toUpperCase().indexOf(filter) > -1) {
        currentAssignmentArray.push(assignment);
      }
    });
    populateTable(1);
  });
});

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

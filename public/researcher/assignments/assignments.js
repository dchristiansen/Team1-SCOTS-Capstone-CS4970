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

// Observer for FirebaseAuth
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
        assignmentData = assignmentCall.dataArray;
        let firstAssignments = assignmentData.slice(0, entriesPerPage);
        
        numPages = Math.ceil(assignmentData.length/entriesPerPage);

        // Populate the assignment table
        populateTable(firstAssignments);

        createPagination();
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
async function populateTable(assignments) {
    assignmentTable.innerHTML = "";
    // Iterate through assignments and create a row in the able
    assignments.forEach(function (obj) {
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
      if(parameters.feedback)
      {
        fbt = "On";
      }
      else
      {
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

}

/*
  createPagination:
  Creates the pagination icons beneath the table,
  based on the number of pages
*/
function createPagination() {
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
    let currentPage = i + 1;
    let li = document.createElement('li');
    li.id = "page" + currentPage;
    li.className = "waves-effect";
    if(i == 0) {
      li.className += " active";
    }

    let a = document.createElement('a');
    a.setAttribute('data-page', currentPage)
    a.innerHTML = currentPage;

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
$(document).ready(function(){
  $(document.body).on("click", "tr[data-href]", function (){
    window.location.href = this.dataset.href;
  });
  $('#searchAssignment').on('keyup', function(){
    var input, filter, table, tr, td, i, txtValue;
      input = document.getElementById("searchAssignment");
      filter = input.value.toUpperCase();
      table = document.getElementById("assignmentTableBody");
      tr = table.getElementsByTagName("tr");
      for (i = 0; i < tr.length; i++) {
          td = tr[i].getElementsByTagName("td")[0];
          if (td) {
            txtValue = td.textContent || td.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
              tr[i].style.display = "";
            } else {
              tr[i].style.display = "none";
            }
          }
        }
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
        //Calculate the position within the userData array to begin at
        let startPosition = (newPage-1) * entriesPerPage;

        //Grab the new array to display using populateTable
        let newArray = assignmentData.slice(startPosition, startPosition + entriesPerPage);
        populateTable(newArray);

        //Change the active page in the pagination menu
        document.querySelector("#page" + currentPage).className = "waves-effect";
        document.querySelector("#page" + newPage).className = "waves-effect active";

        //Change the current page
        currentPage = newPage;
      }
  }
});

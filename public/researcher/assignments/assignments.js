import { getUsers } from "../..//Data.js";
import { getAllAssignments } from "../..//Data.js";

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
    user.getIdTokenResult().then(idTokenResult => {
      user.admin = idTokenResult.claims.admin;
      // If user is an admin
      if(user.admin)
      {
        // Populate the assignment table
        populateTable();
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
async function populateTable() {
    // Get the assignment table
    let assignmentTable = document.querySelector("#assignmentTableBody");
    
    // Get assignments
    let assignmentCall = await getAllAssignments();
    let assignmentData = assignmentCall.dataArray;

    // Iterate through assignments and create a row in the able
    assignmentData.forEach(function (obj) {
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

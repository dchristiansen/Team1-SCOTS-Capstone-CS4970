import { getUsers } from "./Data.js";
import { getAllAssignments } from "./Data.js";

firebase.auth().onAuthStateChanged(user => {
  if(user)
  {
    user.getIdTokenResult().then(idTokenResult => {
      user.admin = idTokenResult.claims.admin;
      if(user.admin)
      {

        populateTable();
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

async function populateTable() {
    let assignmentTable = document.querySelector("#assignmentTableBody");
    let assignmentCall = await getAllAssignments();
    let assignmentData = assignmentCall.dataArray;

    assignmentData.forEach(function (obj) {
      let aTr = document.createElement('tr');
      let td_assignName = document.createElement('td');
      td_assignName.innerHTML = obj.data.assignmentLabel;
      let url = './editAssignment.html?id=' + obj.id;
      aTr.setAttribute('data-href', url);
      aTr.appendChild(td_assignName);
      assignmentTable.appendChild(aTr);
    });

}

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

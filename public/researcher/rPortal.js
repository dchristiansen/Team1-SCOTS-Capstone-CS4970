import { getUsers } from "/Data.js";

// Admin form to make a certain user an admin
const adminForm = document.querySelector(".admin-action");
// Greeting for the researcher portal
const greeting = document.getElementById("greeting");
// username
var username;

// Observer for FirebaseAuth
firebase.auth().onAuthStateChanged(user => {
  
  // If user is signed in
  if(user)
  {
    username = user.email.split("@")[0];
    greeting.innerHTML = "Welcome to the Researcher Portal, " + username + "!";

    // Get admin token result
    user.getIdTokenResult().then(idTokenResult => {
      user.admin = idTokenResult.claims.admin;
      // If a user is an admin, populate user table
      if(user.admin)
      {
        populateTable();
      }
      // Else redirect to the userdashboard
      else
      {
        alert("You are not an admin.");
        window.location = "/user/userdashboard.html";
      }
    });
  }
  // Else redirect to login screen
  else
  {
    console.log("You are not signed in.");
    window.location = "/login.html";
  }
});

/*
  adminForm:
  Event listener for the admin form to make a user an admin
*/
adminForm.addEventListener('submit', (e) => {
    e.preventDefault();
    document.getElementById("spinner").style.visibility = "visible";
    // Get the email of the user to be made an admin
    const adminEmail = document.getElementById('admin-email').value;
    // Get the addAdminRole cloud function from Firebase
    const addAdminRole = firebase.functions().httpsCallable('addAdminRole');
    // Call the addAdminRole function passing in the email of the user to be made an admin
    addAdminRole({ email: adminEmail }).then(result => {
        console.log(result);
        document.getElementById("spinner").style.visibility = "hidden";
        if (result.data.errorInfo == null) {

            alert(result.data.message);
        }
        else {
            alert(result.data.errorInfo.message);
        }
    });
});

/*
  populateTable:
  Populates the table on the researcher portal screen with all the
  users in FirebaseAuth
*/
async function populateTable() {
    // Get table from the html document
    let table = document.querySelector("#tablebody");
    // Get users
    let usersCall = await getUsers();
    let userData = usersCall.dataArray;
    // Loop through userData
    userData.forEach(function (obj) {
        // Create a row entry for each user
        let tr = document.createElement('tr');
        
        // Create a column for their name and for their latest session time
        let td_id = document.createElement('td');
        let td_ses = document.createElement('td');

        // Get the latest session time and put the time in the text of the column
        let latestSessionTime = obj.data.latestSessionTime;
        let latestSessionTimeStr = "";
        if (latestSessionTime) {
            latestSessionTime = latestSessionTime.seconds * 1000;
            latestSessionTime = new Date(latestSessionTime);
            latestSessionTimeStr = latestSessionTime.toLocaleString(navigator.language);
        } else {
            latestSessionTime = "N/A";
            latestSessionTimeStr = "N/A";
        }

        td_ses.innerHTML = latestSessionTimeStr;

        // Create a link to userData with the user's uid as a paramter
        let url = '/researcher/users/userData.html?id=' + obj.id;
        tr.setAttribute('data-href', url);

        // Put the users ID in the inner html of the column
        td_id.innerHTML = obj.data.userID;

        // Append the columns to the row
        tr.appendChild(td_id);
        tr.appendChild(td_ses);

        // Append the row to the table
        table.appendChild(tr);
    });
}

/*
  Filter the table by the users id
*/
$(document).ready(function(){
  $('#search').on('keyup', function(){
    var input, filter, table, tr, td, i, txtValue;
      input = document.getElementById("search");
      filter = input.value.toUpperCase();
      table = document.getElementById("tablebody");
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


$(document).ready(function (){
  $(document.body).on("click", "tr[data-href]", function (){
    window.location.href = this.dataset.href;
  })
});
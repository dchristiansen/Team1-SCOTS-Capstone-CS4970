import { getUsers } from "/Data.js";

// Admin form to make a certain user an admin
const adminForm = document.querySelector(".admin-action");
// Greeting for the researcher portal
const greeting = document.getElementById("greeting");
// username
var username;

// Get table from the html document
const table = document.querySelector("#tablebody");
const pagination = document.querySelector("#pagination");

let userData;
let currentUserArray;
let numPages;
let currentPage = 1;
let entriesPerPage = 5;

// Observer for FirebaseAuth
firebase.auth().onAuthStateChanged(user => {
  
  // If user is signed in
  if(user)
  {
    username = user.email.split("@")[0];
    greeting.innerHTML = "Welcome to the Researcher Portal, " + username + "!";

    // Get admin token result
    user.getIdTokenResult().then(async function(idTokenResult){
      user.admin = idTokenResult.claims.admin;
      // If a user is an admin, populate user table
      if(user.admin)
      {
        // Get users
        let usersCall = await getUsers();
        currentUserArray = userData = usersCall.dataArray;

        //Calculate the total number of pages
        numPages = Math.ceil(currentUserArray.length/entriesPerPage);

        //Populate the table with the first batch of users
        populateTable(1);
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
            location.reload();
        }
        else {
            alert(result.data.errorInfo.message);
        }
    });
});

/*
  populateTable:
  Populates the table on the researcher portal screen with one page of
  users

  Input: array userData, the users for the current page
*/
function populateTable(newPage) {
    table.innerHTML = "";

    //Calculate the position within the userData array to begin at
    let startPosition = (newPage-1) * entriesPerPage;

    //Grab the new array to display using populateTable
    let newArray = currentUserArray.slice(startPosition, startPosition + entriesPerPage);

    // Loop through userData
    newArray.forEach(function (obj) {
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
    createPagination();
}

/*
  createPagination:
  Creates the pagination icons beneath the table,
  based on the number of pages
*/
function createPagination() {
  pagination.innerHTML = "";
  numPages = Math.ceil(currentUserArray.length/entriesPerPage);
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

/*
  Filter the table by the users id
*/
$(document).ready(function () {
  $('#search').on('keyup', function () {
    var input, filter;
    currentUserArray = [];
    input = document.getElementById("search");
    filter = input.value.toUpperCase();
    userData.forEach(user => {
      let userId = user.data.userID;
      if(userId.toUpperCase().indexOf(filter) > -1) {
        currentUserArray.push(user);
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
          populateTable(newPage);

          //Change the active page in the pagination menu
          document.querySelector("#page" + currentPage).className = "waves-effect";
          document.querySelector("#page" + newPage).className = "waves-effect active";

          //Change the current page
          currentPage = newPage;
        }
    }
});


$(document).ready(function (){
  $(document.body).on("click", "tr[data-href]", function (){
    window.location.href = this.dataset.href;
  })
});
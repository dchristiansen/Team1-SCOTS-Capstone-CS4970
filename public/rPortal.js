import { getUsers } from "./Data.js";

const btnLogout = document.getElementById("btnLogout");

const adminForm = document.querySelector(".admin-action");
//const functions = firebase.functions();
btnLogout.addEventListener("click", e => {
    firebase.auth().signOut().then(function () {
        window.location = "index.html";
    }).catch(function (error) {
        console.log(error);
    });
});

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

adminForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const adminEmail = document.getElementById('admin-email').value;
    const addAdminRole = firebase.functions().httpsCallable('addAdminRole');
    addAdminRole({ email: adminEmail }).then(result => {
        console.log(result);
        if (result.data.errorInfo == null) {
            alert(result.data.message);
        }
        else {
            alert(result.data.errorInfo.message);
        }
    });
});

async function populateTable() {
    let table = document.querySelector("#tablebody");
    let usersCall = await getUsers();
    let userData = usersCall.dataArray;
    userData.forEach(function (obj) {
        let tr = document.createElement('tr');
        let td_id = document.createElement('td');
        let td_ses = document.createElement('td');
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
        let url = './userData.html?id=' + obj.id;
        tr.setAttribute('data-href', url);
        td_id.innerHTML = obj.data.userID;
        tr.appendChild(td_id);
        tr.appendChild(td_ses);
        table.appendChild(tr);
    });
}

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
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
        let a = document.createElement('a');
        let td_ses = document.createElement('td');
        let latestSessionTime = obj.data.latestSessionTime;
        if (latestSessionTime) {
            latestSessionTime = latestSessionTime.seconds * 1000;
            latestSessionTime = new Date(latestSessionTime);
        } else {
            latestSessionTime = "N/A";
        }
        td_ses.innerHTML = latestSessionTime;
        a.innerHTML = obj.data.userID;
        a.href = './user.html?id=' + obj.data.userID;
        td_id.appendChild(a);
        tr.appendChild(td_id);
        tr.appendChild(td_ses);
        table.appendChild(tr);
    });
}

populateTable();
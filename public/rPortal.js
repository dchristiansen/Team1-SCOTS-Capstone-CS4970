
const btnLogout = document.getElementById("btnLogout");

const adminForm = document.querySelector(".admin-action");
//const functions = firebase.functions();
btnLogout.addEventListener("click", e => {
    firebase.auth().signOut().then(function() {
        window.location = "index.html";
    }).catch(function(error) {
        console.log(error);
    });
});

adminForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const adminEmail = document.getElementById('admin-email').value;
    const addAdminRole = firebase.functions().httpsCallable('addAdminRole');
    addAdminRole({email: adminEmail}).then(result => {
        console.log(result);
        if (result.data.errorInfo == null)
        {
            alert(result.data.message);
        }
        else
        {
            alert(result.data.errorInfo.message);
        }
    });
});

function fetchData(){ //TODO: hook this up to a database call
    let data = [];
    for (let i = 0; i < 50; i++){
        let date = new Date(new Date() - Math.floor(Math.random() * 2500000000));
        let user = {user_id: i, most_recent_session: date}
        data.push(user);
    }
    return data;
}

function populateTable(data, table){
    data.forEach(function(object) {
        var tr = document.createElement('tr');
        tr.innerHTML = '<td>' + object.user_id + '</td>' +
        '<td>' + object.most_recent_session + '</td>';
        table.appendChild(tr);
    });
}

let table = document.querySelector("#tablebody");
let data = fetchData();
populateTable(data, table);

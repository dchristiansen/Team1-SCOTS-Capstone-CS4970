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
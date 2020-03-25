function fetchData(){ //TODO: hook this up to a database call
    let data = [];
    for (let i = 0; i < 50; i++){
        let date = new Date(new Date() - Math.floor(Math.random() * 2500000000));
        let user = {user_id: i, most_recent_session: date}
        data.push(user);
    }
    return data;
}

var url = "userData.html"

function populateTable(data, table){
    data.forEach(function(object) {
        var tr = document.createElement('tr');
        tr.innerHTML = '<td>' + object.user_id + '</td>' +
        '<td>' + object.most_recent_session + '</td>';
        tr.setAttribute('data-href', url);
        table.appendChild(tr);
    });
}



let table = document.querySelector("#tablebody");
let data = fetchData();
populateTable(data, table);

$('*[data-href]').on("click",function(){
  window.location = $(this).data('href');
  return false;
});
$("td > a").on("click",function(e){
  e.stopPropagation();
});;

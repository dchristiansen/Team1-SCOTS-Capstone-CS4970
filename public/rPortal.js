(function() {
    const btnLogout = document.getElementById("btnLogout");


    btnLogout.addEventListener("click", e => {
        firebase.auth().signOut().then(function() {
            window.location = "index.html";
        }).catch(function(error) {
            console.log(error);
        });
    });

}());
(function() {

    const greeting = document.getElementById("greeting");
    var username;
    const btnLogout = document.getElementById("btnLogout");

    const functions = firebase.functions();
    
    btnLogout.addEventListener("click", e => {
        firebase.auth().signOut().then(function() {
            window.location = "index.html";
        }).catch(function(error) {
            console.log(error);
        });
    });

    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            username = user.email.split("@")[0];
            greeting.innerHTML = "Welcome, " + username + "!";
        } else {
            console.log("No user is signed in");
        }
    });
    
}());
(function() {

    const greeting = document.getElementById("greeting");
    var username;
    const btnLogout = document.getElementById("btnLogout");

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
            let authId = user.uid;
            //TODO: If user.uid is not the primary key for the user table, query user table to get
            //primary key. Otherwise, save autId into sessionStorage
            sessionStorage.setItem('uid', authId);
        } else {
          // No user is signed in.
        }
    });


    
    
}());
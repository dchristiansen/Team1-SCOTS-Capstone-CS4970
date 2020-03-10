(function() {
    var firebaseConfig = {
        apiKey: "AIzaSyDDadfEqiZEovi1FrCu_6BS78CsQttkp9E",
        authDomain: "scots-capstone.firebaseapp.com",
        databaseURL: "https://scots-capstone.firebaseio.com",
        projectId: "scots-capstone",
        storageBucket: "scots-capstone.appspot.com",
        messagingSenderId: "699046472990",
        appId: "1:699046472990:web:4b62279ece6940359a2d0f",
        measurementId: "G-F619W4DX2K"
    }; //pull out to config file
        
    firebase.initializeApp(firebaseConfig);
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
        } else {
          // No user is signed in.
        }
    });


    
    
}());
(function() {

    const greeting = document.getElementById("greeting");
    var username;
    const btnLogout = document.getElementById("btnLogout");

    const adminForm = document.querySelector(".admin-action");
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
          // No user is signed in.
        }
    });

    adminForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const adminEmail = document.getElementById('admin-email').value;
        const addAdminRole = functions.httpsCallable('addAdminRole');
        addAdminRole({email: adminEmail}).then(result => {
            console.log(result);
        });
    });
    
}());
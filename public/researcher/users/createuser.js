(function() {
    // Form to create user
    const createUserForm = document.querySelector(".admin-action");
    // Element for the username field
    const createUserName = document.getElementById("createUname");
    // Element for the password field
    const createPassword = document.getElementById("createPassword");

    /*
        createUserForm:
        Event Listener on the create user form to create 
        a user in FirebaseAuth and register them in Firestore
    */
    createUserForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Grab username and password of the user we want to create
        const createdUsername = createUserName.value;
        const createdPassword = createPassword.value;

        // Get the createUser function from Firebase
        const createUser = firebase.functions().httpsCallable('createUser');
        // Call the createUser function and pass in the new username and password
        createUser({email: createdUsername, password: createdPassword}).then(result => {
            console.log(result);
            alert(result.data.message);
            createUserName.value = "";
            createPassword.value = "";
        }).catch(function(error) {
            console.log(error);
            alert(error.message);
            createUserName.value = "";
            createPassword.value = "";
        });
    });

    // Observer for FirebaseAuth
    firebase.auth().onAuthStateChanged(user => {
        // If user is not signed in redirect to login page
        if(!user)
        {
            console.log("You are not signed in.");
            window.location = "/login.html";
        }

        // If user is signed in
        if(user)
        {
            // Get admin token result
            user.getIdTokenResult().then(idTokenResult => {
                user.admin = idTokenResult.claims.admin;
                // If user is not an admin, redirect to the userdashboard
                if(!user.admin)
                {
                    alert("You are not an admin.");
                    window.location = "/user/userdashboard.html";
                }
            });
        }
    });

}());

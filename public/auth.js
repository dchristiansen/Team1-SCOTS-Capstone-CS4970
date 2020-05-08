
(function() {
    // Element for the username field  
    const usernameField = document.getElementById('Uname');
    // Element for the password field
    const passwordField = document.getElementById('password');
    // Button for login
    const btnLogin = document.getElementById('btnLogin');
    
    var firestore = firebase.firestore();
    
    /*
        btnLogin:
        Listener for the login button that logs in a user with FirebaseAuth
    */
    btnLogin.addEventListener('click', e => {
        // Grab username and password
        const username = usernameField.value;
        const password = passwordField.value;

        // Get FirebaseAuth instance
        const auth = firebase.auth();
        // Sign in with the username and password and return a promise
        const promise = auth.signInWithEmailAndPassword(username,password);
        // If there is an error, alert the error
        promise.catch(e => alert(e.message));

    });

    /*
        onAuthStateChanged(firebaseUser)
        Observer for Authentication State:
        If the user is logged in and the user is an admin, then this listener will
        redirect to the researcher portal. If the user is not an admin, then it will
        redirect to the user dashboard
    */
    firebase.auth().onAuthStateChanged(firebaseUser => {
        // If a user is logged in
        if(firebaseUser) 
        {
            // Get admin token result
            firebaseUser.getIdTokenResult().then(idTokenResult => {
                firebaseUser.admin = idTokenResult.claims.admin;
                // If user is an admin
                if (firebaseUser.admin)
                {
                    // Redirect to researcher portal
                    window.location = "/researcher/rPortal.html";
                }
                else 
                {
                    // Read into users table to get the changePassword field
                    firestore.collection('users').doc(firebaseUser.uid).get().then(function(doc) {
                        if(doc.exists) {
                            // If a user has not changed their password
                            if(!doc.data().changePassword)
                            {
                                // Alert that the user is being redirected to the edituser
                                alert("You have not changed your password since you were first registered. Please change your password before proceeding.");
                                window.location = "/user/edituser.html";
                            }
                            // Else redirect to the userdashboard
                            else
                            {
                                window.location = "/user/userdashboard.html";
                            }
                        }
                        else {
                            alert("The user has not been registered in the database.");
                            //window.location = "/user/userdashboard.html";
                        }
                    })
                }
            });
        }
    });
}());
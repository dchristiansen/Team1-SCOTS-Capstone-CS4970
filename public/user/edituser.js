// Button to change password
const btnChangePassword = document.getElementById("btnChangePassword");
// Element for the confirm password field
const confirmPasswordField = document.getElementById("confirmPassword");

/*
    btnChangePassword:
    Event listener for the change password button
*/
btnChangePassword.addEventListener("click", e => {
    // Grab firestore instance
    var firestore = firebase.firestore();

    // Get confirm password field value
    const confirmPassword = confirmPasswordField.value;
    
    firebase.auth().onAuthStateChanged(user => {
        // If user is logged in
        if(user)
        {
            // Call the updateUser function with the new password passed in as a parameter
            user.updatePassword(confirmPassword).then(function() {
                // Update the value of the changePassword field in the document for the user
                firestore.collection('users').doc(user.uid).update({changePassword:true}).then(function() {
                    console.log("Document successfully updated");
                    // Alert the user that the password was changed 
                    // successfully and redirect to the userdashboard
                    alert("Password changed successfully.");
                    window.location = "/user/userdashboard.html";
                }).catch(function(error) {
                    console.error("Error updating document: ", error);
                });
            }).catch(function(error) {
                alert("Error changing password.");
            })
        }
        else {
            alert("You are not signed in.");
        }
    });
});

// Observer for FirebaseAuth
firebase.auth().onAuthStateChanged(user => {
    // If a user is not logged in
    if(!user)
    {
        // Redirect to the login screen
        console.log("You are not signed in.");
        window.location = "/login.html";
    }

    if(user)
    {
        user.getIdTokenResult().then(idTokenResult => {
            user.admin = idTokenResult.claims.admin;
            if(user.admin)
            {
                alert("Researchers do not have access to the Edit User page");
                window.location = "/researcher/rPortal.html";
            }
        });
    }
});
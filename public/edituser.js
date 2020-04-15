const btnChangePassword = document.getElementById("btnChangePassword");
const confirmPasswordField = document.getElementById("confirmPassword");

btnChangePassword.addEventListener("click", e => {
    var firestore = firebase.firestore();
    //var user = firebase.auth().currentUser;
    const confirmPassword = confirmPasswordField.value;
    
    firebase.auth().onAuthStateChanged(user => {
        if(user)
        {
            user.updatePassword(confirmPassword).then(function() {
                firestore.collection('users').doc(user.uid).update({changePassword:true}).then(function() {
                    console.log("Document successfully updated");
                    alert("Password changed successfully.");
                    window.location = "userdashboard.html";
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

firebase.auth().onAuthStateChanged(user => {
    if(!user)
    {
        console.log("You are not signed in.");
        window.location = "index.html";
    }
});
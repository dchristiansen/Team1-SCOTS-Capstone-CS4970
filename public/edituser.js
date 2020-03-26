const btnChangePassword = document.getElementById("btnChangePassword");
const confirmPasswordField = document.getElementById("confirmPassword");

btnChangePassword.addEventListener("click", e => {
    var user = firebase.auth().currentUser;
    console.log(user);
    const confirmPassword = confirmPasswordField.value;
    if(user == null)
    {
        alert("You are not signed in.");
    }
    else
    {
        user.updatePassword(confirmPassword).then(function() {
            alert("Password changed successfully.");
        }).catch(function(error) {
            alert("Error changing password.");
        });
    }
});

window.onbeforeunload = function() {
    return true;
};
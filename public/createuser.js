(function() {

    const createUserForm = document.querySelector(".admin-action");
    const createUserName = document.getElementById("createUname");
    const createPassword = document.getElementById("createPassword");

    createUserForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const createdUsername = createUserName.value;
        const createdPassword = createPassword.value;

        const createUser = firebase.functions().httpsCallable('createUser');
        createUser({email: createdUsername, password: createdPassword}).then(result => {
            console.log(result);
            alert(result.data.message);
        }).catch(function(error) {
            console.log(error);
            alert(error.message);
        });
    });

    firebase.auth().onAuthStateChanged(user => {
        if(!user)
        {
            console.log("You are not signed in.");
            window.location = "index.html";
        }

        if(user)
        {
            user.getIdTokenResult().then(idTokenResult => {
                user.admin = idTokenResult.claims.admin;
                if(!user.admin)
                {
                    alert("You are not an admin.");
                    window.location = "userdashboard.html";
                }
            });
        }
    });

}());

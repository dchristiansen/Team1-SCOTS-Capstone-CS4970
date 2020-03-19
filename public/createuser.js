(function() {

    const createUserForm = document.querySelector(".admin-action");
    const createUserName = document.getElementById("createUname");
    const createPassword = document.getElementById("createPassword");
    const btnCreateUser = document.getElementById("btnCreateUser");

    createUserForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const createdUsername = createUserName.value;
        const createdPassword = createPassword.value;

        const createUser = firebase.functions().httpsCallable('createUser');
        createUser({email: createdUsername, password: createdPassword}).then(result => {
            console.log(result);
        });
    });

}());
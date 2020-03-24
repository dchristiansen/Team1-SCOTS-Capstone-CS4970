(function() {
    const btnLogout = document.getElementById("btnLogout");

    const adminForm = document.querySelector(".admin-action");
    //const functions = firebase.functions();
    btnLogout.addEventListener("click", e => {
        firebase.auth().signOut().then(function() {
            window.location = "index.html";
        }).catch(function(error) {
            console.log(error);
        });
    });

    adminForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const adminEmail = document.getElementById('admin-email').value;
        const addAdminRole = firebase.functions().httpsCallable('addAdminRole');
        addAdminRole({email: adminEmail}).then(result => {
            console.log(result);
            if (result.data.errorInfo == null)
            {
                alert(result.data.message);
            }
            else
            {
                alert(result.data.errorInfo.message);
            }
        });
    });

}());
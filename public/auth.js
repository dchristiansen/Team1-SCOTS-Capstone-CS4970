
(function() {  
    const usernameField = document.getElementById('Uname');
    const passwordField = document.getElementById('password');
    const btnLogin = document.getElementById('btnLogin');
    
    var firestore = firebase.firestore();
    
    btnLogin.addEventListener('click', e => {
        const username = usernameField.value;
        const password = passwordField.value;
        const auth = firebase.auth();
        const promise = auth.signInWithEmailAndPassword(username,password);
        
        promise.catch(e => alert(e.message));

    });

    firebase.auth().onAuthStateChanged(firebaseUser => {
        if(firebaseUser) 
        {
            firebaseUser.getIdTokenResult().then(idTokenResult => {
                firebaseUser.admin = idTokenResult.claims.admin;
                if (firebaseUser.admin)
                {
                    window.location = "rPortal.html";
                }
                else 
                {
                    firestore.collection('users').doc(firebaseUser.uid).get().then(function(doc) {
                        if(doc.exists) {
                            if(!doc.data().changePassword)
                            {
                                alert("You have not changed your password since you were first registered. Please change your password before proceeding.");
                                window.location = "edituser.html";
                            }
                            else
                            {
                                window.location = "userdashboard.html";
                            }
                        }
                        else {
                            alert("The user has not been registered in the database.");
                            //window.location = "userdashboard.html";
                        }
                    })
                }
            });
        }
    });
}());
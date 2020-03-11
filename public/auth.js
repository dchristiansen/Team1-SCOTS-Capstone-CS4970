//import firebase from './config.js';

(function() {
    /*
    var firebaseConfig = {
        apiKey: config.firebase.apiKey,
        authDomain: config.firebase.authDomain,
        databaseUrl: config.firebase.databaseUrl,
        projectId: config.firebase.projectId,
        storageBucket: config.firebase.storageBucket,
        messagingSenderId: config.firebase.messagingSenderId,
        appId: config.firebase.appId,
        measurementId: config.firebase.measurementId
    };
    firebase.initializeApp(firebaseConfig);
    */
    
    const usernameField = document.getElementById('Uname');
    const passwordField = document.getElementById('password');
    const btnLogin = document.getElementById('btnLogin');
    const btnRegister = document.getElementById('btnRegister');

    
    btnRegister.addEventListener('click', e => {
        const username = usernameField.value;
        const password = passwordField.value;
        const auth = firebase.auth();

        auth.createUserWithEmailAndPassword(username,password).catch(function(error) {
            var errorMessage = error.message;
            alert(errorMessage);
        })

    }); 
    
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
            window.location = "userdashboard.html";
        }
    });
}());
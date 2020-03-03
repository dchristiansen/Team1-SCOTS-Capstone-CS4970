(function() {
    var firebaseConfig = {
    apiKey: "AIzaSyDDadfEqiZEovi1FrCu_6BS78CsQttkp9E",
    authDomain: "scots-capstone.firebaseapp.com",
    databaseURL: "https://scots-capstone.firebaseio.com",
    projectId: "scots-capstone",
    storageBucket: "scots-capstone.appspot.com",
    messagingSenderId: "699046472990",
    appId: "1:699046472990:web:4b62279ece6940359a2d0f",
    measurementId: "G-F619W4DX2K"
    };
    
    firebase.initializeApp(firebaseConfig);
    
    const usernameField = document.getElementById('Uname');
    const passwordField = document.getElementById('password');
    const btnLogin = document.getElementById('btnLogin');
    // const btnRegister = document.getElementById('btnRegister');

    /*
    btnRegister.addEventListener('click', e => {
        const username = usernameField.value;
        const password = passwordField.value;
        const auth = firebase.auth();

        auth.createUserWithEmailAndPassword(username,password).then(cred => {
            console.log(cred);
        });

    }); 
    */
    btnLogin.addEventListener('click', e => {
        const username = usernameField.value;
        const password = passwordField.value;
        const auth = firebase.auth();
        const promise = auth.signInWithEmailAndPassword(username,password);
        
        promise.catch(e => console.log(e.message));

    });

    firebase.auth().onAuthStateChanged(firebaseUser => {
        if(firebaseUser) 
        {
            window.location = "userdashboard.html";
        }
    });
}());
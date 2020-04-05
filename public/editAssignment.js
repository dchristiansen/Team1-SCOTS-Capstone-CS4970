const firestore = firebase.firestore();

async function setHeader(assignmentId) {
    let header = document.querySelector("#assignmentidheader");
    header.innerHTML = "Assignment: " + assignmentId;
}

async function populateParameters(assignmentId) {
    var firestore = firebase.firestore();

    var assignmentDoc = await firestore.collection("assignments").doc(assignmentId);

    assignmentDoc.get().then(function(doc) {
        if(doc.exists)
        {
            var assignmentLabel = doc.data().assignmentLabel;
            var parameters = doc.data().parameters;

            document.getElementById("assignment_name").value = assignmentLabel;
            document.getElementById("BPM").value = parameters.bpm;
            document.getElementById("timeWSound").value = parameters.soundOnTime;
            document.getElementById("timeWOSound").value = parameters.soundOffTime;
            document.getElementById("cycles").value = parameters.cycles;
            
            console.log(parameters.feedback);
            if (!parameters.feedback)
            {
                console.log("in here");
                document.getElementById("feedback").removeAttribute("checked");
            }
        }
    })

}

firebase.auth().onAuthStateChanged(user => {
    if(user)
    {
        user.getIdTokenResult().then(idTokenResult => {
            user.admin = idTokenResult.claims.admin;
            if(user.admin)
            {
                let params = new URLSearchParams(location.search);
                let assignmentId = params.get('id');
                setHeader(assignmentId);
                populateParameters(assignmentId);
            }
            else
            {
                alert("You are not an admin.");
                window.location = "userdashboard.html";
            }
        });
    }
    else
    {
        console.log("You are not signed in.");
        window.location("index.html");
    }
});
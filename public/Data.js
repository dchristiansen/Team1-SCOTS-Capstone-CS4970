var firestore = firebase.firestore();

createSession = function(data){
    var collection = firestore.collection('sessions');
    collection.add(data)
}

addTapData = function(data, sessionID){
    var collection = firestore.collection('sessions');
    var doc = collection.doc(sessionID);
    var taps = doc.collection("taps");
    taps.add(data);
}

updateLatestSessionForUser = function(){

}

getAllSessionsFromUser = function(){

}

getSessionData = function(){

}

createAssignment = function(assignmentLabel, bpm, soundOn, soundOff, cycles, feedback, userIDs ){
    let assignments = firestore.collection("assignments");
    let docData = {
        assignmentLabel: assignmentLabel,
        parameters: {
            bpm: bpm,
            soundOnTime: soundOn,
            soundOffTime: soundOff,
            cycles: cycles,
            feedback: feedback,
        },
        userIDs: userIDs
    };
    assignments.add(docData).then(function(){
        console.log("Document successfully written!");
    });
}

getAssignment = function(){
    

}
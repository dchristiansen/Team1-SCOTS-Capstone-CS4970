'use strict';

var firestore = firebase.firestore();

//Creates new session upon completion of game. Stores tap objects as an array of maps
function createSession(assignmentId, bpm, soundOn, soundOff, cycles, feedback, userID, tapData){
    // Create a batch
    var batch = firestore.batch();

    // Build the new session document
    let sessions = firestore.collection('sessions');
    let newSessionRef = sessions.doc()
    let docData = {
        assignmentId: assignmentId,
        parameters: {
            bpm: bpm,
            soundOnTime: soundOn,
            soundOffTime: soundOff,
            cycles: cycles,
            feedback: feedback,
        },
        userID: userID,
        sessionTime: firebase.firestore.Timestamp.now(),
        taps: tapData
    };
    batch.set(newSessionRef, docData);

    //Also update the latest session time in the users/<userID> document
        //TODO: What is the userID, is it the document reference in the users table?
    //let userRef = firestore.collection("users").doc(userID);
    //batch.update(userRef, {"latestSessionTime": docData.sessionTime})

    //Commit the batch
   return batch.commit().then(function(){
        console.log("New Session successfully written! ", newSessionRef.id);
    }).catch(function(error){
        console.error("Error when adding new session: ", error);
    });
}

//We can also store tap data as a subcollection
/*function addTapData(data, sessionID){
    var collection = firestore.collection('sessions');
    var doc = collection.doc(sessionID);
    var taps = doc.collection("taps");
    taps.add(data); 
} */

/*function updateLatestSessionForUser(userID, sessionTimeStamp){
    var userRef = firestore.collection("users").doc(userID);
} */

function getAllSessionsFromUser(){
    /*TODO*/
}

function getSessionData(){
    /*TODO*/
}

function createAssignment(assignmentLabel, bpm, soundOn, soundOff, cycles, feedback, userIDs ){
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
        userIDs: userIDs,
    };
    assignments.add(docData).then(function(){
        console.log("New Assignment successfully written!");
    });
}

function getAssignmentsForUser(userID){
    /*TODO*/
    //Include DocRef ID
}

export {createAssignment, createSession}
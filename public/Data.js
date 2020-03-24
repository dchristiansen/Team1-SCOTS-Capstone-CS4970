'use strict';

var firestore = firebase.firestore();

//Creates new session upon completion of game. Stores tap objects as an array of maps
//TODO: Add data validation for existing user? can also do with db rules
function createSession(assignmentID, bpm, soundOn, soundOff, cycles, feedback, userID, tapData){

    // Create a batch
    var batch = firestore.batch();

    // Build the new session document
    let sessions = firestore.collection('sessions');
    let newSessionRef = sessions.doc()
    let docData = {
        assignmentID: assignmentID,
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
        //Uncomment when user creation is ready
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
//TODO: eventually delete
/*function addTapData(data, sessionID){
    var collection = firestore.collection('sessions');
    var doc = collection.doc(sessionID);
    var taps = doc.collection("taps");
    taps.add(data); 
} */

//TODO: eventually delete
/*function updateLatestSessionForUser(userID, sessionTimeStamp){
    var userRef = firestore.collection("users").doc(userID);
} */

//Retrieves all sessions based on passed userID
//TODO: Figure out order, by timestamp?
function getAllSessionsForUser(userID){
    var sessions = firestore.collection("sessions");
    //IMPORTANT
    //we can implement pagination later on to perform batched reads
    //I am implementing a limit so we don't run into pricing issues
    var query = sessions.where("userID", "==", userID).limit(20);

    //Return data as an array of maps, where each item contains the docID and session data
    //We can change this to return a custom object later
    var returnData = [];

    let ret = query.get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc){
            //console.log(doc.id, "=>", doc.data());
            returnData.push(
                {
                    id: doc.id,
                    data: doc.data()
                }
            );
        });
        return returnData;
    }).catch(function(error) {
        console.log("Error getting sessions: ", error);
    })

    return returnData;

}

/*function getTapData(sessionID){
    //var session = firestore.collection("sessions").doc(sessionID);
} */

function getUsers(){
    
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
    var assignments = firestore.collection("assignments");

    var query = assignments.where("userIDs", "array-contains", userID).limit(20);
    
    var returnData = [];

    let ret = query.get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc){
            //console.log(doc.id, "=>", doc.data());
            returnData.push({
                id: doc.id,
                data: doc.data()})    
        });
        return returnData;
    }).catch(function(error) {
        console.log("Error getting assignments: ", error);
    })
    return returnData;
}

export {createAssignment, createSession, getAllSessionsForUser, getAssignmentsForUser}
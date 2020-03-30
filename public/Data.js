'use strict';
//TODO: Research more robust methods of querying firebase. Develop standard responses to 'client'
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
        //TODO check if user exists...
        //Uncomment when user creation is ready
    let userRef = firestore.collection("users").doc(userID);
    batch.update(userRef, {"latestSessionTime": docData.sessionTime})

    //Commit the batch
   return batch.commit().then(function(){
        console.log("New Session successfully written! ", newSessionRef.id);
    }).catch(function(error){
        console.error("Error when adding new session: ", error);
    });
}

async function getSession(sessionID){
    
    var sessionData = {};
    async function getSessionData(sessionID){
        var returnData = {id: null};
        var docRef = firestore.collection("sessions").doc(sessionID);
        let promise = await docRef.get();
        
        if(promise.doc.exists){
            returnData = {
                id: promise.doc.id,
                data: promise.doc.data()
            }
        }else{
            throw error("Requested session does not exist!");
        }
        
        return returnData;
    }

    try {
        sessionsData = await getSessionData(sessionID);
    } catch(err){
        console.log("Error getting sessions ", err);
    } finally{
          console.log("returning data to client...", sessionsData);
          return sessionsData;
    }
    
}
//Retrieves all sessions based on passed userID
//Returns a JSON object containing an array
//TODO: Figure out order, by timestamp?
async function getAllSessionsForUser(userID){

    var sessionsArray = {dataArray: null};

    async function getSessionData(userID){
        //Return data as an array of maps, where each item contains the docID and session data
        //We can change this to return a custom object later
        var returnData = {
            dataArray: []
        }

        var sessions = firestore.collection("sessions");
        //IMPORTANT
        //we can implement pagination later on to perform batched reads
        //I am implementing a limit so we don't run into pricing issues
        var query = sessions.where("userID", "==", userID).limit(20);

        let promise = await query.get();
        for (const sess of promise.docs){
            returnData.dataArray.push(
                {
                    id: sess.id,
                    data: sess.data()
                }
            );
        }
        return returnData;
    }

    try {
        sessionsArray = await getSessionData(userID);
    } catch(err){
        console.log("Error getting sessions ", err);
    } finally{
          console.log("returning data to client...", sessionsArray);
          return sessionsArray;
    }
}

//Gets All Users in users table
//Returns a JSON object containing an array
async function getUsers(){

    var usersArray = {dataArray: null};

    async function getUserData(){
        var users = firestore.collection("users");
        var returnData = {
            dataArray: []
        }
        let promise = await users.get();
        for (const user of promise.docs){
            returnData.dataArray.push(
                {
                    id: user.id,
                    data: user.data()
                }
            );
        }
        return returnData;
    }

    try {
        usersArray = await getUserData();
      }catch(err){
        console.log("Error getting users ", err);
      }finally{
          console.log("returning data to client...", usersArray);
          return usersArray;
      }
}

//Creates an Assignment
//Only a Researcher should be able to add assignment
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

//Gets All Assignments for a User
//Returns a JSON object containing an array
async function getAssignmentsForUser(userID){

    var assignmentsArray = {dataArray: null};

    async function getAssignmentData(userID){
        var returnData = {
            dataArray: []
        }
        var assignments = firestore.collection("assignments");
        var query = assignments.where("userIDs", "array-contains", userID).limit(20);

        let promise = await query.get();

        for (const assign of promise.docs){
            returnData.dataArray.push(
                {
                    id: assign.id,
                    data: assign.data()
                }
            );
        }
        return returnData;
    }

    try {
        assignmentsArray = await getAssignmentData(userID);
    } catch(err){
        console.log("Error getting assignments ", err);
    } finally{
          console.log("returning data to client...", assignmentsArray);
          return assignmentsArray;
    }
}

export {createAssignment, createSession, getAllSessionsForUser, getAssignmentsForUser, getUsers, getSession}
//File: /Data.js

//Description: Contains all the functions that interact with cloud firestore.

//Includes functions for creating sessions and assignments, and reading users, sessions, and assignments.

//TODO: Research more robust methods of querying firebase(pagination). Develop standard error responses to 'client'
'use strict';

var firestore = firebase.firestore();

//Function: createSession

//Input: string assignmentID: the label of assignment that launched this session. Value is 'Custom Session' if not launched from assignment

//       int bpm: beats per minute

//       int soundOn: time in seconds of game phase where sound was on

//       int soundOff: int,time in seconds of game phase where sound was off

//       int cycles: the amount of times the game cycled. 1 cycle = soundOn + soundOff, 2 cycles = soundOn + soundOff + soundOn + soundOff, etc

//       boolean feedback: true if feedback was enabled, false if not

//       string userID: the userID of the user who completed the session

//       array of TapObjects tapData: the array containing each TapObject in the session

//Output: returns the promise object

//Description: Creates new session upon completion of game. Stores tap objects as an array of TapObjects.
//Also updates the user document with the latest session time
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
    let userRef = firestore.collection("users").doc(userID);
    batch.update(userRef, {"latestSessionTime": docData.sessionTime})

    //Commit the batch
   return batch.commit().then(function(){
        console.log("New Session successfully written!");
    }).catch(function(error){
        console.log("Error when writing session!");
    });
}

//Function: getSession

//Input: string sessionID, the id of the requested session document

//Output: returns sessionData, {id: the id of the session document, data: the contents of the session document}

//Description: Returns the requested session document
async function getSession(sessionID){

    var sessionData = {};
    //performs the actual firestore query
    async function getSessionData(sessionID){
        var returnData = {id: null};
        var docRef = firestore.collection("sessions").doc(sessionID);
        let promise = await docRef.get();

        if(promise.exists){
            returnData = {
                id: promise.id,
                data: promise.data()
            }
        }else{
            throw error("Requested session does not exist!");
        }
        return returnData;
    }

    //Calls getSessionData, handles any errors that may occur, returns sessionsData before exit
    try {
        sessionsData = await getSessionData(sessionID);
    } catch(err){
        alert("Unable to display Session!");
    } finally{
          return sessionsData;
    }

}

//Function: getAllSessionsForUser

//Input: string userID, the id of the user tied to the desired sessions

//Output: returns sessionsArray, {dataArray: [{id: the id of the session document, data: the contents of the session document}, {...}, {...}]}

//Description: Gets all sessions tied to passed userID, returns them in an object containing an array of sessions
async function getAllSessionsForUser(userID){

    var sessionsArray = {dataArray: null};

    async function getSessionData(userID){

        //Return data as an array of maps, where each item contains the docID and session data
        
        var returnData = {
            dataArray: []
        }

        var sessions = firestore.collection("sessions").orderBy("sessionTime", "desc");
        
        var query = sessions.where("userID", "==", userID);

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
        alert("Unable to display Sessions!");
    } finally{
          return sessionsArray;
    }
}

//Function: getUser

//Input: string userID, the id of the requested user

//Output: returns userData = {id: user doc id, data: user doc data}

//Description: Returns the user document of the requested user
async function getUser(userID){

    var userData = {};
    async function getUserData(userID){
        var returnData = {id: null};
        var docRef = firestore.collection("users").doc(userID);
        let promise = await docRef.get();

        if(promise.exists){
            returnData = {
                id: promise.id,
                data: promise.data()
            }
        }else{
            throw error("Requested user does not exist!");
        }

        return returnData;
    }

    try {
        userData = await getUserData(userID);
    } catch(err){
        alert("Unable to display User!");
    } finally{
          return userData;
    }

}
//Function: getUsers

//Input: none

//Output: returns usersArray = {dataArray:[{id: user doc id, data: user doc data},{...},{...}]}

//Description: Returns all the users in the users collection

async function getUsers(){

    var usersArray = {dataArray: null};

    async function getUserData(){
        var users = firestore.collection("users");
        var returnData = {
            dataArray: []
        }
        let promise = await users.orderBy("userID").get();
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
        alert("Unable to display Users!");
      }finally{
          return usersArray;
      }
}

//Function: createAssignment

//Input: string assignmentLabel: the name of the assignment

//       int bpm: beats per minute

//       int soundOn: time in seconds of game phase where sound was on

//       int soundOff: int,time in seconds of game phase where sound was off

//       int cycles: the amount of times the game cycled. 1 cycle = soundOn + soundOff, 2 cycles = soundOn + soundOff + soundOn + soundOff, etc

//       boolean feedback: true if feedback was enabled, false if not

//       boolean defaultAssignment: true if the assignment is a default assignment to be assigned to all users

//       string array userIDs: the list of users that are assigned this assignment

//Output: none

//Description: Creates new assignment for listed users based off of passed parameters

function createAssignment(assignmentLabel, bpm, soundOn, soundOff, cycles, feedback, defaultAssignment, userIDs ){
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
        default: defaultAssignment,
        userIDs: userIDs,
    };
    assignments.add(docData).then(function(){
        alert("New Assignment successfully written!");
    }).catch(function(error) {
        alert("Unable to write new Assignment");
    });
}

//Function: getAssignmentsForUser

//Input: string userID, id of user that is tied to requested assignments

//Output: returns assignmentsArray = {dataArray:[{id: assignment doc id, data: assignment doc data},{...},{...}]}

//Description: Returns all the assignments for the passed userID

async function getAssignmentsForUser(userID){

    var assignmentsArray = {dataArray: null};

    async function getAssignmentData(userID){
        var returnData = {
            dataArray: []
        }
        var assignments = firestore.collection("assignments").orderBy("assignmentLabel");
        var userIdQuery = assignments.where("userIDs", "array-contains", userID);
        var defaultQuery = assignments.where("default", "==", true);

        let userIdPromise = await userIdQuery.get();

        for (const assign of userIdPromise.docs){
            returnData.dataArray.push(
                {
                    id: assign.id,
                    data: assign.data()
                }
            );
        }

        let defaultPromise = await defaultQuery.get();

        for(const assign of defaultPromise.docs) {
            if(!returnData.dataArray.includes(assign)){
                returnData.dataArray.push(
                    {
                        id: assign.id,
                        data:assign.data()
                    }
                )
            }
        }

        return returnData;
    }

    try {
        assignmentsArray = await getAssignmentData(userID);
    } catch(err){
        alert("Unable to display Assignments!");
    } finally{
          return assignmentsArray;
    }
}

async function getAllAssignments(){
  var assignmentsArray = {dataArray: null};

  async function getAssignmentData(){
      var returnData = {
          dataArray: []
      }
      var assignments = firestore.collection("assignments").orderBy("assignmentLabel");

      let promise = await assignments.get();

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
      assignmentsArray = await getAssignmentData();
  } catch(err){
    alert("Unable to display Assignments!");
  } finally{
        return assignmentsArray;
  }

}


export {createAssignment, createSession, getAllSessionsForUser, getAssignmentsForUser, getUsers, getSession, getUser, getAllAssignments}

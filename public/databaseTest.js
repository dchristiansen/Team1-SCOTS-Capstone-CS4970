
import {createAssignment, createSession, getAllSessionsForUser, getAssignmentsForUser, getUsers} from "./Data.js";

  const status = document.querySelector("#status");
  const inputBox = document.querySelector("#myText");
  const insertSession = document.querySelector("#insertSession");
  const insertAssign = document.querySelector("#insertAssign");
  const getSession = document.querySelector("#getSession");
  const getAssign = document.querySelector("#getAssignment");


 /*  saveButton.addEventListener("click", function(){
      const textToSave = inputBox.value;
      console.log("Saving to firebase");
      docRef.set({
          hotDogStatus: textToSave
      }).then(function(){
          console.log("Status saved");
      }).catch(function (error){
          console.log("Error ", error);
      });
  }) */

  getSession.addEventListener("click", function(){
      var user = firebase.auth().currentUser;
      console.log(user);
    /* let data = getAllSessionsForUser("vkvd7hlKXEOJSxSnn0pe2CJ5OXE3").then(function(sessions){
        console.log("sessions ", sessions);
    }); */
    let data = getAllSessionsForUser("vkvd7hlKXEOJSxSnn0pe2CJ5OXE3")
    console.log("my session stuff ", data);
  })

  //I guess we can access the return data either way
  getAssign.addEventListener("click", function(){
   /* let data = getAssignmentsForUser("vkvd7hlKXEOJSxSnn0pe2CJ5OXE3").then(function(assignments){
        console.log("assignments ", assignments);
    }); */

    //let data = getAssignmentsForUser("vkvd7hlKXEOJSxSnn0pe2CJ5OXE3")
    //console.log("my assignment stuff ", data);
    let data = getUsers();
    console.log(data);
  })


insertAssign.addEventListener("click", function(){
    createAssignment(
    "Assignment 3",
    "120",
    "10",
    "10",
    "1",
    "True",
    ["vkvd7hlKXEOJSxSnn0pe2CJ5OXE3", "user2"]);
    console.log("Created Assignment");
});

  insertSession.addEventListener("click", function(){
    let tapData = [{
        beat: 0,
        delta: -26,
        duration: 0,
        nextBeat: 0,
        nextDelta: 4,
        pressTime: 500,
        prevBeat: 0,
        releaseTime: 0,
        side: 0,
        soundOn: true,
        timeSinceLast: 574
    },{
       beat: 50,
       delta: -26,
       duration: 0,
       nextBeat: 0,
       nextDelta: 4,
       pressTime: 500,
       prevBeat: 0,
       releaseTime: 0,
       side: 0,
       soundOn: true,
       timeSinceLast: 574
    },{
       beat: 100,
       delta: -26,
       duration: 0,
       nextBeat: 0,
       nextDelta: 4,
       pressTime: 500,
       prevBeat: 0,
       releaseTime: 0,
       side: 0,
       soundOn: true,
       timeSinceLast: 574
    }] 
    let ret = createSession(
         "-1",
         "120",
         "10",
         "10",
         "1",
         "True",
         "vkvd7hlKXEOJSxSnn0pe2CJ5OXE3",
         tapData
     );
     //console.log(ret);
  })


  //Grab updated docunment in realtime
/*   getRealTimeUpdates = function() {
      docRef.onSnapshot(function (doc) {
        if(doc && doc.exists){
            const myData = doc.data();
            status.innerText = "Status: " + myData.hotDogStatus;
        }
      })
  } */

  //getRealTimeUpdates();

/*
beat: 600
prevBeat: 0
nextBeat: 1200
pressTime: 574
releaseTime: 691
duration: 117
delta: -26
nextDelta: -626
prevDelta: 574
timeSinceLast: 574
soundOn: true
side: 0 */
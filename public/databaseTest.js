
import {createAssignment, createSession, getAllSessionsForUser, getAssignmentsForUser, getUsers} from "./Data.js";

  const status = document.querySelector("#status");
  const inputBox = document.querySelector("#myText");
  const insertSession = document.querySelector("#insertSession");
  const insertAssign = document.querySelector("#insertAssign");
  const getSession = document.querySelector("#getSession");
  const getAssign = document.querySelector("#getAssignment");
  const getUser = document.querySelector("#getUser");

  getSession.addEventListener("click", async function(){
    var user = firebase.auth().currentUser;
    console.log(user);
  
    let data = await getAllSessionsForUser("vkvd7hlKXEOJSxSnn0pe2CJ5OXE3");
    console.log("Client session data ", data);
    //something odd here where doesnt print out each element...due to size?
    data.dataArray.forEach(obj =>{
      console.log("client session element " + obj);
    });
    //You can still acess elements tho
    console.log("First element ", data.dataArray[0]);

  })

  getAssign.addEventListener("click", async function(){
    let data = await getAssignmentsForUser("vkvd7hlKXEOJSxSnn0pe2CJ5OXE3");
    console.log("Client assignment data ", data);
    data.dataArray.forEach(obj =>{
      console.log("client assignment element ", obj);
    })
    
  })

  getUser.addEventListener("click", async function(){
    let data = await getUsers();
    console.log("Client user data ", data);
    data.dataArray.forEach(obj =>{
      console.log("client user element ", obj);
    })
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
     
});

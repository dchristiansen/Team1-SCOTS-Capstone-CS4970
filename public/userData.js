import { getAllSessionsForUser } from "./Data.js";
import { getUser } from "./Data.js";

const accountRecoveryForm = document.querySelector(".admin-recovery");
const deleteUserForm = document.querySelector(".admin-delete-user");

async function setHeader(userid) {
    let header = document.querySelector("#useridheader");
    let usercall = await getUser(userid);
    let username = usercall.data.userID;
    header.innerHTML = "User ID: " + username;
}

async function populateTable(userid) {
    let table = document.querySelector("#tablebody");
    let sessionsCall = await getAllSessionsForUser(userid);
    sessionData = sessionsCall.dataArray;
    sessionData.forEach(function (obj) {
        let tr = document.createElement('tr');

        let td_id = document.createElement('td');
        let sessionID = obj.data.assignmentID
        td_id.innerHTML = sessionID;
        tr.appendChild(td_id);

        let td_time = document.createElement('td');
        let sessionTime = obj.data.sessionTime;
        sessionTime = sessionTime.seconds * 1000;
        sessionTime = new Date(sessionTime);
        td_time.innerHTML = sessionTime;
        tr.appendChild(td_time);

        let td_params = document.createElement('td');
        let parameters = obj.data.parameters;
        let fbt = "";

        if (parameters.feedback == "true"){

            fbt = "On"
        } else {
            fbt = "Off"
        }
        td_params.innerHTML = parameters.bpm + " BPM, " + parameters.soundOnTime + " On, " + parameters.soundOffTime + " Off, " + parameters.cycles + " Cycles, Feedback " + fbt;
        tr.appendChild(td_params);

        let td_checkbox = document.createElement('td');
        let label = document.createElement('label');
        let checkbox = document.createElement('input');
        let span = document.createElement('span');
        checkbox.type = "checkbox";
        label.appendChild(checkbox);
        label.appendChild(span);
        td_checkbox.appendChild(label);
        tr.appendChild(td_checkbox);
        table.appendChild(tr);
        let selectBtn = document.querySelector("#select");
        selectBtn.classList.remove("disabled");
    });
}

function download() {
    let checkboxes = $("#tablebody input:checked");
    if (checkboxes.length == 0) {
        alert("Please select at least one session to download")
    } else {
        let sessionsDL = [];
        let zip = new JSZip();
        checkboxes = $("#tablebody input");
        for (let i = 0; i < sessionData.length; i++) {
            if (checkboxes[i].checked) {
                sessionsDL.push({session : sessionData[i].data, id : i});
            }
        }
        if (sessionsDL.length == 1) {
            let session = sessionsDL[0];
            let csv = formatCSV(session.session);
            let csvContent = "data:text/csv;charset=utf-8," + csv;
            let encodedUri = encodeURI(csvContent);
            let link = document.createElement('a');
            link.setAttribute('href', encodedUri);
            link.setAttribute('download', 'session' + session.id + '.csv');
            link.click();
            return;
        } else {
            sessionsDL.forEach(function (session) {
                let csv = formatCSV(session.session);
                zip.file("session" + session.id + ".csv", csv);
            });

        }
        zip.generateAsync({ type: "blob" }).then(function (blob) {
            window.saveAs(blob, "sessions.zip");
        }, function (err) {
            jQuery("#blob").text(err);
        });
    }
}


function formatCSV(session) {
    let parameters = session.parameters;
    let taps = session.taps
    let data = [];
    data.push(["Tempo (BPM)", parameters.bpm]);
    data.push(["Time On (ms)", parameters.soundOnTime]);
    data.push(["Time Off (ms)", parameters.soundOffTime]);
    data.push(["Cycles", parameters.cycles]);
    data.push(["Feedback", parameters.feedback]);
    data.push([]);
    data.push(["Beat time (ms)", "Tap time (ms)", "Release time (ms)", "Tap intervals (ms)", "Asynchrony (ms)", "Key-press duration (ms)"]);
    taps.forEach(function (tap) {
        data.push([tap.beat, tap.pressTime, tap.releaseTime, tap.timeSinceLast, tap.delta, tap.duration]);
    });
    let csvContent = data.map(e => e.join(",")).join("\n");
    return csvContent;
}
    let sessionData;
firebase.auth().onAuthStateChanged(user => {
    if(user)
    {
        user.getIdTokenResult().then(idTokenResult => {
            user.admin = idTokenResult.claims.admin;
            if(user.admin)
            {
                let downloadButton = document.querySelector("#downloadbutton");
                downloadButton.onclick = download;
 
                let params = new URLSearchParams(location.search);
                let userid = params.get('id');

                setHeader(userid);
                populateTable(userid);
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
        window.location = "index.html";
    }
});

$(document).ready(function () {
    $("#select").click(function () {
        let checked = !$(this).data('checked');
        $('input:checkbox').prop('checked', checked);
        $(this).val(checked ? 'uncheck all' : 'check all')
        $(this).data('checked', checked);
    });
});

accountRecoveryForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const confirmPassword = document.getElementById("confirmPassword").value;
    let params = new URLSearchParams(location.search);
    let userid = params.get('id');

    const changeUserPassword = firebase.functions().httpsCallable('changeUserPassword');
    changeUserPassword({uid: userid, password: confirmPassword}).then(result => {
        console.log(result);
        alert(result.data.message)
    }).catch(function(error) {
        console.log(error);
        alert(error.message);
    })
});

deleteUserForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let params = new URLSearchParams(location.search);
    let userid = params.get('id');

    const deleteUser = firebase.functions().httpsCallable('deleteUser');
    deleteUser({uid: userid}).then(result => {
        console.log(result);
        alert(result.data.message);
    }).catch(function(error) {
        console.log(error);
        alert(error.message);
    })

})
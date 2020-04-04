

async function setHeader(userid) {
    let header = document.querySelector("#assignmentidheader");
    let usercall = await getUser(userid);
    let username = usercall.data.userID;
    header.innerHTML = "Assignment: " + username;
}

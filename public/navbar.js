let loggedIn = false;
let rPortal = false;
let linkArray = [];

firebase.auth().onAuthStateChanged(async function(user) {
    //Check if currently logged in
    if(user) {
        loggedIn = true;
        //If logged in, check if on the researcher portal or user dashboard
        await user.getIdTokenResult().then(idTokenResult => {
            user.admin = idTokenResult.claims.admin;
            if(user.admin) {
                rPortal = true;
            }
        });
    }

    if(loggedIn) {
        //Do the links for a researcher
        if(rPortal) {
            linkArray.push({link: "rPortal.html", text: "Researcher Portal Home"}, {link:"assignments.html", text: "View Assignments"}, 
            {link:"createassignment.html", text:"Create Assignment"}, {link:"createuser.html", text: "Create User"}, {link: "#", text: "About"}, {link: "#", text: "Contact"});
        } 
        //Do the links for a user
        else {
            linkArray.push("");
        }
    }

    let navhtml = document.querySelector("#navbar");
    let div = document.createElement("div");
    div.classList = "nav-wrapper blue darken-2";

    let logo = document.createElement("a");
    logo.className = "brand-logo";
    logo.innerText = "Scots";
    logo.href = "#!";
    div.appendChild(logo);

    let sidenav = document.createElement("a");
    sidenav.className = "sidenav-trigger";
    sidenav.setAttribute("data-target", "mobile-demo");
    sidenav.href="#";

    let sidenavI = document.createElement("i");
    sidenavI.className = "material-icons";
    sidenavI.innerText = "menu";
    sidenav.appendChild(sidenavI);
    div.appendChild(sidenav);

    let linkList = document.createElement("ul");
    linkList.classList = "right hide-on-med-and-down";

    linkArray.forEach(element => {
        let pathname = "/" + element.link;
        if(window.location.pathname != pathname){
            let listItem = document.createElement("li");
            let itemContents = document.createElement("a");
            itemContents.href = element.link;
            itemContents.innerText = element.text;
            listItem.appendChild(itemContents);
            linkList.appendChild(listItem);
        }
    });

    div.appendChild(linkList);
    navhtml.appendChild(div);

    console.log(navhtml);
});

/*      <div class="nav-wrapper blue darken-2">
            <a href="#!" class="brand-logo">Scots</a>
            <a href="#" data-target="mobile-demo" class="sidenav-trigger"><i class="material-icons">menu</i></a>
            <ul class="right hide-on-med-and-down">
                <li><a href="assignments.html">View Assignments</a></li>
                <li><a href="createassignment.html">Create Assignment</a></li>
                <li><a href="createuser.html">Create User</a></li>
                <li><a href="#">About</a></li>
                <li><a href="#">Contact</a></li>
            </ul>
      </div>*/
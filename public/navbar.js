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
            {link:"createassignment.html", text:"Create Assignment"}, {link:"createuser.html", text: "Create User"}, {link: "Logout", text: "Logout"}, {link: "#", text: "About"}, 
            {link: "#", text: "Contact"});
        } 
        //Do the links for a user
        else {
            linkArray.push({link: "userdashboard.html", text: "User Dashboard"}, {link: "edituser.html", text: "Change User"}, {link: "Logout", text: "Logout"},
            {link: "#", text: "About"}, {link: "#", text: "Contact"});
        }
    } else {
        linkArray.push({link: "index.html", text: "Login"}, {link: "parameters.html", text: "Parameter Select"}, {link: "#", text: "About"}, {link: "#", text: "Contact"});
    }

    //Grab the navbar element
    let navhtml = document.querySelector("#navbar");
    //Create the surrounding div
    let div = document.createElement("div");
    div.classList = "nav-wrapper blue darken-2";

    //Create the "logo" element
    let logo = document.createElement("a");
    logo.className = "brand-logo";
    logo.innerText = "Scots";
    logo.href = "#!";
    div.appendChild(logo);

    //Create the a tag that will hold the mobile menu
    let sidenav = document.createElement("a");
    sidenav.className = "sidenav-trigger";
    sidenav.setAttribute("data-target", "mobile-demo");
    sidenav.href="#";

    //Create the menu icon
    let sidenavI = document.createElement("i");
    sidenavI.className = "material-icons";
    sidenavI.innerText = "menu";
    sidenav.appendChild(sidenavI);
    div.appendChild(sidenav);

    //Create the list
    let linkList = document.createElement("ul");
    linkList.classList = "right hide-on-med-and-down";

    //For each link in our link array, create the corresponding link in the navbar
    linkArray.forEach(element => {
        let pathname = "/" + element.link;
        //Avoid creating a link for the page that we are currently on
        if(window.location.pathname != pathname){
            let listItem = document.createElement("li");
            let itemContents = document.createElement("a");
            if(element.link = "Logout") {
                itemContents.addEventListener("click", e => {
                    firebase.auth().signOut().then(function() {
                        window.location = "index.html";
                    }).catch(function (error) {
                        console.log(error);
                    });
                });
            } else {
                itemContents.href = element.link;
            }
            itemContents.innerText = element.text;
            listItem.appendChild(itemContents);
            linkList.appendChild(listItem);
        }
    });

    //Append the list to the div
    div.appendChild(linkList);
    //Append the div to the navbar element
    navhtml.appendChild(div);
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
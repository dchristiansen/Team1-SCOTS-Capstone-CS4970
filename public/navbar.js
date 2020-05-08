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
            linkArray.push({link: "/researcher/rPortal.html", text: "Researcher Portal Home"}, {link:"/researcher/assignments/assignments.html", text: "View Assignments"},
            {link:"/researcher/assignments/createassignment.html", text:"Create Assignment"}, {link:"/researcher/users/createuser.html", text: "Create User"}, {link: "Logout", text: "Logout"}, {link: "/about.html", text: "About"},
            {link: "/contact.html", text: "Contact"});
        }
        //Do the links for a user
        else {
            linkArray.push({link: "/user/userdashboard.html", text: "User Dashboard"}, {link: "/user/edituser.html", text: "Change Password"}, {link: "Logout", text: "Logout"},
            {link: "/about.html", text: "About"}, {link: "contact.html", text: "Contact"});
        }
    } else {
        linkArray.push({link: "/login.html", text: "Login"}, {link: "/user/parameters.html", text: "Parameter Select"}, {link: "about.html", text: "About"}, {link: "/contact.html", text: "Contact"});
    }

    //Grab the navbar element
    let navhtml = document.querySelector("#navbar");

    //Grab the mobile demo list
    let mobileDemo = document.querySelector("#mobile-demo");

    //Create the list
    if(document.querySelector("#linkList") == null){
        let linkList = document.createElement("ul");
        linkList.classList = "right hide-on-med-and-down";
        linkList.id="linkList";

        //For each link in our link array, create the corresponding link in the navbar
        linkArray.forEach(element => {
            let pathname = element.link;
            //Avoid creating a link for the page that we are currently on
            if(window.location.pathname != pathname){
                let listItem = document.createElement("li");
                let itemContents = document.createElement("a");
                //Add logout functionality to the logout button
                if(element.link == "Logout") {
                    itemContents.addEventListener("click", e => {
                        firebase.auth().signOut().then(function() {
                            window.location = "/login.html";
                        }).catch(function (error) {

                        });
                    });
                } else {
                    itemContents.href = element.link;
                }
                itemContents.innerText = element.text;
                listItem.appendChild(itemContents);
                //Create a copied version of the list item for use in the mobile navmenu
                let demoItem = listItem.cloneNode(true);

                mobileDemo.appendChild(demoItem);
                linkList.appendChild(listItem);
            }
        });

        //Append the list to the navbar
        navhtml.appendChild(linkList);
    }
});

/*      <div class="nav-wrapper blue darken-2">
            <a href="#!" class="brand-logo">Scots</a>
            <a href="#" data-target="mobile-demo" class="sidenav-trigger"><i class="material-icons">menu</i></a>
            <ul class="right hide-on-med-and-down">
                <li><a href="/researcher/assignments/assignments.html">View Assignments</a></li>
                <li><a href="/researcher/assignments/createassignment.html">Create Assignment</a></li>
                <li><a href="/researcher/users/createuser.html">Create User</a></li>
                <li><a href="#">About</a></li>
                <li><a href="#">Contact</a></li>
            </ul>
      </div>*/

      /*      <li><a href="/researcher/assignments/assignments.html">View Assignments</a></li>
      <li><a href="/researcher/assignments/createassignment.html">Create Assignment</a></li>
      <li><a href="/researcher/users/createuser.html">Create User</a></li>
      <li><a href="#">About</a></li>
      <li><a href="#">Contact</a></li>*/

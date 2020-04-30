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
            linkArray.push({link: "rPortal.html", text: "Researcher Portal Home", id:"rPortal"}, {link:"assignments.html", text: "View Assignment", id:"viewA"},
            {link:"createassignment.html", text:"Create Assignment", id:"createA"}, {link:"createuser.html", text: "Create User", id:"createU"}, {link: "Logout", text: "Logout", id:"logout"}, {link: "#", text: "About", id:"about"},
            {link: "#", text: "Contact", id:"contact"});
        }
        //Do the links for a user
        else {
            linkArray.push({link: "userdashboard.html", text: "User Dashboard"}, {link: "edituser.html", text: "Edit User"}, {link: "Logout", text: "Logout"},
            {link: "#", text: "About"}, {link: "#", text: "Contact"});
        }
    } else {
        linkArray.push({link: "index.html", text: "Login"}, {link: "parameters.html", text: "Parameter Select"}, {link: "#", text: "About"}, {link: "#", text: "Contact"});
    }

    //Grab the navbar element
    let navhtml = document.querySelector("#navbar");

    //Grab the mobile demo list
    let mobileDemo = document.querySelector("#mobile-demo");

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
            //Add logout functionality to the logout button
            if(element.link == "Logout") {
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
            listItem.id = element.id;

            listItem.appendChild(itemContents);
            //Create a copied version of the list item for use in the mobile navmenu
            let demoItem = listItem.cloneNode(true);

            mobileDemo.appendChild(demoItem);
            linkList.appendChild(listItem);
        }
    });

    //Append the list to the navbar
    navhtml.appendChild(linkList);
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

      /*      <li><a href="assignments.html">View Assignments</a></li>
      <li><a href="createassignment.html">Create Assignment</a></li>
      <li><a href="createuser.html">Create User</a></li>
      <li><a href="#">About</a></li>
      <li><a href="#">Contact</a></li>*/

const functions = require('firebase-functions');
const admin = require('firebase-admin')

admin.initializeApp();

/*
    addAdminRole
    params: data, context
    Takes in a user email, and admin user context
    and adds the admin role to the passed in user
*/
exports.addAdminRole = functions.https.onCall((data, context) => {
    // If a user is not authenticated, return an error message
    if (!context.auth)
    {
        return {message: "The user is not authenticated."};
    }

    // If a user is not an admin, return an error message
    if(!context.auth.token.admin)
    {
        return {message: "Only admin users can add other admins."};
    }

    // Get the email of the user that you want to make an admin
    return admin.auth().getUserByEmail(data.email).then(user => {
        // Delete that user's record from the database
        let docRef = admin.firestore().collection("users").doc(user.uid);
        docRef.delete().then(() => {
            console.log("Document successfully deleted.");
        });

        // Set their custom claim to admin: true
        return admin.auth().setCustomUserClaims(user.uid, {
            admin: true
        });
    }).then(() => {
        // Return success message
        return {
            message: 'Success! The user has been made an admin.'
        }
    }).catch(error => {
        // Return error message
        return {message: error.message};
    });
});

/*
    createUser
    params: data, context
    Takes in a new user email, new user password, and admin user context
    and creates a new user based on the passed in email and password

*/
exports.createUser = functions.https.onCall(async (data, context) => {
    try {

        // If the user is not authenticated, return an error message
        if(!context.auth) {
            return {message: "The user is not authenticated."};
        }

        // If the user is not an admin, return an error message
        if(!context.auth.token.admin) {
            return {message: "Only admin users can create new users."};
        }

        // Construct a new user object
        const newUser = {
            email: data.email,
            password: data.password
        };

        // Create a new user using the admin API
        const userRecord = await admin.auth().createUser(newUser);
        const userUID = userRecord.uid;
        const userID = data.email.split("@")[0];

        // Construct a new database record object
        const dbRecord = {
            userID: userID,
            changePassword: false
        };
        
        // Create a new document in the users collection with the document
        // ID as the user uid
        await admin.firestore().collection("users").doc(userUID).set(dbRecord);
        // Return success message
        return {message: 'Success! The user has been created.'}
    } catch (error) {
        // Return error message
       return {message: error.message};
    }
});

const functions = require('firebase-functions');
const admin = require('firebase-admin')

admin.initializeApp();

/*
    addAdminRole
    params: data, context
    Takes in a user email, and admin user context
    and adds the admin role to the passed in user
*/
exports.addAdminRole = functions.https.onCall(async(data, context) => {
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
    return admin.auth().getUserByEmail(data.email).then(async (user) => {
        // Delete that user's record from the database
        let docRef = await admin.firestore().collection("users").doc(user.uid);
        await docRef.delete();

        // Delete the sessions created by the user
        let sessionQuery = await admin.firestore().collection("sessions").where("userID", "==", user.uid)
        await sessionQuery.get().then(querySnapshot => {
            querySnapshot.forEach(documentSnapshot => {
                let documentRef = admin.firestore().collection("sessions").doc(documentSnapshot.id);
                documentRef.delete();
            });
        });

        // Remove the user from each assignment record that the user was assigned to
        let assignmentQuery = await admin.firestore().collection("assignments").where("userIDs", "array-contains", user.uid);
        let assignmentPromise = await assignmentQuery.get();
        for(const assignmentDoc of assignmentPromise.docs) {
            let assignedUIDs = await assignmentDoc.data().userIDs;
            await assignedUIDs.splice( assignedUIDs.indexOf(data.uid), 1 );
            let assignmentRef = admin.firestore().collection("assignments").doc(assignmentDoc.id);
            
            await assignmentRef.update({
                userIDs: assignedUIDs
            });
        }

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
    createAdmin
    params: data, context
    Takes in a user email, and admin user context
    and adds the admin role to the passed in user, no security checks
*/
exports.createAdmin = functions.https.onCall(async(data, context) => {
    // Get the email of the user that you want to make an admin
    return admin.auth().getUserByEmail(data.email).then(async (user) => {
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
    changeUserPassword
    params: uid, password
    Takes in a uid and password and changes the password
    corresponding users password
*/
exports.changeUserPassword = functions.https.onCall(async(data, context) => {
    try {
        
        // If the user is not authenticated, return an error message
        if(!context.auth)
        {
            return {message: "The user is not authenticated."};
        }

        // If the user is not an admin, return an error message
        if(!context.auth.token.admin)
        {
            return {message: "Only admin users can change other users' passwords."};
        }

        admin.auth().updateUser(data.uid, {
            password: data.password
        });

        return {message: "Successfully updated user password."};
    }
    catch (error)
    {
        return {message: error.message};
    }
});

/*
    deleteUser
    param: uid
    Deletes a user based on the passed in uid
*/
exports.deleteUser = functions.https.onCall(async(data, context) => {
    try {
        
        // If the user is not authentication, return an error message
        if(!context.auth) {
            return {message: "The user is not authenticated."};
        }

        // If the user is not an admin, return an error message
        if(!context.auth.token.admin) {
            return {message: "Only admin users can delete users."};
        }
        
        // Delete the user from firebase auth
        await admin.auth().deleteUser(data.uid);
        
        // Delete the user from users document
        let userDoc = await admin.firestore().collection("users").doc(data.uid);
        await userDoc.delete();
        
        // Delete the sessions created by the user
        let sessionQuery = await admin.firestore().collection("sessions").where("userID", "==", data.uid)
        await sessionQuery.get().then(querySnapshot => {
            querySnapshot.forEach(documentSnapshot => {
                let documentRef = admin.firestore().collection("sessions").doc(documentSnapshot.id);
                documentRef.delete();
            });
        });
        

        // Remove the user from each assignment record that the user was assigned to
        let assignmentQuery = await admin.firestore().collection("assignments").where("userIDs", "array-contains", data.uid);
        let assignmentPromise = await assignmentQuery.get();
        for(const assignmentDoc of assignmentPromise.docs) {
            let assignedUIDs = await assignmentDoc.data().userIDs;
            await assignedUIDs.splice( assignedUIDs.indexOf(data.uid), 1 );
            let assignmentRef = admin.firestore().collection("assignments").doc(assignmentDoc.id);
            
            await assignmentRef.update({
                userIDs: assignedUIDs
            });
        }


        return {message: "Successfully deleted user"};
    } catch(error) {
        return {message: error.message};
    }
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

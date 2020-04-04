const functions = require('firebase-functions');
const admin = require('firebase-admin')

admin.initializeApp();

exports.addAdminRole = functions.https.onCall((data, context) => {
    // get use and add custom claim (make them an admin)
    if (!context.auth)
    {
        return {message: "The user is not authenticated."};
    }

    if(!context.auth.token.admin)
    {
        return {message: "Only admin users can add other admins."};
    }

    return admin.auth().getUserByEmail(data.email).then(user => {
        let docRef = admin.firestore().collection("users").doc(user.uid);
        docRef.delete().then(() => {
            console.log("Document successfully deleted.");
        });
        return admin.auth().setCustomUserClaims(user.uid, {
            admin: true
        });
    }).then(() => {
        return {
            // message: 'Success! ${data.email} has been made an admin'
            message: 'Success! The user has been made an admin.'
        }
    }).catch(error => {
        return {message: error.message};
    });
});

exports.createUser = functions.https.onCall(async (data, context) => {
    try {
        if(!context.auth) {
            return {message: "The user is not authenticated."};
            //throw new UnauthenticatedError("The user is not authenticated.");
        }

        const callingUid = context.auth.uid;
        const callingUserRecord = await admin.auth().getUser(callingUid);

        if(!context.auth.token.admin) {
            return {message: "Only admin users can create new users."};
            //throw new NotAnAdminError("Only Admin users can create new users.");
        }

        const newUser = {
            email: data.email,
            password: data.password
        };

        const userRecord = await admin.auth().createUser(newUser);
        const userUID = userRecord.uid;
        const userID = data.email.split("@")[0];

        const dbRecord = {
            userID: userID,
            changePassword: false
        };
        
        await admin.firestore().collection("users").doc(userUID).set(dbRecord);
        //return {result: 'Success! ${data.email} has been created'}
        return {message: 'Success! The user has been created.'}
    } catch (error) {
        /*
        if (error.type === 'UnauthenticatedError') {
            throw new functions.https.HttpsError('unauthenticated', error.message);
        } else if (error.type === 'NotAnAdminError' || error.type === 'InvalidRoleError') {
            throw new functions.https.HttpsError('failed-precondition', error.message);
        } else {
            throw new functions.https.HttpsError('internal', error.message);
        }
        */
       return {message: error.message};
    }
});

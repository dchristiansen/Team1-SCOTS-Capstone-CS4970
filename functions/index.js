const functions = require('firebase-functions');
const admin = require('firebase-admin')

admin.initializeApp();

exports.addAdminRole = functions.https.onCall((data, context) => {
    // get use and add custom claim (make them an admin)

    return admin.auth().getUserByEmail(data.email).then(user => {
        return admin.auth().setCustomUserClaims(user.uid, {
            admin: true
        });
    }).then(() => {
        return {
            // message: 'Success! ${data.email} has been made an admin'
            message: 'Success! The user has been made an admin'
        }
    }).catch(err => {
        return err;
    });
});

exports.createUser = functions.https.onCall(async (data, context) => {
    try {
        if(!context.auth) {
            throw new UnauthenticatedError("The user is not authenticated.");
        }

        const callingUid = context.auth.uid;
        const callingUserRecord = await admin.auth().getUser(callingUid);

        if(!callingUserRecord.customClaims.admin) {
            throw new NotAnAdminError("Only Admin users can create new users.");
        }

        const newUser = {
            email: data.email,
            password: data.password
        };

        const userRecord = await admin.auth().createUser(newUser);
        //return {result: 'Success! ${data.email} has been created'}
        return {message: 'Success! The user has been created'}
    } catch (error) {
        if (error.type === 'UnauthenticatedError') {
            throw new functions.https.HttpsError('unauthenticated', error.message);
        } else if (error.type === 'NotAnAdminError' || error.type === 'InvalidRoleError') {
            throw new functions.https.HttpsError('failed-precondition', error.message);
        } else {
            throw new functions.https.HttpsError('internal', error.message);
        }
    }
});

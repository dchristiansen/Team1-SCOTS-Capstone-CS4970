# Team1-SCOTS-Capstone-CS4970
Repository for UNO Computer Science Capstone (CS4970)

## Welcome to RAC Trainer

Rhythmic Auditory Cueing (RAC) is a form of rehabilitation that utilizes a recurring beat or rhythm to offer an external cue to influence and improve motor skills, espcially gait. However, the notion of extracting a beat and keeping the same rhythm is challenging for humans, especially if the human has a neurological disorder such as Parkinson's Disease. If disruption to the brain's neural networks occur, by accident or by through neurological disorder, it can affect auditory-motor synchronization to a rhythm. 

This is where RAC Trainer comes into play. Similar to how a metronome helps a musician stay on tempo, rhythmic stimulation or RAC provides an effective approach to improving gait parameters. RAC Trainer is an online game that allows users to visit a website and conduct interval RAC training from the comfort of their own homes.

## Researcher Functionality

As a researcher with administrative privileges on the application, you can login to a researcher account and will be able to view all research subjects under your care through the researcher portal. The researcher can create additinal users to accomodate additional subjects from the application, as well as recover/change their password in case they forget. In the event that more researchers need to be added to the project with administrative privileges, an existing researcher can login and simply input the username of another existing user and make them an administrator to the web application. This will grant a user access to the researcher portal.

Researchers can also view and download raw session data from individual users in the form of a csv file. This data contains all pertinent information regarding the taps that were made during a session including the time of the beat, the time of the tap, the asynchrony between the beat and tap, and more. The data in the csv file closely models what the researchers use currently in the lab. In addition to users playing their own custom sessions, researchers will also be able to create assignments and assign training to their subjects. 

## User Functionality

From the research subject perspective, a user will be able to login to their profile with the credentials given to them by the researcher overseeing them. Along with being able to play the game with their own custom parameters, subjects will also be able to see the training assignments that have been assigned to them by their researcher. When the user completes the assignment, the tap data is stored in the database and a score is displayed to the user.


[Click here to visit the web application](https://ractrainer.firebaseapp.com/)

## Steps to Setup the Project
1. Install Node.js
2. Clone the master branch from https://github.com/dchristiansen/Team1-SCOTS-Capstone-CS4970
3. Request access to the Scots-Capstone Firebase project from the owner
4. In the root directory of the project, run `npm install -g firebase-tools`
5. In the root directory of the project, run `firebase init functions` to install the node module dependencies for Firebase Functions
6. Run `firebase login` and login via the browser
7. Run `firebase projects: list` to verify that the Scots-Capstone project is there
8. To serve the application locally, run `firebase serve`
9. To deploy the application to the application, from the root project of your local project directory, run `firebase deploy --only hosting:ractrainer`
10. Visit `https://ractrainer.firebaseapp.com/`

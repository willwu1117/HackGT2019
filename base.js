import Rebase from 're-base';
import firebase from 'firebase';

const config = {
    apiKey: env.REACT_APP_FIREBASE_KEY,
    authDomain: env.REACT_APP_FIREBASE_DOMAIN,
    databaseURL: env.REACT_APP_FIREBASE_DATABASE,
    projectId: env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: env.REACT_APP_FIREBASE_SENDER_ID
};

const app = firebase.initializeApp(config)
const base = Rebase.createClassApp(app.database())

export { base }

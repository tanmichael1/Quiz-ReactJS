import firebase from "firebase";
import "@firebase/database";
import "firebase/auth";

/**
 * The firebase project configurations.
 */
const firebaseConfig = {
  apiKey: "AIzaSyDrqUQ0KSgSr45PQJFlbNIg74GKvJGRmM4",
  authDomain: "quiz---reactjs.firebaseapp.com",
  databaseURL: "https://quiz---reactjs-default-rtdb.firebaseio.com",
  projectId: "quiz---reactjs",
  storageBucket: "quiz---reactjs.appspot.com",
  messagingSenderId: "427668156485",
  appId: "1:427668156485:web:dcd0fa2fb3d29efa27732c",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Reference to storage service firebase
const storage = firebase.storage();

const database = firebase.database();

export { firebase };

export { storage };

export { database };

// passwordReset: (email) => {
//   return firebase.auth().sendPasswordResetEmail(email);
// };

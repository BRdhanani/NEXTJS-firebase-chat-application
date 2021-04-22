import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyDhB8jB3PT9RIj4-Aa2OuaIg8UErty2Cv0",
  authDomain: "nextjs-whatsapp-39012.firebaseapp.com",
  projectId: "nextjs-whatsapp-39012",
  storageBucket: "nextjs-whatsapp-39012.appspot.com",
  messagingSenderId: "18949507595",
  appId: "1:18949507595:web:30055869d181ede791150e",
};

const app = !firebase.apps.length
  ? firebase.initializeApp(firebaseConfig)
  : firebase.app();

const db = app.firestore();
const auth = app.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { db, auth, provider };

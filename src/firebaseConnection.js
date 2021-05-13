import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

let firebaseConfig = {
  apiKey: "AIzaSyDC-zv0C6ZdOv7-IrZOYWY_aZEclqSHnt0",
  authDomain: "curso-48ae2.firebaseapp.com",
  projectId: "curso-48ae2",
  storageBucket: "curso-48ae2.appspot.com",
  messagingSenderId: "167810712877",
  appId: "1:167810712877:web:15bd89dbed6f8666faffa4",
  measurementId: "G-EVD8VT569W",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase;

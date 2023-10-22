// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBReh1IxmWszeZqkEk5hWEXOAekRQ_-GIk",
  authDomain: "ridesharing-402714.firebaseapp.com",
  projectId: "ridesharing-402714",
  storageBucket: "ridesharing-402714.appspot.com",
  messagingSenderId: "537476984557",
  appId: "1:537476984557:web:ec08187b3510b8960a26e4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


export {
  // Your web app's Firebase configuration
  firebase
};


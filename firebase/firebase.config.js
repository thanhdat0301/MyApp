// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB6hEldraaLFJV8VPRswRp7Yrqd6k-I_MU",
  authDomain: "crudapp-10a69.firebaseapp.com",
  projectId: "crudapp-10a69",
  storageBucket: "crudapp-10a69.appspot.com",
  messagingSenderId: "690761773242",
  appId: "1:690761773242:web:4ccbccf956fc21393dd283",
  measurementId: "G-GTLTMDCVDX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default getFirestore(app);

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB5h33rEBLnzqPvcvERDwCMVyYDxTrl05I",
  authDomain: "ethio-tic-tac-toe.firebaseapp.com",
  databaseURL: "https://ethio-tic-tac-toe-default-rtdb.firebaseio.com",
  projectId: "ethio-tic-tac-toe",
  storageBucket: "ethio-tic-tac-toe.appspot.com",
  messagingSenderId: "757676580294",
  appId: "1:757676580294:web:a89c8627cf74a8a363a6c7",
  measurementId: "G-M9Q0NEGQCZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
 export const db = getFirestore(app);

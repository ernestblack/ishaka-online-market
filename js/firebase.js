// ======================================
// FIREBASE IMPORTS
// ======================================

import { initializeApp }
from "https://www.gstatic.com/firebasejs/12.12.1/firebase-app.js";

import { getAuth }
from "https://www.gstatic.com/firebasejs/12.12.1/firebase-auth.js";

import { getFirestore }
from "https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore.js";


// ======================================
// FIREBASE CONFIG
// ======================================

const firebaseConfig = {

  apiKey:
    "AIzaSyDwXqKp1GCQWDjAPFbnBh98oAO2CFK-8Z4",

  authDomain:
    "ishaka-online-market.firebaseapp.com",

  projectId:
    "ishaka-online-market",

  storageBucket:
    "ishaka-online-market.firebasestorage.app",

  messagingSenderId:
    "321983844462",

  appId:
    "1:321983844462:web:6ab54206af658606ab567f"

};


// ======================================
// INITIALIZE
// ======================================

const app =
  initializeApp(firebaseConfig);

const auth =
  getAuth(app);

const db =
  getFirestore(app);


// ======================================
// EXPORTS
// ======================================

export { auth, db };
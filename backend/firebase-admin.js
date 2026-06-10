const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

const serviceAccount = require("./ishaka-online-market-firebase-adminsdk-fbsvc-986c704df8.json");

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

module.exports = {
  db
};


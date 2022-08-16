const firebase=require('firebase/app')

//adding firebase sdk snippets
const firebaseConfig = {
  apiKey: "AIzaSyDVlZTg2wX60Dln4N123bjQCSho-I_DuNU",
  authDomain: "filesharingauth.firebaseapp.com",
  projectId: "filesharingauth",
  storageBucket: "filesharingauth.appspot.com",
  messagingSenderId: "386241019134",
  appId: "1:386241019134:web:83feff5acf1ebf48b179af",
  measurementId: "G-3FK09SE0X2"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
module.exports=firebase
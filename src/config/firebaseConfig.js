const firebase=require('firebase/app')


//adding firebase sdk snippets
const firebaseConfig = {
    apiKey: "AIzaSyAu2bW-GdUpSr3d28ZQiV6g2fPvNUwgNkc",
    authDomain: "file-sharing-auth.firebaseapp.com",
    projectId: "file-sharing-auth",
    storageBucket: "file-sharing-auth.appspot.com",
    messagingSenderId: "913937564233",
    appId: "1:913937564233:web:a792e79a1dc0c1144eb598"
  };
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  module.exports=firebase
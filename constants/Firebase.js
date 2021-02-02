import firebase from 'firebase'

const firebaseConfig = {
    apiKey: "AIzaSyC7znE8jcfDHdn7PbY5M4fJuxClr4zRoTE",
    authDomain: "bigboss-3916b.firebaseapp.com",
    databaseURL: "https://bigboss-3916b-default-rtdb.firebaseio.com/",
    projectId: "bigboss-3916b",
    storageBucket: "bigboss-3916b.appspot.com",
    messagingSenderId: "280170569745",
    appId: "1:280170569745:web:eb01dd31e54752a1c851b0"   
}

// Initialize Firebase
let Firebase = firebase.initializeApp(firebaseConfig)


export default Firebase


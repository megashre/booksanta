import firebase from 'firebase';
require('@firebase/firestore')

const firebaseConfig = {
	apiKey: "AIzaSyCARKhx_VbpbHQYWLCbtixBbF4pUq1j31E",
	authDomain: "booksanta-8a7cc.firebaseapp.com",
	projectId: "booksanta-8a7cc",
	storageBucket: "booksanta-8a7cc.appspot.com",
	messagingSenderId: "720839164528",
	appId: "1:720839164528:web:517c9d512a3440d382eab5"
  };


// Initialize Firebase
firebase.initializeApp(firebaseConfig);

 export default firebase.firestore();

import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/firestore'
import 'firebase/compat/storage'

const firebaseConfig = {
    apiKey: "AIzaSyBC7neWtx1qSCbOT1oVe6EGk2bUzIuErX4",
    authDomain: "landport-3bc55.firebaseapp.com",
    projectId: "landport-3bc55",
    storageBucket: "landport-3bc55.appspot.com",
    messagingSenderId: "1043809981614",
    appId: "1:1043809981614:web:3ee5d2b42af35986d5c93f",
    measurementId: "G-622Q98LB17"
}

if (!firebase.apps.length){
    firebase.initializeApp(firebaseConfig)
}
const LOCAL_BACKEND_URL = "http://192.168.43.75:3000"
const LIVE_BACKEND_URL = "https://landport-backend.onrender.com"
const configs = {
    firebase: firebase,
    backendUrl: LIVE_BACKEND_URL
}
export default configs
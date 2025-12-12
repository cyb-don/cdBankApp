// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import {
    collection,
    getFirestore,
    getDocs,
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAtVgwPus-YVW80vzD8tHqM8Z7c2dlTloI",
    authDomain: "mock-cdbankapp.firebaseapp.com",
    projectId: "mock-cdbankapp",
    storageBucket: "mock-cdbankapp.firebasestorage.app",
    messagingSenderId: "960515740512",
    appId: "1:960515740512:web:e8a51bb59d262cd22a0405"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const fireStore = getFirestore(app);

const urlParams = new URLSearchParams(window.location.search);
const userLink = urlParams.get("u");


const userCredentials = await getDocs(collection(fireStore, "users"));
userCredentials.forEach((doc) => {
    const user = doc.data();
    if (user.uid === userLink) {
        const greetName = user.firstName.slice(0,1).toUpperCase() + user.firstName.slice(1);
        document.getElementById("welcome").innerText = `Hello, ${greetName}!`;
        document.getElementById("availBalance").innerText = `# ${user.acctBalance}`;
    }

});
    

// document.getElementById(`selectTransferMethod`).addEventListener("input", async function () {
//     try {
//         if (selectTransferMethod.value === `email`) {
//             console.log(`yess`);
            
//             document.getElementById(`transfer`).style.display = "none";
//         }
//     } catch (error) {
        
//     }
// });
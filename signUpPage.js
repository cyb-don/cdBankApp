
const signUpBtn = document.getElementById("signUpBtn");


// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import {
    getAuth,
    createUserWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

import {
    collection,
    getFirestore,
    addDoc,
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
const auth = getAuth(app);
const fireStore = getFirestore(app);



document.getElementById("form").addEventListener("submit", async function (e) {
    e.preventDefault();
    signUpBtn.disabled = true;
    signUpBtn.innerText = "Signing Up...";


    const email = form.email.value;
    const password = form.password.value;
    const firstName = form.firstname.value;
    const lastName = form.lastname.value;
    const userName = form.username.value;
    

    try {
        const userCred = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );

        const uid = userCred.user.uid;
        const acctBalance = 150000;

        await addDoc(collection(fireStore, "users"), {
            uid,
            firstName,
            lastName,
            userName,
            email,
            acctBalance,
        });
        alert("Account created successfully!");
        window.location.href = `dashboard.html?u=${uid}`;
        





    } catch (error) {
        console.log(error);

    } finally {
        signUpBtn.disabled = false;
        signUpBtn.innerText = "Sign Up";
    }
});

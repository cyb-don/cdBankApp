import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";

import {
    getAuth,
    signInWithEmailAndPassword,
    onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

import {
    getFirestore,
    collection,
    getDocs,
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

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

const userCollection = collection(fireStore, "users");



const loginForm = document.getElementById(`loginForm`);
loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // errorMessage.innerText = "";

    loginBtn.disabled = true;
    loginBtn.innerText = "Logging in...";

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    try {
        const userCred = await signInWithEmailAndPassword(auth, email, password);
        const userUID = userCred.user.uid;
        const userDocs = await getDocs(userCollection);
        const users = userDocs.docs.map(doc => ({
            ...doc.data()
        })
        );
        const currentUser = users.find(user => user.uid === userUID);
        if (currentUser) {
            window.location.href = `./dashboard.html?u=${currentUser.userDocId}`;
            alert("Login successful");
        }
    } catch (error) {
        console.error("Error logging in:", error);
        // errorMessage.innerText = error.message;
        alert("Login failed");
    } finally {
        loginBtn.disabled = false;
        loginBtn.innerText = "Login";
    }
});
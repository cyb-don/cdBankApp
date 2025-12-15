
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
    updateDoc,
    arrayUnion,
    doc,
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


    const email = form.email.value.toLowerCase();
    const password = form.password.value;
    let firstName = form.firstname.value;
    let lastName = form.lastname.value;
    const userName = form.username.value;


    try {
        const userCred = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );

        const uid = userCred.user.uid;
        const acctBalance = 150000;


        firstName = firstName.slice(0,1).toUpperCase() + firstName.slice(1).toLowerCase();
        lastName = lastName.slice(0,1).toUpperCase() + lastName.slice(1).toLowerCase();
        const userInfo = await addDoc(collection(fireStore, "users"), {
            uid,
            firstName,
            lastName,
            userName,
            email,
            acctBalance,
            "transactions": [],
            "userDocId": "",
        });
        alert("Account created successfully!");
        const userID = userInfo.id;
        console.log(userID);
        const userDoc = await doc(fireStore, "users", userID)
        let date = new Date()
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        const hour = date.getHours();
        const minute = date.getMinutes();
        date = `${day}-${month}-${year}  ${hour}:${minute}`;
        await updateDoc(userDoc, {
            userDocId: userID,
            transactions: arrayUnion({
                transactType: "Cr",
                transactAmt: `+₦150000`,
                transactFullName: "Opening Balance",
                transactDate: date,
                Description: "Opening Balance"
            })
        });
        window.location.href = `dashboard.html?u=${userID}`; 

    } catch (error) {
        console.log(error);

    } finally {
        signUpBtn.disabled = false;
        signUpBtn.innerText = "Sign Up";
    }
});

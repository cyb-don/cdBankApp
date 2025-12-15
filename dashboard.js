// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import {
    collection,
    getDocs,
    getFirestore,
    getDoc,
    addDoc,
    doc,
    updateDoc,
    arrayUnion,
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

import {
        getAuth,
        onAuthStateChanged,
        signOut,
      } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

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

// Auth
const auth = getAuth(app);

// Initialize Firestore
const fireStore = getFirestore(app);

const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get("u");


const userDoc = doc(fireStore, "users", userId);

async function getUser() {
    try {
        const getUserDoc = await getDoc(userDoc);
        userData(getUserDoc.data());

    } catch (error) {
        console.log(error);

    }

};
getUser()

function userData(user) {
    // const greetName = user.firstName.slice(0, 1).toUpperCase() + user.firstName.slice(1);
    document.getElementById("welcome").innerText = `Hello, ${user.firstName}!`;
    document.getElementById("availBalance").innerText = `₦${user.acctBalance}`;
    spreadTransactions(user.transactions)

};

function spreadTransactions(transactions) {
    transactions.forEach((transaction) => {
        document.querySelector(`.transactions`).innerHTML += `
        <div>
            <div><span class="drcr">${transaction.transactType}</span></div>
            <div>
                <p>${transaction.transactFullName}</p>
                <p>${transaction.transactDate}</p>
            </div>
            <div>
                <p>${transaction.transactAmt}</p>
                <p class="success">Successful</p>
            </div>
        </div>      
        `;
    })
};


let transferPanelOpen = false;

const transferSection = document.getElementById(`transferSection`);
const newTransfer = document.querySelector(`.newTransfer`);
newTransfer.addEventListener(`click`, function () {
    if (transferPanelOpen) {
        transferSection.style.display = `none`;
    } else {
        transferSection.style.display = `block`;
    };

    transferPanelOpen = !transferPanelOpen;
    
})


const selectTransferMethod = document.getElementById(`selectTransferMethod`);
selectTransferMethod.addEventListener(`input`, function () {
    try {
        if (selectTransferMethod.value == "email") {
            document.getElementById(`receiverIdType`).innerText = `Recipient Email`;
            document.getElementById(`recipientId`).disabled = false;
        }
        else if (selectTransferMethod.value == "uid") {
            document.getElementById(`receiverIdType`).innerText = `Recipient UID`;
            document.getElementById(`recipientId`).disabled = false;
        }
        else {
            document.getElementById(`receiverIdType`).innerText = ``;
            document.getElementById(`recipientId`).disabled = true;
        }
    } catch (error) {

    }
});

document.getElementById(`nextBtn`).addEventListener(`click`, async function () {
    const recipient = document.getElementById(`recipientId`);
    try {
        const userDocs = await getDocs(collection(fireStore, "users"));

        const users = userDocs.docs.map(doc => ({
            ...doc.data()
        }));

        const foundUser = users.find(user => user.email === recipient.value.toLowerCase() || user.uid === recipient.value);
        if (foundUser) {
            theFoundUser(foundUser);
            // transferToUser(foundUser);
            const confirmCustomer = confirm(`Transfer to ${foundUser.firstName}  ${foundUser.lastName}`);
            if (confirmCustomer) {
                document.getElementById(`recipientName`).innerText = `
                    Recipient: ${foundUser.firstName}  ${foundUser.lastName}
                 `;
                document.getElementById(`transferAmount`).disabled = false;
                document.getElementById(`transferRemark`).disabled = false;

            } else {
                document.getElementById(`recipientName`).innerText = "";
                document.getElementById(`transferAmount`).disabled = true;
                document.getElementById(`transferRemark`).disabled = true;
            }
        } else {
            alert(`Customer not found!`);
            document.getElementById(`recipientName`).innerText = "";
            document.getElementById(`transferAmount`).disabled = true;
            document.getElementById(`transferRemark`).disabled = true;

        }

    } catch (error) {
        console.log(error);

    };

});


async function theFoundUser(foundUser) {
    const recipientId = document.getElementById(`recipientId`);
    recipientId.addEventListener(`input`, function () {
        if (recipientId.value.toLowerCase() !== foundUser.email || recipientId.value !== foundUser.uid) {
            document.getElementById(`recipientName`).innerText = "";
            document.getElementById(`transferAmount`).disabled = true;
            document.getElementById(`transferRemark`).disabled = true;
        }
        return;
    });











    const recipientDoc = doc(fireStore, "users", foundUser.userDocId);
    const getSenderDoc = await getDoc(userDoc);
    const senderDoc = getSenderDoc.data();

    const transferAmount = document.getElementById(`transferAmount`);
    const transferRemark = document.getElementById(`transferRemark`);

    document.getElementById(`transferBtn`).addEventListener("click", async function () {
        const makeTransfer = confirm(`Make a transfer of ₦${transferAmount.value} to ${foundUser.firstName}  ${foundUser.lastName}`);
        if (makeTransfer) {
            alert(`Transfer Successful!!`);
            let date = new Date()
            const day = date.getDate();
            const month = date.getMonth() + 1;
            const year = date.getFullYear();
            const hour = date.getHours();
            const minute = date.getMinutes();
            date = `${day}-${month}-${year}  ${hour}:${minute}`;

            await updateDoc(recipientDoc, {
                acctBalance: Number(foundUser.acctBalance) + Number(transferAmount.value),
                transactions: arrayUnion({
                    transactType: "Cr",
                    transactAmt: `+₦${transferAmount.value}`,
                    transactFullName: `From ${senderDoc.firstName}  ${senderDoc.lastName}`,
                    transactDate: date,
                    Description: transferRemark.value,
                })
            });

            await updateDoc(userDoc, {
                acctBalance: Number(senderDoc.acctBalance) - Number(transferAmount.value),
                transactions: arrayUnion({
                    transactType: "Dr",
                    transactAmt: `-₦${transferAmount.value}`,
                    transactFullName: `To ${foundUser.firstName}  ${foundUser.lastName}`,
                    transactDate: date,
                    Description: transferRemark.value,
                })
            });

            
            const transferSection = document.getElementById(`transferSection`);
            transferSection.style.display = `none`;
            window.location.reload();
        }
    });

};


 onAuthStateChanged(auth, (user) => {
        if (user) {
          // User is signed in, see docs for a list of available properties
          // https://firebase.google.com/docs/reference/js/auth.user
          // ...
        } else {
          // User is signed out
          window.location.href = "./index.html";
        }
      });



document.getElementById(`logoutBtn`).addEventListener("click", async () => {
        const confirmLogout = confirm("Are you sure you want to logout?");
        if (!confirmLogout) return;
        try {
          await signOut(auth);
          alert("Logged out successfully");
          window.location.href = "./index.html";
        } catch (error) {
          console.log("Error logging out:", error);
        }
      });
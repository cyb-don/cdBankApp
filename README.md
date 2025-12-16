# 🏦 Mock Banking Web App

A mock banking web application built with **Vanilla JavaScript** and **Firebase** that simulates basic banking operations such as account creation, balance management, and money transfers between users.

---

## 🚀 Features

- 🔐 **User Authentication**
  - Email & Password signup/login using Firebase Authentication
  - Secure session handling

- 💰 **Initial Account Balance**
  - Every new user starts with **₦150,000** virtual balance

- 🔁 **Money Transfer**
  - Users can transfer funds to other users using **email address**
  - Sender balance decreases, receiver balance increases
  - Prevents invalid transfers (insufficient balance, non-existing users)

- 📊 **Transaction History**
  - Each transaction is recorded in Firestore
  - Displayed as a transaction history list on the dashboard
  - Stored as an array updated on every transaction

- 🔥 **Firestore Integration**
  - Real-time data updates
  - Secure user-specific data access
  - Balance and transaction records synced to database

---

## 🛠️ Technologies Used

- **HTML**
- **CSS**
- **JavaScript (Vanilla)**
- **Firebase Authentication**
- **Firebase Firestore**
- **Firebase Security Rules**

---

## 🧠 How It Works

1. User signs up → Firebase Auth creates a unique `uid`
2. A Firestore user document is created using the `uid` as document ID
3. User receives an initial balance of **₦150,000**
4. Transfers are performed by searching users via email
5. Firestore updates:
   - Sender balance
   - Receiver balance
   - Transaction history arrays
6. Dashboard reflects changes instantly

---

## 🔐 Security

- Firestore rules ensure:
  - Users can only read/write their own data
  - Authentication is required for all transactions

---

## ⚠️ Disclaimer

This is a **mock banking application** built for learning and demonstration purposes only.  
No real money transactions are involved.

---

## 📌 Future Improvements

- Role-based access (admin/user)
- Better UI/UX
- Server-side validation using Cloud Functions


---

## 🧑‍💻 Author

Built by **cybDon**  

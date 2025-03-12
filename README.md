# 💰 Budget Tracker

A simple and intuitive budget tracking app built with **React**, **Firebase**, and **Chart.js**. This app allows users to manage their **income, expenses, and one-time transactions**, providing visual insights through interactive charts. 

## ✨ Features
- 🔐 **User Authentication** (Firebase Auth)
- 📊 **Dashboard with Income & Expense Analytics**
- 🔄 **Recurring Income & Expenses**
- 📌 **One-Time Transactions**
- 📉 **Pie Charts for Financial Insights**
- 📁 **Firestore Database for Data Storage**

## 🚀 Tech Stack
- **Frontend:** React, React Router, Chart.js
- **Backend:** Firebase Authentication, Firestore Database

## 🛠️ Setup & Installation
1. **Clone the repository**  
   ```sh
   git clone https://github.com/yourusername/budget-tracker.git
   cd budget-tracker
   ```

2. **Install dependencies**  
   ```sh
   npm install
   ```

3. **Set up Firebase**  
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/).
   - Enable **Authentication** (Email/Password).
   - Set up **Firestore Database**.
   - Get your **Firebase config** and create a file:  
     ```
     src/Firebase/FirebaseConfig.js
     ```
   - Paste the following **template** (replace with your actual keys):
     ```js
     import { initializeApp } from "firebase/app";
     import { getAuth } from "firebase/auth";
     import { getFirestore } from "firebase/firestore";  

     const firebaseConfig = {
       apiKey: "YOUR_API_KEY",
       authDomain: "YOUR_AUTH_DOMAIN",
       projectId: "YOUR_PROJECT_ID",
       storageBucket: "YOUR_STORAGE_BUCKET",
       messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
       appId: "YOUR_APP_ID",
     };

     const app = initializeApp(firebaseConfig);
     const auth = getAuth(app);
     const db = getFirestore(app);

     export { auth, db };
     ```

4. **Run the app**  
   ```sh
   npm run dev
   ```

## 📜 License
This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for more details.

---

🚀 **Happy Budgeting!** 💸
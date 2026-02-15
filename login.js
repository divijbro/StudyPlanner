import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword } 
from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDVxj-EXFB_RSIjwCGTEyBYu1fW60oMLFM",
  authDomain: "ai-study-planner-2636c.firebaseapp.com",
  projectId: "ai-study-planner-2636c",
  storageBucket: "ai-study-planner-2636c.firebasestorage.app",
  messagingSenderId: "184148607245",
  appId: "1:184148607245:web:b6c686256d2f8e8c473044",
  measurementId: "G-77PWJZ0PYP"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const btn = document.getElementById("btn");

btn.addEventListener("click", async function (e){
    e.preventDefault();
    console.log("Button pressed");
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      alert("Login was successful!");
     window.location.replace("main.html");
    
    } catch (error) {
      console.error("Error:", error);
    }
    
})
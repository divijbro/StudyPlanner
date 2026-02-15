import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword } 
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
const db = getFirestore(app);
const auth = getAuth(app);


export { db }

const btn = document.getElementById("signup");

btn.addEventListener("click", async function (e) {
  e.preventDefault();

  const fn = document.getElementById("fn").value;
  const ln = document.getElementById("ln").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirm = document.getElementById("cpassword").value;

  if (password !== confirm) {
    alert("Passwords do not match!");
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await setDoc(doc(db, "students", user.uid), {
      email: user.email,
      firstName: fn,
      lastName: ln,
      syllabusDone: [],
      syllabusToDo: [],
      timeStudied: 0,
      totalTargetTime: 0,
      createdAt: new Date()
    });

    alert("Sign up was successful");
    window.location.replace("homepage.html");

  } catch (error) {
    alert(error.message);
    console.error("Error:", error);
  }
});



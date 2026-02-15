import { initializeApp }
from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";

import { getFirestore, doc, updateDoc }
from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import { getAuth, onAuthStateChanged }
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

let currentUser = null;

onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUser = user;
    } else {
        window.location.replace("signup.html");
    }
});

const btn = document.getElementById("btn");

btn.addEventListener("click", async function (e) {
    e.preventDefault();

    const tt = Number(document.getElementById("targetTime").value);
    const subject = document.getElementById("subject").value;

    const chapters = {
        [document.getElementById("s1").value]: { studied: 0, target: tt },
        [document.getElementById("s2").value]: { studied: 0, target: tt },
        [document.getElementById("s3").value]: { studied: 0, target: tt },
        [document.getElementById("s4").value]: { studied: 0, target: tt },
        [document.getElementById("s5").value]: { studied: 0, target: tt },
        [document.getElementById("s6").value]: { studied: 0, target: tt }
    };

    const docRef = doc(db, "students", currentUser.uid);

    await updateDoc(docRef, {
        subject: subject,
        chapters: chapters
    });

    console.log("Chapters saved properly");
    window.location.replace("main.html");
});

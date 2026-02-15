import { initializeApp }
from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";

import { getAuth,
         onAuthStateChanged,
         EmailAuthProvider,
         reauthenticateWithCredential,
         deleteUser }
from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import { getFirestore, doc, deleteDoc }
from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

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
const db = getFirestore(app);

onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.replace("login.html");
    }
});

const deleteBtn = document.getElementById("deleteBtn1");
const cancelBtn = document.getElementById("cancelBtn1");

if (cancelBtn) {
    cancelBtn.addEventListener("click", () => {
        window.location.replace("main.html");
    });
}

if (deleteBtn) {
    deleteBtn.addEventListener("click", async () => {

        const user = auth.currentUser;

        if (!user) {
            alert("Session expired. Please login again.");
            window.location.replace("login.html");
            return;
        }

        const password = document.getElementById("confirmPassword").value;

        if (!password) {
            alert("Please enter your password to confirm.");
            return;
        }

        try {

            const credential = EmailAuthProvider.credential(
                user.email,
                password
            );

            await reauthenticateWithCredential(user, credential);

            await deleteDoc(doc(db, "students", user.uid));

            await deleteUser(user);

            alert("Account permanently deleted.");

            window.location.replace("signup.html");

        } catch (error) {
            console.error(error);
            alert("Wrong password or session expired. Please try again.");
        }
    });
}

import { initializeApp }
from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";

import { getFirestore, doc, getDoc, updateDoc, increment }
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
let seconds = 0;
let interval = null;
let chaptersData = {};

const display = document.getElementById("display");
const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const chapterSelect = document.getElementById("chapterSelect");
const progressInfo = document.getElementById("progressInfo");
const welcomeText = document.getElementById("welcomeText");
const deleteBtn = document.getElementById("deleteAccount");

onAuthStateChanged(auth, async (user) => {
    if (!user) {
        window.location.replace("login.html");
        return;
    }

    currentUser = user;

    const docRef = doc(db, "students", user.uid);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) return;

    const data = docSnap.data();

    console.log("Full data:", data);
console.log("Chapters field:", data.chapters);


    chaptersData = data.chapters || {};

    if (data.firstName && welcomeText) {
        welcomeText.textContent = `Welcome, ${data.firstName} 👋`;
    }

    populateDropdown();
});

function populateDropdown() {
    if (!chapterSelect) return;

    chapterSelect.innerHTML = "";

    const chapterNames = Object.keys(chaptersData);

    if (chapterNames.length === 0) {
        progressInfo.textContent = "No chapters added.";
        return;
    }

    chapterNames.forEach((chapterName) => {
        const option = document.createElement("option");
        option.value = chapterName;
        option.textContent = chapterName;
        chapterSelect.appendChild(option);
    });

    updateProgress(chapterNames[0]);
}

function updateDisplay() {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    display.textContent =
        String(hrs).padStart(2, "0") + ":" +
        String(mins).padStart(2, "0") + ":" +
        String(secs).padStart(2, "0");
}

if (startBtn) {
    startBtn.addEventListener("click", () => {
        if (!interval) {
            interval = setInterval(() => {
                seconds++;
                updateDisplay();
            }, 1000);
        }
    });
}

if (stopBtn) {
    stopBtn.addEventListener("click", async () => {
        clearInterval(interval);
        interval = null;

        const minutes = Math.floor(seconds / 60);

        if (minutes > 0) {
            await saveStudyTime(minutes);
        }

        seconds = 0;
        updateDisplay();
    });
}

async function saveStudyTime(minutes) {
    const selectedChapter = chapterSelect.value;
    if (!selectedChapter) return;

    const docRef = doc(db, "students", currentUser.uid);

    await updateDoc(docRef, {
        [`chapters.${selectedChapter}.studied`]: increment(minutes)
    });

    chaptersData[selectedChapter].studied += minutes;

    updateProgress(selectedChapter);
}

function updateProgress(chapterName) {
    const chapter = chaptersData[chapterName];
    if (!chapter) return;

    const percent = Math.floor(
        (chapter.studied / chapter.target) * 100
    );

    progressInfo.innerHTML =
        `Studied: ${chapter.studied} / ${chapter.target} minutes (${percent}% complete)`;
}

if (chapterSelect) {
    chapterSelect.addEventListener("change", () => {
        updateProgress(chapterSelect.value);
    });
}

if (deleteBtn) {
    deleteBtn.addEventListener("click", () => {
        window.location.replace("delete-account.html");
    });
}

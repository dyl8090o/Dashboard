import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBPN115DDQYW8Sf6Cf5utDrvmO1yz7NcxA",
    authDomain: "dashboard-4439b.firebaseapp.com",
    projectId: "dashboard-4439b",
    storageBucket: "dashboard-4439b.firebasestorage.app",
    messagingSenderId: "290756589614",
    appId: "1:290756589614:web:96bd07f19949366a8907bf"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function loadReminders() {
    let list = document.getElementById("activeReminders");
    list.innerHTML = "";
    const querySnapshot = await getDocs(collection(db, "reminders"));
    querySnapshot.forEach((document) => {
        displayReminder(document.id, document.data().text);
    });
}

function displayReminder(id, text) {
    let list = document.getElementById("activeReminders");
    let item = document.createElement("li");
    item.style.listStyleType = "none";

    let deleteButton = document.createElement("button");
    deleteButton.textContent = "X";
    deleteButton.onclick = async function() {
        await deleteDoc(doc(db, "reminders", id));
        list.removeChild(item);
    };

    let reminderText = document.createElement("span");
    reminderText.textContent = text;

    item.appendChild(deleteButton);
    item.appendChild(reminderText);
    list.appendChild(item);
}

async function addReminder() {
    let input = document.getElementById("reminderInput");
    let text = input.value;

    if (text === "") {
        alert("Please enter a reminder!");
        return;
    }

    const docRef = await addDoc(collection(db, "reminders"), { text: text });
    displayReminder(docRef.id, text);
    input.value = "";
}

document.getElementById("createButton").onclick = addReminder;

loadReminders();
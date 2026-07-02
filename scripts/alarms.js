import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, updateDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

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

let alarmListener = null;

function checkEmpty() {
    let list = document.getElementById("activeAlarms");
    if (list.children.length === 0) {
        let emptyMessage = document.createElement("p");
        emptyMessage.textContent = "No active alarms yet.";
        list.appendChild(emptyMessage);
    }
}

function loadAlarms() {
    if (alarmListener) alarmListener();
    let list = document.getElementById("activeAlarms");
    alarmListener = onSnapshot(collection(db, "alarms"), (querySnapshot) => {

    let alarms = [];
    querySnapshot.forEach((document) => {
        alarms.push({ id: document.id, ...document.data() });
    });

    alarms.sort((a, b) => a.position - b.position);

    alarms.forEach((alarm) => {
        let existing = list.querySelector(`li[data-id="${alarm.id}"]`);
        if (existing) {
            let span = existing.querySelector("span");
        } else {
            displayAlarm(alarm.id, alarm.label, alarm.time, alarm.sinceMidnight);
        }
    });

    list.querySelectorAll("li").forEach((item) => {
        let exists = alarms.find(r => r.id === item.dataset.id);
        if (!exists) {
            item.remove();
        }
    });
    checkEmpty();
});
}

function displayAlarm(id, label, time, sinceMidnight) {
    let list = document.getElementById("activeAlarms");
    let item = document.createElement("li");
    item.dataset.id = id;
    item.style.listStyleType = "none";

    let deleteButton = document.createElement("button");
    deleteButton.textContent = "X";
    deleteButton.onclick = async function() {
        await deleteDoc(doc(db, "alarms", id));
        list.removeChild(item);
        await updatePositions ();
        checkEmpty();
    };

    let reminderLabel = document.createElement("span");
    reminderLabel.textContent = time + " | " + label;


    item.appendChild(deleteButton);
    item.appendChild(reminderLabel);
    list.appendChild(item);
}


async function addAlarm() {
    let input = document.getElementById("alarmInput");
    let label = input.value;
    let hour = document.getElementById("alarmHourInput").value;
    let minute = document.getElementById("alarmMinuteInput").value;
    let ampm = document.getElementById("alarmAMPMButton").textContent;

    let sinceMidnight = 0;
    if (ampm === "PM" && hour !== "12") {
        sinceMidnight = (((parseInt(hour) + 12) * 60) + parseInt(minute));
    } else if (ampm === "AM" && hour !== "12") {
        sinceMidnight = ((parseInt(hour) * 60) + parseInt(minute));
    } else if (ampm === "AM" && hour === "12") {
        sinceMidnight = parseInt(minute);
    }


    if (document.getElementById("alarmMinuteInput").value.length === 1) {
        minute = "0" + minute;
    }

    if (label === ""){
        alert("Please enter an alarm!");
        return;
    }

    if (hour === "" || minute === "") {
        alert("Please enter a time for the alarm!");
        return;
    }

    const querySnapshot = await getDocs(collection(db, "alarms"));
    let position = querySnapshot.size;

    const docRef = await addDoc(collection(db, "alarms"), {
        label: label,
        time: hour + ":" + minute + " " + ampm,
        sinceMidnight: sinceMidnight,
        position: position
    });

    let emptyMessage = document.querySelector("#activeAlarms p");
    input.value = "";
    document.getElementById("alarmHourInput").value = "";
    document.getElementById("alarmMinuteInput").value = "";
    document.getElementById("alarmAMPMButton").textContent = "AM";
}


document.getElementById("alarmHourInput").addEventListener("input", function() {
    if (this.value > 12) this.value = 12;
    if (this.value < 1) this.value = 1;
});
document.getElementById("alarmMinuteInput").addEventListener("input", function() {
    if (this.value > 59) this.value = 59;
    if (this.value < 0) this.value = 0;
});


document.addEventListener("DOMContentLoaded", () => {
    if(document.visibilityState === "visible") {
        loadAlarms();
    }

    document.getElementById("alarmAMPMButton").onclick = function() {
        let button = document.getElementById("alarmAMPMButton");
        if (button.textContent === "AM") {
            button.textContent = "PM";
        } else {
            button.textContent = "AM";
        }
    }
});

document.getElementById("alarmCreateButton").onclick = addAlarm;
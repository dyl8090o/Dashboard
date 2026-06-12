import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

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

let selectedPriority = "none";

    function checkEmpty(){
        let list = document.getElementById("activeReminders");
        if(list.children.length === 0){
            console.log("No active reminders.");
            let emptyMessage = document.createElement("p");
            emptyMessage.textContent = "No active reminders yet.";
            list.appendChild(emptyMessage);
        }
    }

async function loadReminders() {
    let list = document.getElementById("activeReminders");
    list.innerHTML = "";
    const querySnapshot = await getDocs(collection(db, "reminders"));

    let reminders = [];
    querySnapshot.forEach((document) => {
        reminders.push({ id: document.id, ...document.data() });
    });

    reminders.sort((a, b) => a.position - b.position);

    reminders.forEach((reminder) => {
        displayReminder(reminder.id, reminder.text, reminder.priority);
    });
    checkEmpty();
}

async function updatePositions() {
    let items = document.querySelectorAll("#activeReminders li");
    let updates = [];
    items.forEach((item, index) => {
        let id = item.dataset.id;
        updates.push((updateDoc(doc(db, "reminders", id), { position: index })));
    });
    await Promise.all(updates);
}

async function updatePriority(id, newPriority) {
    await updateDoc(doc(db, "reminders", id), { priority: newPriority });
    let item = document.querySelector(`#activeReminders li[data-id="${id}"] span`);
    item.className = newPriority + "Priority";
    await Promise.all(updates);
}

function displayReminder(id, text, priority) {
    let list = document.getElementById("activeReminders");
    let item = document.createElement("li");
    item.dataset.id = id;
    item.style.listStyleType = "none";

    let deleteButton = document.createElement("button");
    deleteButton.textContent = "X";
    deleteButton.onclick = async function() {
        await deleteDoc(doc(db, "reminders", id));
        list.removeChild(item);
        await updatePositions();
        checkEmpty();
    };

    let reminderText = document.createElement("span");
    reminderText.textContent = text;
    reminderText.classList.add(priority + "Priority");

    let changeToLow = document.createElement("button");
    changeToLow.id = "lowPriorityChange";
    changeToLow.onclick = async function() {
        await updatePriority(id, "low");
    };
    let changeToMedium = document.createElement("button");
    changeToMedium.id = "mediumPriorityChange";
    changeToMedium.onclick = async function() {
        await updatePriority(id, "medium");
    };
    let changeToHigh = document.createElement("button");
    changeToHigh.id = "highPriorityChange";
    changeToHigh.onclick = async function() {
        await updatePriority(id, "high");
    };

    item.appendChild(deleteButton);
    item.appendChild(reminderText);
    item.appendChild(changeToLow);
    item.appendChild(changeToMedium);
    item.appendChild(changeToHigh);
    list.appendChild(item);

    changeToLow.classList.add("hidden");
    changeToMedium.classList.add("hidden");
    changeToHigh.classList.add("hidden");
    item.onclick = function() {
        togglePriorityButtons(id);
    }
}

async function togglePriorityButtons(id) {
    let item = document.querySelector(`#activeReminders li[data-id="${id}"]`);
    let buttons = item.querySelectorAll("button:not(:first-child)");
    buttons.forEach(button => button.classList.toggle("hidden"));
}   

async function addReminder() {
    let input = document.getElementById("reminderInput");
    let text = input.value;

    if (text === "") {
        alert("Please enter a reminder!");
        return;
    }
    if (selectedPriority === "none") {
        alert("Please select a priority!");
        return;
    }

    const querySnapshot = await getDocs(collection(db, "reminders"));
    let position = querySnapshot.size;

    const docRef = await addDoc(collection(db, "reminders"), { 
        text: text,
        priority: selectedPriority,
        position: position
    });

    displayReminder(docRef.id, text, selectedPriority);
    selectedPriority = "none";
    setPriority("none");


    let emptyMessage = document.querySelector("#activeReminders p");
    if (emptyMessage) {
        emptyMessage.remove();
    }
    input.value = "";
}

    
    document.getElementById("lowPriorityRemind").onclick = function(){
        if(selectedPriority !== "low"){
            setPriority("low");
        } else {
            setPriority("none");
        }
    };

    document.getElementById("mediumPriorityRemind").onclick = function(){
        if(selectedPriority !== "medium"){
            setPriority("medium");
        } else {
            setPriority("none");
        }
    };

    document.getElementById("highPriorityRemind").onclick = function(){
        if(selectedPriority !== "high"){
            setPriority("high");
        } else {
            setPriority("none");
        }
    }


    function setPriority(priority) {
        selectedPriority = priority;
        console.log("Selected priority: " + selectedPriority);

        document.getElementById("lowPriorityRemind").classList.remove("selected");
        document.getElementById("mediumPriorityRemind").classList.remove("selected");
        document.getElementById("highPriorityRemind").classList.remove("selected");

        document.getElementById(priority + "PriorityRemind").classList.add("selected");
    }

document.addEventListener("DOMContentLoaded", function() {
    Sortable.create(document.getElementById("activeReminders"), {
        animation: 150,
        onEnd: async function() {
            await updatePositions();
}});});

document.getElementById("createButton").onclick = addReminder;

loadReminders();
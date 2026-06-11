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
    querySnapshot.forEach((document) => {
        displayReminder(document.id, document.data().text, document.data().priority);
    });
    checkEmpty();
}

function displayReminder(id, text, priority) {
    let list = document.getElementById("activeReminders");
    let item = document.createElement("li");
    item.style.listStyleType = "none";

    let deleteButton = document.createElement("button");
    deleteButton.textContent = "X";
    deleteButton.onclick = async function() {
        await deleteDoc(doc(db, "reminders", id));
        list.removeChild(item);
        checkEmpty();
    };

    let reminderText = document.createElement("span");
    reminderText.textContent = text;
    reminderText.classList.add(priority + "Priority");

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


    const docRef = await addDoc(collection(db, "reminders"), { 
        text: text,
        priority: selectedPriority
    });

    displayReminder(docRef.id, text, selectedPriority);

    let emptyMessage = document.querySelector("#activeReminders p");
    if (emptyMessage) {
        emptyMessage.remove();
    }
    input.value = "";
}

    
    document.getElementById("lowPriorityRemind").onclick = function(){
        setPriority("low");
    }

    document.getElementById("mediumPriorityRemind").onclick = function(){
    setPriority("medium");
    }

    document.getElementById("highPriorityRemind").onclick = function(){
        setPriority("high");
    }


    function setPriority(priority) {
        selectedPriority = priority;
        console.log("Selected priority: " + selectedPriority);

        document.getElementById("lowPriorityRemind").classList.remove("selected");
        document.getElementById("mediumPriorityRemind").classList.remove("selected");
        document.getElementById("highPriorityRemind").classList.remove("selected");

        document.getElementById(priority + "PriorityRemind").classList.add("selected");
    }

document.getElementById("createButton").onclick = addReminder;

loadReminders();
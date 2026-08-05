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

let countdownListener = null;

function checkEmpty(){
    console.log("Checking Empty Countdown");
    let list = document.getElementById("activeCountdowns");
    if(list.children.length === 0){
        console.log("No active countdowns.");
        let emptyMessage = document.createElement("p");
        emptyMessage.textContent = "No active countdowns yet.";
        list.appendChild(emptyMessage);
    }
}

function loadCountdowns() {

    if (countdownListener) countdownListener();
    let list = document.getElementById("activeCountdowns");
    onSnapshot(collection(db, "countdowns"), (querySnapshot) => {

        console.log("loading countdowns");
    let countdowns = [];
    querySnapshot.forEach((document) => {
        countdowns.push({ id: document.id, ...document.data() });
    });

    countdowns.sort((a, b) => a.position - b.position);

    countdowns.forEach((countdown) => {
        let existing = list.querySelector(`li[data-id="${countdown.id}"]`);
        if (existing) {
            let span = existing.querySelector("span");
        } else {
            displayCountdown(countdown.id, countdown.label, countdown.time, countdown.timestamp, countdown.timeMade);
        }
    });

    list.querySelectorAll("li").forEach((item) => {
        let exists = countdowns.find(c => c.id === item.dataset.id);
        if (!exists) {
            item.remove();
        }
    });
    checkEmpty();
    });
    
}

function displayCountdown(id, text, time, timestamp, timeMade) {
    let list = document.getElementById("activeCountdowns");
    let item = document.createElement("li");
    item.dataset.id = id;
    item.style.listStyleType = "none";

    let deleteButton = document.createElement("button");
    deleteButton.textContent = "X";
      let deleteable = 0;
    deleteButton.onclick = deleteItem;
    async function deleteItem() {
        if (deleteable === 1){
            await deleteDoc(doc(db, "countdowns", id))
            list.removeChild(item);
            await updatePositions();
            checkEmpty();
        }
    };
    deleteable = 1;

    let countdownLabel = document.createElement("span");
    countdownLabel.classList.add("countdownLabel")
    let countdownBar = document.createElement("span")
    countdownBar.classList.add("countdownBar")
    let countdownBack = document.createElement("span")
    countdownBack.classList.add("countdownBack")
    let countdownTopRow = document.createElement("span")
    countdownTopRow.classList.add("countdownTopRow")

    countdownTopRow.appendChild(deleteButton);
    countdownTopRow.appendChild(countdownLabel);
    item.appendChild(countdownTopRow);
    item.appendChild(countdownBack);
    countdownBack.appendChild(countdownBar);
    list.appendChild(item);

    let intervalID = setInterval(runUpdate, 1000);
    item.dataset.intervalID = intervalID;
    function runUpdate(){
        let expired = countdownUpdater(text, time, timestamp, countdownLabel, item, id, list, timeMade, countdownBar);
        if (expired){
            clearInterval(intervalID);
            deleteItem();
        }
    }
     runUpdate();
}

async function addCountdown() {
    let input = document.getElementById("countdownInput");
    let label = input.value;
    let month = document.getElementById("countdownMonthInput").value;
    let day = document.getElementById("countdownDayInput").value;
    let year = document.getElementById("countdownYearInput").value;
    let hour = document.getElementById("countdownHourInput").value;
    let minute = document.getElementById("countdownMinuteInput").value;
    let second = document.getElementById("countdownSecondInput").value;
    let ampm = document.getElementById("countdownAMPMButton").textContent
    
    if (second.length === 1){
        second = "0" + second;
    }

    let hour24 = 0;
    if (ampm === "PM" && hour !== "12") {
        hour24 = parseInt(hour) + 12
    } else if (ampm === "AM" && hour !== "12") {
        hour24 = parseInt(hour)
    } else if (ampm === "AM" && hour === "12") {
        hour24 = "00"
    } else{
        hour24 = parseInt(hour)
    }

    if (String(hour24).length === 1){
        hour24 = "0" + hour24;
    }

    if (document.getElementById("countdownMinuteInput").value.length === 1) {
        minute = "0" + minute;
    }

    let unixDay = 0
    if(String(day).length === 1){
        unixDay = "0" + day;
    } else{
        unixDay = String(day);
    }

    let unixMonth = 0
    if (String(month).length === 1){
        unixMonth = "0" + month
    } else{
        unixMonth = String(month);
    }


    if (label === ""){
        alert("Please enter a countdown!");
        return;
    }

    if (month === "" || day === "" || year === "" || hour === "" || minute === "" || second === "") {
        alert("Please enter a time for the countdown!");
        return;
    }

    const querySnapshot = await getDocs(collection(db, "countdowns"));
    let position = querySnapshot.size;
    console.log("20" + year + "-" + unixMonth + "-" + unixDay + "T" + hour24 + ":" + minute + ":" + second);
    let date = new Date("20" + year + "-" + unixMonth + "-" + unixDay + "T" + hour24 + ":" + minute + ":" + second);
    let timestamp = Math.floor((date.getTime())/1000);
    let timeMade = Math.floor(new Date().getTime()/1000)

    console.log(timestamp);
    const docRef = await addDoc(collection(db, "countdowns"), {
        label: label,
        time: month + "/" + day + "/" + year + " @ " + hour + ":" + minute + " " + ampm,
        timestamp: timestamp,
        timeMade: timeMade,
        position: position
    });

    checkEmpty();
    let emptyMessage = document.querySelector("#activeCountdowns p");
    input.value = "";
    document.getElementById("countdownMonthInput").value = "";
    document.getElementById("countdownDayInput").value = "";
    document.getElementById("countdownYearInput").value = "";
    document.getElementById("countdownHourInput").value = "";
    document.getElementById("countdownMinuteInput").value = "";
    document.getElementById("countdownSecondInput").value = "";
    document.getElementById("countdownAMPMButton").textContent = "AM";
}

function countdownUpdater(text, time, timestamp, label, item, id, list, timeMade, bar){
    let newTimestamp = Math.floor((new Date()) / 1000)
    let timeLeft = timestamp - newTimestamp;
    let timeLeftRatio = Math.abs(1-((newTimestamp - timeMade)/(timestamp - timeMade)));
    //console.log("Time left: " + timeLeftRatio);

    let timeYears = ""
    let timeMonths = ""
    let timeDays = ""
    let timeHours = ""
    let timeMinutes = ""
    let timeSeconds = ""
    if (timeLeft >= 31540000){

        timeYears = Math.floor(parseInt(timeLeft)/31540000);
        timeLeft = timeLeft - (timeYears*31540000);
        timeYears = timeYears + " Years";

        timeMonths = Math.floor(parseInt(timeLeft)/2628000);
        timeLeft = timeLeft - (timeMonths*2628000);
        timeMonths = timeMonths + " Months";

    } else if (timeLeft >= 2628000) {
        
        timeMonths = Math.floor(parseInt(timeLeft)/2628000);
        timeLeft = timeLeft - (timeMonths*2628000);
        timeMonths = timeMonths + " Months";

        timeDays = Math.floor(parseInt(timeLeft)/86400);
        timeLeft = timeLeft - (timeDays*86400);
        timeDays = timeDays + " Days";

    } else if (timeLeft >= 86400){

        timeDays = Math.floor(parseInt(timeLeft)/86400);
        timeLeft = timeLeft - (timeDays*86400);
        timeDays = timeDays + " Days";

        timeHours = Math.floor(parseInt(timeLeft)/3600);
        timeLeft = timeLeft - (timeHours*3600);
        timeHours = timeHours + " Hours";

    } else if (timeLeft >= 3600){

        timeHours = Math.floor(parseInt(timeLeft)/3600);
        timeLeft = timeLeft - (timeHours*3600);
        timeHours = timeHours + " Hours";

        timeMinutes = Math.floor(parseInt(timeLeft)/60);
        timeLeft = timeLeft - (timeMinutes*60);
        timeMinutes = timeMinutes + " Minutes";

    } else if (timeLeft >= 60){

        timeMinutes = Math.floor(parseInt(timeLeft)/60);
        timeLeft = timeLeft - (timeMinutes*60);
        timeMinutes = timeMinutes + " Minutes";

        timeSeconds = timeLeft + " Seconds";

    } else if (timeLeft > 0) {
        timeSeconds = timeLeft + " Seconds";
    } else if (timeLeft <= 0){
        return true;
    }
    
    timeLeft = timeYears + " " + timeMonths + " " + timeDays + " " + timeHours + " " + timeMinutes + " " + timeSeconds;

    bar.style.width = (timeLeftRatio*100) + "%";

    label.textContent = text + " | " + time +   " | " + timeLeft;
    return false;

    }



document.addEventListener("DOMContentLoaded", () => {

document.getElementById("countdownMonthInput").addEventListener("input", function() {
    if (this.value > 12) this.value = 12;
    if (this.value < 0) this.value = 0;
});
document.getElementById("countdownDayInput").addEventListener("input", function() {
    if (this.value > 31) this.value = 31;
    if (this.value < 0) this.value = 0;
});
document.getElementById("countdownYearInput").addEventListener("input", function() {
    if (this.value > 99) this.value = 99;
    if (this.value < 0) this.value = 0;
});
document.getElementById("countdownHourInput").addEventListener("input", function() {
    if (this.value > 12) this.value = 12;
    if (this.value < 0) this.value = 0;
});
document.getElementById("countdownMinuteInput").addEventListener("input", function() {
    if (this.value > 59) this.value = 59;
    if (this.value < 0) this.value = 0;
});
document.getElementById("countdownSecondInput").addEventListener("input", function() {
    if (this.value > 59) this.value = 59;
    if (this.value < 0) this.value = 0;
});

    if(document.visibilityState === "visible") {
        loadCountdowns();
    }

    document.getElementById("countdownAMPMButton").onclick = function() {
        let button = document.getElementById("countdownAMPMButton");
        if (button.textContent === "AM") {
            button.textContent = "PM";
        } else {
            button.textContent = "AM";
        }
    }

    document.getElementById("countdownCreateButton").onclick = addCountdown;
});

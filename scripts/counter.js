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
let number = 0
let activeCount = "count1";
let counterListener = null;



document.addEventListener("DOMContentLoaded", () => {

    counterListener = onSnapshot(doc(db, "counter", activeCount), (snapshot) => {
        if (snapshot.exists()) {
            number = snapshot.data().value;
            document.getElementById("counter1").classList.add("selected");
            document.getElementById("counterNumber").textContent = number;
        } else {
            console.log("No such document!");
            document.getElementById("counterNumber").textContent = "ERROR";
        }
})

    document.getElementById("counterIncreaseButton").addEventListener("click", async () => {

        number += 1;
        await updateDoc(doc(db, "counter", activeCount), { value: number });
    })

    document.getElementById("counterDecreaseButton").addEventListener("click", async () => {

        number -= 1;
        await updateDoc(doc(db, "counter", activeCount), { value: number });
    })

    document.getElementById("counterResetButton").addEventListener("click", async () => {

        number = 0;
        await updateDoc(doc(db, "counter", activeCount), { value: number });
    })

    document.getElementById("counter1").addEventListener("click", async () => {
        activeCount = "count1";

        document.getElementById("counter1").classList.add("selected");
        document.getElementById("counter2").classList.remove("selected");
        document.getElementById("counter3").classList.remove("selected");
        
        onSnapshot(doc(db, "counter", activeCount), (snapshot) => {
            if (snapshot.exists()) {
                number = snapshot.data().value;
                document.getElementById("counterNumber").textContent = number;
            } else {
                console.log("No such document!");
                document.getElementById("counterNumber").textContent = "ERROR";
            }
            
        });
    })

    document.getElementById("counter2").addEventListener("click", async () => {
        activeCount = "count2";

        document.getElementById("counter1").classList.remove("selected");
        document.getElementById("counter2").classList.add("selected");
        document.getElementById("counter3").classList.remove("selected");

        onSnapshot(doc(db, "counter", activeCount), (snapshot) => {
            if (snapshot.exists()) {
                number = snapshot.data().value;
                document.getElementById("counterNumber").textContent = number;
            } else {
                console.log("No such document!");
                document.getElementById("counterNumber").textContent = "ERROR";
            }
            
        });
    })

    document.getElementById("counter3").addEventListener("click", async () => {
        activeCount = "count3";

        document.getElementById("counter1").classList.remove("selected");
        document.getElementById("counter2").classList.remove("selected");
        document.getElementById("counter3").classList.add("selected");

        onSnapshot(doc(db, "counter", activeCount), (snapshot) => {
            if (snapshot.exists()) {
                number = snapshot.data().value;
                document.getElementById("counterNumber").textContent = number;
            } else {
                console.log("No such document!");
                document.getElementById("counterNumber").textContent = "ERROR";
            }
            
        });
    })

})
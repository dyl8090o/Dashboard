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

function convert() {
    let unitType = document.getElementById("unitTypeSelect").value;
    let inputValue = document.getElementById("unitInput").value;
    let unitFrom = document.getElementById("unitInputSelect").value;
    let unitTo = document.getElementById("unitOutputSelect").value;
    let result = null;
    console.log(`Converting ${inputValue} from ${unitFrom} to ${unitTo}`);

    if (unitFrom === unitTo) {
        result = inputValue;
    } else if (unitType === "length") {
        
        if (unitFrom === "inches"){
            result = inputValue;
        } else if (unitFrom === "feet"){
            result = inputValue * 12;
        } else if (unitFrom === "yards"){
            result = inputValue * 36;
        } else if (unitFrom === "miles"){
            result = inputValue * 63360;
        } else if (unitFrom === "millimeters"){
            result = inputValue * 0.0393701;
        } else if (unitFrom === "centimeters"){
            result = inputValue * 0.393701;
        } else if (unitFrom === "meters"){
            result = inputValue * 39.3701;
        } else if (unitFrom === "kilometers"){
            result = inputValue * 39370.1;
        } else if (unitFrom === "footballFields"){
            result = inputValue * 4320;
        } else if (unitFrom === "schoolBuses"){
            result = inputValue * 420;
        } else if (unitFrom === "Bananas"){
            result = inputValue * 7.5;
        }

        if (unitTo === "feet"){
            result = result / 12;
        } else if (unitTo === "yards"){
            result = result / 36;
        } else if (unitTo === "miles"){
            result = result / 63360;
        } else if (unitTo === "millimeters"){
            result = result / 0.0393701;
        } else if (unitTo === "centimeters"){
            result = result / 0.393701;
        } else if (unitTo === "meters"){
            result = result / 39.3701;
        } else if (unitTo === "kilometers"){
            result = result / 39370.1;
        } else if (unitTo === "footballFields"){
            result = result / 4320;
        } else if (unitTo === "schoolBuses"){
            result = result / 420;
        } else if (unitTo === "Bananas"){
            result = result / 7.5;
        }
    } else if (unitType === "weight") {
        
        if (unitFrom === "ounces"){
            result = inputValue;
        } else if (unitFrom === "pounds"){
            result = inputValue * 16;
        } else if (unitFrom === "tons"){
            result = inputValue * 32000;
        } else if (unitFrom === "millilgrams"){
            result = inputValue * .000035274;
        } else if (unitFrom === "grams"){
            result = inputValue * 0.035274;
        } else if (unitFrom === "kilograms"){
            result = inputValue * 35.274;
        } else if (unitFrom === "metricTons"){
            result = inputValue * 35274;
        }

        if (unitTo === "pounds"){
            result = result / 16;
        } else if (unitTo === "tons"){
            result = result / 32000;
        } else if (unitTo === "milligrams"){
            result = result / .000035274;
        } else if (unitTo === "grams"){
            result = result / 0.035274;
        } else if (unitTo === "kilograms"){
            result = result / 35.274;
        } else if (unitTo === "metricTons"){
            result = result / 35274;
        }

    } else if (unitType === "volume") {
        
        if (unitFrom === "teaspoons"){
            result = inputValue;
        } else if (unitFrom === "tablespoons"){
            result = inputValue * 3;
        } else if (unitFrom === "fluidOunces"){
            result = inputValue * 6;
        } else if (unitFrom === "cups"){
            result = inputValue * 48;
        } else if (unitFrom === "pints"){
            result = inputValue * 96;
        } else if (unitFrom === "quarts"){
            result = inputValue * 192;
        } else if (unitFrom === "gallons"){
            result = inputValue * 768;
        } else if (unitFrom === "milliliters"){
            result = inputValue * 0.202884;
        } else if (unitFrom === "liters"){
            result = inputValue * 202.884;
        }

        if (unitTo === "tablespoons"){
            result = result / 3;
        } else if (unitTo === "fluidOunces"){
            result = result / 6;
        } else if (unitTo === "cups"){
            result = result / 48;
        } else if (unitTo === "pints"){
            result = result / 96;
        } else if (unitTo === "quarts"){
            result = result / 192;
        } else if (unitTo === "gallons"){
            result = result / 768;
        } else if (unitTo === "milliliters"){
            result = result / 0.202884;
        } else if (unitTo === "liters"){
            result = result / 202.884;
        }

    } else if (unitType === "temperature") {
        
        if (unitFrom === "farenheit"){
            result = inputValue;
        } else if (unitFrom === "celsius"){
            result = (inputValue * (9/5)) + 32;
        } else if (unitFrom === "kelvin"){
            result = ((inputValue - 273.15) * (9/5)) + 32;
        }

        if (unitTo === "celsius"){
            result = (inputValue - 32) * (5/9);
        } else if (unitTo === "kelvin"){
            result = ((inputValue - 32) * (5/9)) + 273.15;
        }
    } else if (unitType === "time") {
        
        if (unitFrom === "milliseconds"){
            result = inputValue;
        } else if (unitFrom === "seconds"){
            result = inputValue * 1000;
        } else if (unitFrom === "minutes"){
            result = inputValue * 60000;
        } else if (unitFrom === "hours"){
            result = inputValue * 3600000;
        } else if (unitFrom === "days"){
            result = inputValue * 86400000;
        } else if (unitFrom === "weeks"){
            result = inputValue * 604800000;
        } else if (unitFrom === "months"){
            result = inputValue * 2628000000;
        } else if (unitFrom === "years"){
            result = inputValue * 31540000000;
        }

        if (unitTo === "seconds"){
            result = result / 1000;
        } else if (unitTo === "minutes"){
            result = result * 60000;
        } else if (unitTo === "hours"){
            result = result / 3600000;
        } else if (unitTo === "days"){
            result = result / 86400000;
        } else if (unitTo === "weeks"){
            result = result / 604800000;
        } else if (unitTo === "months"){
            result = result / 2628000000;
        } else if (unitTo === "years"){
            result = result / 31540000000;
        }
        
    }


    if (result !== null) {
        document.getElementById("unitOutput").value = (Math.round(result*100)/100).toLocaleString('en-US')
    } else {
        document.getElementById("unitOutput").value = "ERROR";
    }
}



document.addEventListener("DOMContentLoaded", () => {

    let unitType = document.getElementById("unitTypeSelect").value;
    const inputSelect = document.getElementById("unitInputSelect");
    const outputSelect = document.getElementById("unitOutputSelect");
    const selects = [inputSelect, outputSelect];
    selects.forEach(select => {
        select.innerHTML = `
            <option value="inches">Inches</option>
            <option value="feet">Feet</option>
            <option value="yards">Yards</option>
            <option value="meters">Miles</option>
            <option value="millimeters">Millimeters</option>
            <option value="centimeters">Centimeters</option>
            <option value="meters">Meters</option>
            <option value="kilometers">Kilometers</option>
            <option value="footballFields">Football Fields</option>
            <option value="schoolBuses">School Buses</option>
            <option value="Bananas">Bananas</option>
        `;
    })

    document.getElementById("unitTypeSelect").addEventListener("change", async () => {
        unitType = document.getElementById("unitTypeSelect").value;
            
        if (unitType === "length") {
            selects.forEach(select => {
                select.innerHTML = `
                    <option value="inches">Inches</option>
                    <option value="feet">Feet</option>
                    <option value="yards">Yards</option>
                    <option value="meters">Miles</option>
                    <option value="millimeters">Millimeters</option>
                    <option value="centimeters">Centimeters</option>
                    <option value="meters">Meters</option>
                    <option value="kilometers">Kilometers</option>
                    <option value="footballFields">Football Fields</option>
                    <option value="schoolBuses">School Buses</option>
                    <option value="Bananas">Bananas</option>
                `;
            });
        } else if (unitType === "weight") {
            selects.forEach(select => {
                select.innerHTML = `
                    <option value="ounces">Ounces</option>
                    <option value="pounds">Pounds</option>
                    <option value="tons">Tons</option>
                    <option value="milligrams">Milligrams</option>
                    <option value="grams">Grams</option>
                    <option value="kilograms">Kilograms</option>
                    <option value="metricTons">Metric Tons</option>
                `;
            });
        } else if (unitType === "volume") {
            selects.forEach(select => {
                select.innerHTML = `
                    <option value="teaspoons">Teaspoons</option>
                    <option value="tablespoons">Tablespoons</option>
                    <option value="fluidOunces">Fluid Ounces</option>
                    <option value="cups">Cups</option>
                    <option value="pints">Pints</option>
                    <option value="quarts">Quarts</option>
                    <option value="gallons">Gallons</option>
                    <option value="milliliters">Milliliters</option>
                    <option value="liters">Liters</option>
                `;
            });
        } else if (unitType === "temperature") {
            selects.forEach(select => {
                select.innerHTML = `
                <option value="fahrenheit">Fahrenheit</option>
                <option value="celsius">Celsius</option>
                <option value="kelvin">Kelvin</option>
            `;
            });
        } else if (unitType === "time") {
            selects.forEach(select => {
                select.innerHTML = `
                    <option value="milliseconds">Milliseconds</option>
                    <option value="seconds">Seconds</option>
                    <option value="minutes">Minutes</option>
                    <option value="hours">Hours</option>
                    <option value="days">Days</option>
                    <option value="weeks">Weeks</option>
                    <option value="months">Months</option>
                    <option value="years">Years</option>
                `;
            });
        }
    }) // end of change listener



    document.getElementById("unitInput").addEventListener("change", () => {
        convert();
    })
    document.getElementById("unitInputSelect").addEventListener("change", () => {
        convert();
    })
    document.getElementById("unitOutputSelect").addEventListener("change", () => {
        convert();
    })

}) // end of DOMContentLoaded
const BASE_URL = "https://api.exchangerate-api.com/v4/latest";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");
const amountInput = document.querySelector(".amount input");

// Populate dropdowns with currency options
for (let select of dropdowns) {
    for (currCode in countryList) {
        let newOption = document.createElement("option");
        newOption.innerText = currCode;
        newOption.value = currCode;
        if (select.name === "from" && currCode === "USD") {
            newOption.selected = "selected";
        } else if (select.name === "to" && currCode === "INR") {
            newOption.selected = "selected";
        }
        select.append(newOption);
    }

    select.addEventListener("change", (evt) => {
        updateFlag(evt.target);
        updateExchangeRate();
    });
}

// Update flag image when currency is changed
const updateFlag = (element) => {
    let currCode = element.value;
    let countryCode = countryList[currCode];
    if (countryCode) {
        let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
        let img = element.parentElement.querySelector("img");
        img.src = newSrc;
    }
};

// Update the exchange rate message without submitting
const updateExchangeRate = async () => {
    let amtVal = amountInput.value;
    if (amtVal === "" || amtVal < 1) {
        amtVal = 1;
        amountInput.value = "1";
    }
    
    try {
        const URL = `${BASE_URL}/${fromCurr.value}`;
        msg.innerText = "Fetching exchange rates...";
        
        const response = await fetch(URL);
        if (!response.ok) {
            throw new Error("Failed to fetch exchange rates");
        }
        
        const data = await response.json();
        const rate = data.rates[toCurr.value];
        
        if (rate) {
            const finalAmount = (amtVal * rate).toFixed(2);
            msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
        } else {
            throw new Error("Invalid exchange rate data");
        }
    } catch (error) {
        msg.innerText = `Error: ${error.message}`;
    }
};

// Event listener for the convert button
btn.addEventListener("click", async (evt) => {
    evt.preventDefault();
    await updateExchangeRate();
});

// Event listener for amount input to update rate on change
amountInput.addEventListener("input", updateExchangeRate);

// Initialize with default values
window.addEventListener("load", () => {
    updateExchangeRate();
});
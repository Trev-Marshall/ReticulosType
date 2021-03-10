'use strict';

let TIME_LIMIT = 30;

let quotes_array = '';

// selecting elements 
let timer_text = document.querySelector(".curr_time"); 
let accuracy_text = document.querySelector(".curr_accuracy"); 
let error_text = document.querySelector(".curr_errors"); 
let cpm_text = document.querySelector(".curr_cpm"); 
let wpm_text = document.querySelector(".curr_wpm"); 
let score_text = document.querySelector(".curr_score"); 
let quote_text = document.querySelector(".quote"); 
let input_area = document.querySelector(".input_area"); 
let restart_btn = document.querySelector(".restart_btn"); 
let cpm_group = document.querySelector(".cpm"); 
let wpm_group = document.querySelector(".wpm"); 
let error_group = document.querySelector(".errors"); 
let accuracy_group = document.querySelector(".accuracy"); 

let timeLeft = TIME_LIMIT; 
let timeElapsed = 0; 
let total_errors = 0; 
let errors = 0; 
let accuracy = 0; 
let characterTyped = 0; 
let current_quote = ""; 
let quoteNo = 0; 
let timer = null;


// Updating quote with API
function updateQuote() {
fetch('https://random-words-api.vercel.app/word')
.then((response) => { 
    return response.json()
})
.then((data) =>{
    quote_text.textContent = null;
    quotes_array = `${data[0].word}; ${data[0].definition}`;
    current_quote = quotes_array;
    
    current_quote.split('').forEach((word) => {
    const charSpan = document.createElement('span');
    charSpan.innerText = word;
    console.log(charSpan.innerText);
    quote_text.appendChild(charSpan);
    })
});
    };


// Checking text in input area to update values
function processCurrentText() {
    let curr_input = input_area.value;
    console.log(curr_input);
    let curr_input_array = curr_input.split('');

    characterTyped++;

    errors = 0;

    // Splitting quote into span elements
    let quoteSpanArray = quote_text.querySelectorAll('span');

    // Updating quote span elements and variables
    quoteSpanArray.forEach((char, index) => {
        let typedChar = curr_input_array[index];

        if (typedChar == null) {
            char.classList.remove('correct_char');
            char.classList.remove('incorrect_char');
        } else if(typedChar == char.innerText) {
            char.classList.add('correct_char');
            char.classList.remove('incorrect_char');
        } else {
            char.classList.add('incorrect_char'); 
            char.classList.remove('correct_char'); 

            errors++; 
        }
    });

    error_text.textContent = total_errors + errors;

    // Calculations
    let correctCharacters = (characterTyped - (total_errors + errors));
    let accuracyVal = ((correctCharacters / characterTyped) * 100);
    accuracy_text.textContent = Math.round(accuracyVal);

    // Moving on to next qoute once at the end and adding values
    if(curr_input.length == current_quote.length - 2) {
        updateQuote();

        total_errors += errors;

        input_area.value = "";
    }

}

// Start game
function startGame() {
    resetValues();
    updateQuote();

    clearInterval(timer);
    timer = setInterval(updateTimer, 1000);
};

// Reset the game values back to square one to play again
function resetValues () {
    timeLeft = TIME_LIMIT;
    timeElapsed = 0; 
    errors = 0;
    total_errors = 0;
    accuracy = 0;
    characterTyped = 0;
    quoteNo = 0;
    input_area.disabled = false;

    input_area.value = ""; 
    quote_text.textContent = 'Press tab to start.'; 
    accuracy_text.textContent = 100; 
    timer_text.textContent = timeLeft + 's'; 
    error_text.textContent = 0; 
    restart_btn.style.display = "none"; 
    cpm_group.style.display = "none"; 
    wpm_group.style.display = "none"; 
};


// Updating the timer and finishing game once <= 0
function updateTimer () {
    if(timeLeft > 0) {
        timeLeft--;
        timeElapsed++;
        timer_text.textContent= timeLeft + "s";
    } else {
        finishGame();
    }
};


// Stopping and displaying results of typing game
function finishGame() {
    clearInterval(timer);

    input_area.disabled = true;

    quote_text.textContent = "Click restart to start a new game.";

    restart_btn.style.display = "block";

    let cpm = Math.round(((characterTyped / timeElapsed) * 60));
    let wpm = Math.round((((characterTyped / 5) / timeElapsed) * 60));

    cpm_text.textContent = cpm;
    wpm_text.textContent = wpm;

    cpm_group.style.display = "block";
    wpm_group.style.display = "block";
};


// Displaying letter under the text area, just for fun
document.addEventListener('keydown', function (e) {
    console.log(e);
    letter.textContent = `${e.key}`;
    return e;
});
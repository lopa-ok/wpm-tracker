const quoteDisplayElement = document.getElementById('quoteDisplay');
const quoteInputElement = document.getElementById('quoteInput');
const timerElement = document.getElementById('timer');
const accuracyElement = document.getElementById('accuracy');
const wpmElement = document.getElementById('wpm');
const wordCountSlider = document.getElementById('wordCountSlider');
const wordCountValue = document.getElementById('wordCountValue');
const timedModeButton = document.getElementById('timedMode');
const freeTypingModeButton = document.getElementById('freeTypingMode');

let startTime;
let timerInterval;
let mode = 'free';
let correctChars = 0;
let totalCharsTyped = 0;
let totalWordsTyped = 0;
let elapsedTime = 0;
const timedModeDuration = 60;

function updateWordCount() {
    wordCountValue.innerText = wordCountSlider.value;
    renderNewQuote();
}

async function fetchRandomWords(count) {
    const response = await fetch(`https://random-word-api.herokuapp.com/word?number=${count}`);
    const words = await response.json();
    return words.join(' ');
}

async function renderNewQuote() {
    const wordCount = parseInt(wordCountSlider.value, 10);
    const quote = await fetchRandomWords(wordCount);
    quoteDisplayElement.innerText = '';
    quote.split('').forEach((character, index) => {
        const characterSpan = document.createElement('span');
        characterSpan.innerHTML = character === ' ' ? '&nbsp;' : character;
        if (index === 0) {
            characterSpan.classList.add('current');
        }
        quoteDisplayElement.appendChild(characterSpan);
    });
    quoteInputElement.value = null;
    startTimer();
}

quoteInputElement.addEventListener('input', () => {
    const arrayQuote = quoteDisplayElement.querySelectorAll('span');
    const arrayValue = quoteInputElement.value.split('');
    let correct = true;
    correctChars = 0;
    totalCharsTyped++;

    arrayQuote.forEach((characterSpan, index) => {
        const character = arrayValue[index];
        if (character == null) {
            characterSpan.classList.remove('correct');
            characterSpan.classList.remove('incorrect');
            correct = false;
        } else if (character === characterSpan.innerText || (character === ' ' && characterSpan.innerHTML === '&nbsp;')) {
            characterSpan.classList.add('correct');
            characterSpan.classList.remove('incorrect');
            correctChars++;
        } else {
            characterSpan.classList.remove('correct');
            characterSpan.classList.add('incorrect');
            correct = false;
        }

        // Highlight the current character
        if (index === arrayValue.length) {
            characterSpan.classList.add('current');
        } else {
            characterSpan.classList.remove('current');
        }
    });

    // Check if the user has completed the quote
    if (arrayValue.length === arrayQuote.length && correct) {
        totalWordsTyped += parseInt(wordCountSlider.value, 10);
        renderNewQuote();
    }

    updateAccuracy();
    updateWPM();
});

function startTimer() {
    timerElement.innerText = 'Time: 0s';
    startTime = new Date();
    elapsedTime = 0;
    if (mode === 'timed') {
        timerInterval = setInterval(() => {
            elapsedTime = Math.floor((new Date() - startTime) / 1000);
            timerElement.innerText = `Time: ${elapsedTime}s`;
            if (elapsedTime >= timedModeDuration) {
                clearInterval(timerInterval);
                renderNewQuote();
            }
            updateWPM();
        }, 1000);
    } else {
        timerInterval = setInterval(() => {
            const elapsedSeconds = Math.floor((new Date() - startTime) / 1000);
            timerElement.innerText = `Time: ${elapsedSeconds}s`;
            updateWPM();
        }, 1000);
    }
}

function updateAccuracy() {
    const accuracy = Math.floor((correctChars / totalCharsTyped) * 100);
    accuracyElement.innerText = `Accuracy: ${accuracy}%`;
}

function updateWPM() {
    const elapsedMinutes = (new Date() - startTime) / 60000;
    const wpm = Math.floor(totalWordsTyped / elapsedMinutes);
    if (mode === 'timed' && elapsedTime <= timedModeDuration) {
        const estimatedWPM = Math.floor((totalWordsTyped / elapsedTime) * 60);
        wpmElement.innerText = `Estimated WPM: ${estimatedWPM}`;
    } else {
        wpmElement.innerText = `WPM: ${wpm}`;
    }
}

function switchMode(newMode) {
    mode = newMode;
    startTime = new Date();
    totalCharsTyped = 0;
    totalWordsTyped = 0;
    correctChars = 0;
    clearInterval(timerInterval);
    if (mode === 'timed') {
        timerElement.innerText = `Time: 0s`;
    } else {
        renderNewQuote();
    }
    timedModeButton.classList.toggle('active', mode === 'timed');
    freeTypingModeButton.classList.toggle('active', mode === 'free');
}

timedModeButton.addEventListener('click', () => switchMode('timed'));
freeTypingModeButton.addEventListener('click', () => switchMode('free'));


renderNewQuote();


wordCountSlider.addEventListener('input', updateWordCount);


document.addEventListener('click', () => {
    quoteInputElement.focus();
});


quoteInputElement.focus();

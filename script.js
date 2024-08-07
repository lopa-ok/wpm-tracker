const quoteDisplayElement = document.getElementById('quoteDisplay');
const quoteInputElement = document.getElementById('quoteInput');
const timerElement = document.getElementById('timer');
const accuracyElement = document.getElementById('accuracy');
const wpmElement = document.getElementById('wpm');
const wordCountSlider = document.getElementById('wordCountSlider');
const wordCountValue = document.getElementById('wordCountValue');

let startTime;
let correctChars = 0;
let totalCharsTyped = 0;
let totalWordsTyped = 0;
let firstTypingTimeElapsed = false;

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
    setInterval(() => {
        const elapsedSeconds = Math.floor((new Date() - startTime) / 1000);
        timerElement.innerText = `Time: ${elapsedSeconds}s`;
        if (elapsedSeconds <= 5 && !firstTypingTimeElapsed) {
            updateEstimatedWPM();
        } else if (elapsedSeconds > 5) {
            firstTypingTimeElapsed = true;
        }
    }, 1000);
}

function updateAccuracy() {
    const accuracy = Math.floor((correctChars / totalCharsTyped) * 100);
    accuracyElement.innerText = `Accuracy: ${accuracy}%`;
}

function updateWPM() {
    const elapsedMinutes = (new Date() - startTime) / 60000;
    const wpm = Math.floor(totalWordsTyped / elapsedMinutes);
    wpmElement.innerText = `WPM: ${wpm}`;
}

function updateEstimatedWPM() {
    const elapsedSeconds = Math.floor((new Date() - startTime) / 1000);
    if (elapsedSeconds > 0) {
        const estimatedWPM = Math.floor((totalWordsTyped / elapsedSeconds) * 60);
        wpmElement.innerText = `Estimated WPM: ${estimatedWPM}`;
    }
}


renderNewQuote();


wordCountSlider.addEventListener('input', updateWordCount);


document.addEventListener('click', () => {
    quoteInputElement.focus();
});


quoteInputElement.focus();

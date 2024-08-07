const quoteDisplayElement = document.getElementById('quoteDisplay');
const quoteInputElement = document.getElementById('quoteInput');
const timerElement = document.getElementById('timer');
const accuracyElement = document.getElementById('accuracy');

let startTime;
let correctChars = 0;

async function fetchRandomWords(count = 10) {
    const response = await fetch(`https://random-word-api.herokuapp.com/word?number=${count}`);
    const words = await response.json();
    return words.join(' ');
}

async function renderNewQuote() {
    const quote = await fetchRandomWords();
    quoteDisplayElement.innerText = '';
    quote.split('').forEach(character => {
        const characterSpan = document.createElement('span');
        characterSpan.innerText = character;
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

    arrayQuote.forEach((characterSpan, index) => {
        const character = arrayValue[index];
        if (character == null) {
            characterSpan.classList.remove('correct');
            characterSpan.classList.remove('incorrect');
            correct = false;
        } else if (character === characterSpan.innerText) {
            characterSpan.classList.add('correct');
            characterSpan.classList.remove('incorrect');
            correctChars++;
        } else {
            characterSpan.classList.remove('correct');
            characterSpan.classList.add('incorrect');
            correct = false;
        }
    });

    if (correct) renderNewQuote();
    updateAccuracy();
});

function startTimer() {
    timerElement.innerText = 'Time: 0s';
    startTime = new Date();
    setInterval(() => {
        timerElement.innerText = `Time: ${Math.floor((new Date() - startTime) / 1000)}s`;
    }, 1000);
}

function updateAccuracy() {
    const totalChars = quoteDisplayElement.innerText.length;
    const accuracy = Math.floor((correctChars / totalChars) * 100);
    accuracyElement.innerText = `Accuracy: ${accuracy}%`;
}

renderNewQuote();

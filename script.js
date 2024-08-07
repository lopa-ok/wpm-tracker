const quoteDisplayElement = document.getElementById('quoteDisplay');
const quoteInputElement = document.getElementById('quoteInput');
const timerElement = document.getElementById('timer');
const accuracyElement = document.getElementById('accuracy');

let startTime;
let correctChars = 0;
let totalCharsTyped = 0;

async function fetchRandomWords(count = 10) {
    const response = await fetch(`https://random-word-api.herokuapp.com/word?number=${count}`);
    const words = await response.json();
    return words.join(' ');
}

async function renderNewQuote() {
    const quote = await fetchRandomWords(10);
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

        
        if (index === arrayValue.length) {
            characterSpan.classList.add('current');
        } else {
            characterSpan.classList.remove('current');
        }
    });

    
    if (arrayValue.length === arrayQuote.length && correct) {
        renderNewQuote();
    }

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
    const accuracy = Math.floor((correctChars / totalCharsTyped) * 100);
    accuracyElement.innerText = `Accuracy: ${accuracy}%`;
}

renderNewQuote();


document.addEventListener('click', () => {
    quoteInputElement.focus();
});


quoteInputElement.focus();

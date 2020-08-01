const display = document.getElementById('display');
const userInput = document.getElementById('user-input');
let potentialName;
let userName;
let currentGridRow = 0;

const vocab = {
    greeting: [`Hi`, `Hey`, `Hello`, `What's up`, `Howdy`, `Sup`, `Yo`, `Heya`, `Hey there`],
    confused: [
        `I didn't understand that.`,
        `Sorry, I didn't catch that.`,
        `I'm confused. Could you clarify?`,
        `I don't understand.`
    ]
};

const filterGreeting = /\b(?:hi|hey|hello|howdy|what('?s)?|is|up|how('?s)?|are|you|it|going)\b/gmi;
const filterIntro = /\b(?:my|name('?s)?|is|can|call(ed)?|me|i('?m)?|am|it('?s?)|is)\b/gmi;
const filterPunct = /[ .,!?]/gm;

function reply() {
    let userMsg = userInput.value;
    if (!userName) {
        if (!potentialName) {
            potentialName = userMsg.replace(filterGreeting, '').replace(filterIntro, '').replace(filterPunct, '');
            sendMsg('from-reggie', `So your name is ${potentialName}? Is that correct?`);
        } else {
            if (userMsg.match(/\byes\b/gi)) {
                userName = potentialName;
                sendMsg('from-reggie', `${userName} is a nice name! How are you? 🤖`);
            } else if (userMsg.match(/\bno(pe)?\b/gi)) {
                sendMsg('from-reggie', `Oh, what was it?`);
                potentialName = '';
            } else {
                sendMsg('from-reggie', getRandArrItem(vocab.confused));
            }
        }
    }
}

function sendMsg(from, content) {
    currentGridRow++;
    let newMsg = `<div class="message ${from}" style="grid-row-start:${currentGridRow}">${content}</div>`;
    display.innerHTML += newMsg;
}

function runApp() {
    sendMsg('from-user', userInput.value);
    reply();
    userInput.value = '';
}

sendMsg('from-reggie', `${getRandArrItem(vocab.greeting)}! What's your name? 🤖`);
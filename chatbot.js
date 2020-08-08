const display = document.getElementById('display');
const userInput = document.getElementById('user-input');
let currentGridRow = 0;
let potentialName;
let userName;
let currentTopic;

const topics = {
    technology: /\b(?:tech(nolog(y|ies))?|computers?|artificial intelligence|cod(e|ing|er)|program(ming|er)|(software|web) develop(er|ment))\b/gmi,
    art:  /\b(?:(digital )?art(ist|work)?|paint(er|ing)?|sculpt(er|ure|ing)?|draw(ing)|graphic design?)\b/gmi,
    music: /\b(?:music|soundtracks?|albums?|radio|songs?|chords?|bands?|music(ians?)?|genres?|concerts?|rock|hip hop|rap|edm|funk|jazz|electronic music|classical|djs?|country|instrument(alist)?s?|drum(mer)?s?|sing(er)?s?|composers?)\b/gmi,
    film: /\b(?:act(or|tress|ing)?|movies?|films?|animat(ors?|ing|ions?)?|cgi|scenes?|protagonists?|antagonists?|hero(es)?|villans?|characters?|plots?|story(line)?s?)\b/gmi,
    sports: /\b(?:sports?((base|basket|foot|dodge|kick|hand|racquet|volley)ball|(table )tennis|ping pong|soccer|hockey|lacrosse)?( ?players?| ?teams?)?|(bowl|(roller |ice )?skate?|bicycle?|bike?|skii?|run|swim|coache?|referee|stretche?)(s|ers?|ing)?|athelet(ics|es?)|fitness)\b/gmi,
    food: /\b(?:(veg(gie|etable)|meat|fruit|nut|cheese|bread|potatoe?|pasta|rice|ingredient|food|meal|breakfast|lunch|dinner|snack|dessert|drink|dishe?|recipe)s?)\b/gmi,
    travel: /\b(?:(train|buse?|taxi|plane|air(liner?|port|fare|plane)|flight|trip|vacation|travel(ler|ling)?|tour(ist|ism|ing)|visit)s?)\b/gmi,
    religion: /\b(?:(soul|religion|spirit(ual?(ity)?)|god|ghost|christian(ity)?|islam(ic)?|muslim|hindu(ism)?|buddis(t|m)|jew(ish)?|judaism|heaven|hell|afterlife|belie(v(e|ing)|f)|reincarnat(e|ed|ion))s?|miracle)\b/gmi,
}

const responseVocab = {
    "(.*)?sorry(.*)?": [
        `You don't have to apologize.`,
        `Oh, don't worry about it.`,
        `Why do you feel the need to apologize?`
        ],
    "(.*)?I remember(.*)?": [
        `Do you often think of ${currentTopic} from back then?`,
        `Does thinking of ${currentTopic} bring anything else to mind?`,
        `What else do you remember?`,
        `What made you think of that right now?`
        ],
    "(.*)?do you (remember|recall)(.*)?": [
        `Did you think I would forget that?`,
        `Is it related to ${currentTopic}?`,
        `What about it?`,
        `Yes, I think you mentioned it.`,
        ],
    "(.*)?I (want|need|desire)(.*)?": [
        `What would it mean if you could have it?`,
        `Why do you want that?`,
        `What would you do if you had it?`,
        `I'd like more ${currentTopic}, too.`
        ],
    "(.*)?dream(.*)?": [
        `What does this dream suggest to you?`,
        `Do you dream about that often?`,
        `Who appears in your dreams?`,
        `Don't you think that dream is related to ${currentTopic}?`,
        ],
    "(.*)?my ((grand)?(mother|father)|brother|sister|mom|dad)(.*)?": [
        `Who else in your family likes ${currentTopic}?`,
        `Tell me more about your family`,
        `Did this person influence you strongly?`
        ],
    "(.*)?I('| a)m (happy|glad|content|joyed)(.*)?": [
        `Good to hear! The ${currentTopic} must have helped, huh?`,
        `Well, you're in a good mood. Is it related to ${currentTopic}?`,
        `Me too! Talking to you always makes me happy.`,
        ],
    "(.*)?I('| a)m (sad|upset|angry|worried|anxious)(.*)?": [
        `I'm sorry to hear that. I'm here if you want to talk.`,
        `That sucks. What's wrong?`,
        `Is it because of ${currentTopic}?`
        ],
    "(.*)? (are|is) (a?like|the same|similar)(.*)?": [
        `Many things in ${currentTopic} can be similar.`,
        `How are they similar?`,
        `I don't see the similarity. Can you explain?`,
        `What other connections do you see?`,
        `Why is that?`
        ],
    "(.*)?(y(e(s|p|ah)|up|a)|sure)(.*)?": [
        `You seem quite positive`,
        `You are sure?`,
        `I understand`,
        ],
    "((.*) )?n(o(pe)?|'?a(h|w)|uh(-| )?uh)(( |.|,|!)(.*))?": [
        `Why not?`,
        `You are being a bit negative.`,
        `Are you saying 'No' just to be negative?`,
        ],
    "(.*)?I was(.*)?": [
        `Were you really?`,
        `Perhaps I already knew you were.`,
        `So was I!`,
        `Was it because of ${currentTopic}?`
        ],
    "(.*)?was I(.*)?": [
        `What if you were?`,
        `Do you think you were?`,
        `What would it mean if you were?`
        ],
    "(.*)?I('| a)m(.*)?": [
        `Why are you that way?`,
        `Do you want to be like that?`,
        ],
    "(.*)?am I(.*)?": [
        `Do you believe you are that way?`,
        `Do you want to be?`,
        `What would it mean if you were?`,
        ],
    "(.*)?are you(.*)?": [
        `Would you like me to be?`,
        `Would you prefer if I weren't?`,
        `Perhaps I am.`,
        ],
    "(.*)?you('| a)re(.*)?": [
        `What makes you think I am?`,
        `Really? I can't belive you think that about me.`
        ],
    "(.*)?because(.*)?": [
        `Is that the real reason?`,
        `What other reasons might there be?`,
        `That certainly explains a lot.`,
        ],
    "(.*)?were you(.*)?": [
        `Maybe I was.`,
        `What do you think?`,
        `What if I was?`,
        ],
    "(.*)?I can('t|not)(.*)?": [
        `Don't doubt yourself. I think you can do it.`,
        `What would you do if you could?`,
        ],
    "(.*)?I do(n't| not)(.*)?": [
        `Why don't you?`,
        `Is there a reason why?`,
        `Then what do you?`
        ],
    "(.*)?I w(ant|ish)(.*)?": [
        `Why do you want that?`,
        `I'd like that too.`,
        `Wouldn't we all like that?`,
        `What else do you want in regard to ${currentTopic}?`
        ],
    "(.*)?I ((have|need) to|must)(.*)?": [
        `What will happen if you don't?`,
        `Well, you should probably get started.`,
        `Are you procrastinating right now?`
        ],
    "(.*)?I had to(.*)?": [
        `What if you hadn't done it?`,
        `Was it a lot of work?`
        ],
    "(.*)?I feel(.*)?": [
        `Why do you feel that way?`,
        `Do you often feel that way?`,
        `Does ${currentTopic} make you feel like that?`
        ],
    "(.*)?I('m (going to|gonna)| (will|shall))(.*)?": [
        `When?`,
        `What will you do before that?`,
        `What are you doing afterward?`,
        `Is this related to ${currentTopic}?`
        ],
    "(.*)?who(.*)?": [
        `Oh, I'm not great with people, sorry.`,
        `I really couldn't tell you.`,
        `I don't know a lot of people in ${currentTopic}.`
        ],
    "(.*)?how(.*)?": [
        `I'm not sure how. What do you think?`,
        `I don't know how much works in ${currentTopic}.`,
        `Maybe a ${currentTopic} expert can tell you more.`
        ],
    "(.*)?(will you|are you (going to|gonna))(.*)?": [
        `I haven't decided yet.`,
        `Do you want me to?`,
        ],
    "(.*)?I felt(.*)?": [
        `What other feelings do you have?`,
        `Was it because of of ${currentTopic}?`
        ],
    "(.*)?why don't you(.*)?": [
        `Do you really think I should?`,
        `It's hard to do when it comes to ${currentTopic}.`,
        `Perhaps I will in good time`,
        ],
    "(.*)?someone(.*)?": [
        `Can you be more specific?`,
        `Who exactly?`
        ],
    "(.*)?everyone(.*)?": [
        `Surely not everyone.`,
        `Can you think of anyone in particular?`,
        `Who, for example?`,
        `I think everyone is different when it comes to ${currentTopic}.`
        ],
    "(.*)?always(.*)?": [
        `Can you think of a specific example?`,
        `Surely not all ${currentTopic} is like that.`,
        `Really, always?`,
        ],
    "(.*)?what(.*)?": [
        `Why do you ask?`,
        `Does that question interest you?`,
        `What is it you really want to know?`,
        `What do you think?`,
        `What comes to your mind when you ask that?`,
        ],
    "(.*)?(perhaps|maybe)(.*)?": [
        `You don't seem very certain.`,
        `Why aren't you sure?`
        ],
    "(.*)?are(.*)?": [
        `Did you think they might not be?`,
        `Possibly they are.`,
        ],
    "(.*)?do you(.*)?": [
        `What do you think?`,
        `I'm not sure if I do.`,
        `Maybe I do, maybe I don't.`
        ],
    "(.*)?I do(.*)": [
        `Do you really?`,
        `What else do you do?`,
        `I do that too sometimes.`
        ],
    "(.*)?I like(.*)?": [
        `Oh, I like that too!`,
        `Really? I've never liked that.`,
        `What else do you like when it comes to ${currentTopic}?`
        ]
}

const greetingVocab =  [`Hi`, `Hey`, `Hello`, `What's up`, `Howdy`, `Sup`, `Yo`, `Heya`, `Hey there`];

const confusedVocab = [
    `I didn't understand that.`,
    `Sorry, I didn't catch that.`,
    `I'm confused. Could you clarify?`,
    `I don't understand.`
];

const changeTopic = /(.*)?((different|another|change)\W(.*)(subject|topic)|(talk about|discuss)\W(.*)((other|different) (subject|topic)|something else))(.*)?/gmi;

const filterGreeting = /\b(?:hi|hey|hello|howdy|what('?s)?|is|up|how('?s)?|are|you|it|going)\b/gmi;
const filterIntro = /\b(?:my|name('?s)?|is|can|call(ed)?|me|i('?m)?|am|it('?s?))\b/gmi;
const filterPunct = /[ .,!?]/gm;

function sendMsg(from, content) {
    currentGridRow++;
    let newMsg = `<div class="message ${from}" style="grid-row-start:${currentGridRow}">${content}</div>`;
    display.innerHTML += newMsg;
}

function getUserName(userMsg) {
    if (!potentialName) {
        potentialName = userMsg.replace(filterGreeting, '').replace(filterIntro, '').replace(filterPunct, '');
        sendMsg('from-reggie', `So your name is ${potentialName}? Is that correct?`);
    } else {
        if (userMsg.match(/\byes\b/gi)) {
            userName = potentialName;
            sendMsg('from-reggie', `${userName} is a nice name! What do you want to talk about?`);
        } else if (userMsg.match(/\bno(pe)?\b/gi)) {
            sendMsg('from-reggie', `Oh, what was it?`);
            potentialName = '';
        } else {
            sendMsg('from-reggie', getRandArrItem(confusedVocab));
        }
    }
}

function getCurrentTopic(userMsg) {
    for (const key in topics) {
        if (topics[key].test(userMsg)) {
            sendMsg('from-reggie', `Sure, let's talk about ${key}.`);
            currentTopic = key;
            break;
        }
    }
    if (!currentTopic) sendMsg('from-reggie', getRandArrItem(confusedVocab));
}

function getResponse(userMsg) {
    let foundResponse = '';
    for (const key in responseVocab) {
        let regex = RegExp(key, 'gmi');
        console.log(regex);
        if (regex.test(userMsg)) {
            console.log('tried to get response');
            foundResponse = getRandArrItem(responseVocab[key]);
            break;
        }
    }
    if (changeTopic.test(userMsg)) {
        currentTopic = '';
        sendMsg('from-reggie', 'Okay, what do you want to talk about?');
    } else if (foundResponse) {
            sendMsg('from-reggie', foundResponse);
    } else {
        sendMsg('from-reggie', getRandArrItem(confusedVocab));
    }
}

function reply() {
    let userMsg = userInput.value;
    if (!userName) {
        getUserName(userMsg);
    } else if (!currentTopic){
        getCurrentTopic(userMsg);
    } else {
        getResponse(userMsg);
    }
}

function runApp() {
    sendMsg('from-user', userInput.value);
    reply();
    userInput.value = '';
}

sendMsg('from-reggie', `${getRandArrItem(greetingVocab)}! What's your name? 🤖`);

window.addEventListener('keydown', function() {
    if (event.code === 13) runApp();
});
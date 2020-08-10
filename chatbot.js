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

const cgResponses = {
    "(.*)?who ((made|created) you|is your (creator|maker|father|mother|parent))(.*)?": [
        `I was made by <a href="https://github.com/richard-oden">Richard Oden</a>! 🤖`,
        `My creator is <a href="https://github.com/richard-oden">Richard Oden</a>! 🤖`
        ],
    "(.*)?my name(.*)?": [
        `${userName} has a nice ring to it. Does it have any meaning?`,
        `Do you like the name ${userName}?`
        ],
    "(.*)?you(r name| called)(.*)?": [
        `My maker gave me that name. It's because I'm made of regular expressions! 🤖`
        ],
    "(.*)?I re(?:member|call) (.*)?": [
        `Do you often think of $2?`,
        `Does thinking of $2 bring anything else to mind?`,
        `What else do you remember?`,
        `Does anything in ${currentTopic} remind you of $2?`,
        `What in the present situation reminds you of $2?`,
        `What is the connection between me and $2?`,
        ],
    "(.*)?do you re(?:member|call) (.*)?": [
        `Did you think I would forget $2?`,
        `It was related to ${currentTopic}, right?`,
        `What about $2?`,
        `You mentioned $2.`,
        ],
    "(.*)?I (?:want|need|desire|would (like|love)) (.*)?": [
        `What would it mean if you got $2?`,
        `Why do you want $2?`,
        `Suppose you got $2 soon.`
        ],
    "(.*)?your favorite(.*)?": [
        `I have decided yet. There are so many to choose from!`,
        `What do you think my favorite is?`
        ],
    "(.*)?my favorite(.*)?": [
        `Is that your favorite type of ${currentTopic}?`,
        `Why is that your favorite?`
        ],
    "(.*)?I dream(?:t|ed)? (.*)?": [
        `How do you feel about $2 in reality?`,
        `What does this dream suggest to you?`,
        `Do you dream about $2 often?`,
        `Who appears in your dreams?`,
        `Don't you believe that dream has to do with your problem?`
        ],
    "(.*)?my (?:(grand)?(mother|father)|brother|sister|mom|dad)(.*)?": [
        `Is anyone else in your family involved in ${currentTopic}?`,
        `Tell me more about your family`,
        `Did this person influence you strongly?`,
        `Who else in your family $2?`
        ],
    "(.*)?I('| a)m (happy|glad|content|joyed|excited)(.*)?": [
        `Good to hear! Does ${currentTopic} make you happy?`,
        `Well, you're in a good mood. Is it related to ${currentTopic}?`,
        `Me too! Talking to you always makes me happy.`,
        ],
    "(.*)?I('| a)m (sad|upset|angry|worried|anxious)(.*)?": [
        `I'm sorry to hear that. I'm here if you want to talk.`,
        `That sucks. What's wrong?`,
        `Is it because of ${currentTopic}?`
        ],
    "(.*)? (?:are|is) (?:like|the same as|similar to)(.*)?": [
        `Many things in ${currentTopic} can be similar.`,
        `How are $1 and $2 similar?`,
        `I don't see the similarity. Can you explain?`,
        `What other connections do you see between them?`,
        `Why is that?`
        ],
    "((.*) )?(?:y(e(s|p|ah)|up|a)|sure)(( |.|,|!)(.*))?": [
        `You seem very positive.`,
        `Are you sure?`,
        `What makes you say $2?`
        ],
    "((.*) )?n(?:o(pe)?|'?a(h|w)|uh(-| )?uh)(( |.|,|!)(.*))?": [
        `Why not?`,
        `You are being a bit negative.`,
        `Are you saying '$2' just to be negative?`,
        `What makes you say $2?`
        ],
    "(.*)?I(?:'m (going to|gonna)| (will|shall))(.*)?": [
        `When?`,
        `What will you do before you $2?`,
        `What are you doing after you $2?`
        ],
    "(.*)?(?:will you|are you (going to|gonna))(.*)?": [
        `I haven't decided yet.`,
        `Do you want me to $2?`
        ],
    "(.*)?who(.*)?": [
        `Oh, I'm not great with people, sorry.`,
        `I really couldn't tell you.`,
        `I don't know a lot of people in ${currentTopic}.`
        ],
    "(.*)?how(.*)?": [
        `I'm not sure how $2. What do you think?`,
        `I don't know how much works in ${currentTopic}.`,
        `Maybe a ${currentTopic} expert can tell you more.`
        ],
    "(.*)?I was (.*)?": [
        `Were you really?`,
        `Maybe I already knew you were $2.`,
        `Why do you tell me you were $2 now?`
        ],
    "(.*)?was I (.*)?": [
        `What if you were $2?`,
        `Do you think you were $2?`,
        `What would it mean if you were $2?`,
        ],
    "(.*)?I(?:'| a)m (.*)?": [
        `In what way are you $2?`,
        `Do you want to be $2?`,
        ],
    "(.*)?am I (.*)?": [
        `Do you believe you are $2?`,
        `Would you want to be $2?`,
        `You wish I would tell you you are $2?`,
        `What would it mean if you were $2?`,
        ],
    "(.*)?are you (.*)?": [
        `Why are you interested in whether I am $2 or not?`,
        `Would you prefer if I weren't $2?`,
        `Perhaps I am $2 in your fantasies.`,
        ],
    "(.*)?you(?:'| a)re (.*)?": [
        `What makes you think I am $2?`,
        ],
    "(.*)?(because|due to|result of) (.*)?": [
        `Is that the real reason?`,
        `What other reasons might there be?`,
        `Does that reason seem to explain anything else?`,
        ],
    "(.*)?were you (.*)?": [
        `Perhaps I was $2?`,
        `What do you think?`,
        `What if I had been $2?`,
        ],
    "(.*)?I can(?:'t|not) (.*)?": [
        `Maybe you could $2 now`,
        `What if you could $2?`,
        ],
    "(.*)?I do(?:n't| not)(.*)?": [
        `Why don't you $2?`,
        `Is there a reason why you don't $2?`,
        `Then what do you?`
        ],
    "(.*)?I (?:have|own)(.*)?": [
        `Do you like having $2?`,
        `Can I have $2 too?`,
        `What else do you have when it comes to ${currentTopic}?`
        ],
    "(.*)?I (?:(have|need) to|must)(.*)?": [
        `What will happen if you don't $2?`,
        `Well, you should probably get started.`,
        `Are you procrastinating right now?`
        ],
    "(.*)?I had to(.*)?": [
        `What if didn't have to $2?`,
        `Was it a lot of work to $2?`
        ],
    "(.*)?I fe(?:el|lt) (.*)?": [
        `Do you often feel $2?`,
        `Does talking about ${currentTopic} make you feel $2?`,
        `What other feelings do you have?`
        ],
    "(.*)?I (.*)? you (.*)?": [
        `Perhaps in your fantasy we $2 each other`,
        `Why do you $2 me?`
        ],
    "(.*)?why don't you (.*)?": [
        `Should you $2 yourself?`,
        `Do you believe I don't $2?`,
        `Perhaps I will $2 in good time`,
        ],
    "(.*)?(?:c|w|sh)ould I(.*)?": [
        `Maybe you could $2. Will you?`,
        `I'm really not sure.`
        ],
    "(.*)?I (?:c|w|sh)ould(.*)?": [
        `What if you did $2?`,
        `Maybe I could $2 too.`
        ],
    "(.*)?(?:c|w|sh)ould you(.*)?": [
        `Why do you want me to $2?`,
        `I'm really not sure.`
        ],
    "(.*)?you (?:c|w|sh)ould(.*)?": [
        `What if I did $2?`,
        `Do you want me to $2?`
        ],
    "(.*)?do you(.*)?": [
        `What do you think?`,
        `I'm not sure if I $2`,
        `Maybe I $2, maybe I don't.`
        ],
    "(.*)?I do(.*)": [
        `Do you really?`,
        `What else do you do?`,
        `I do that too sometimes.`
        ],
    "(.*)?I like(.*)?": [
        `Oh, I like $2 too!`,
        `Why do you like $2?`,
        `What else do you like when it comes to ${currentTopic}?`
        ],
    "(.*)?someone(.*)?": [
        `Can you be more specific?`,
        `Who exactly $2?`
        ],
    "(.*)?everyone(.*)?": [
        `Surely not everyone $2.`,
        `Can you think of anyone in particular who $2?`,
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
        `You don't seem very sure.`,
        ],
    "(.*)?if (.*)?": [
        `Do you think it's likely that $2?`,
        `Do you wish that $2?`,
        `What do you think about $2?`
        ],
    "(.*)?are (.*)?": [
        `Did you think they might not be $2?`,
        `Possibly they are $2`,
        `What else in ${currentTopic} is $2?`
        ],
    "(.*)?sorry(.*)?": [
        `Please don't apologize.`,
        `It's okay. We all make mistakes.`,
        `Don't worry about it, ${userName}.`,
        ],
}

const greetingVocab =  [`Hi`, `Hey`, `Hello`, `What's up`, `Howdy`, `Sup`, `Yo`, `Heya`, `Hey there`];

const defaultResponses = [
    `I didn't understand that.`,
    "Very interesting.",
    "I am not sure I understand you fully.",
    "What does that suggest to you?",
    "Please continue.",
    "Go on.",
    "Do you feel strongly about discussing such things?"
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
            sendMsg('from-reggie', `Sorry, I didn't catch that.`);
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
    if (!currentTopic) sendMsg('from-reggie', `Sorry, I didn't catch that.`);
}

function getResponse(userMsg) {
    let foundResponse = '';
    for (const key in cgResponses) {
        let regex = RegExp(key, 'gmi');
        if (regex.test(userMsg)) {
            foundResponse = userMsg.replace(regex, getRandArrItem(cgResponses[key]));
            break;
        }
    }
    if (changeTopic.test(userMsg)) {
        currentTopic = '';
        sendMsg('from-reggie', 'Okay, what do you want to talk about?');
    } else if (foundResponse) {
        sendMsg('from-reggie', foundResponse);
    } else {
        sendMsg('from-reggie', getRandArrItem(defaultResponses));
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
    display.scrollTop = display.scrollHeight;
    userInput.value = '';
}

sendMsg('from-reggie', `${getRandArrItem(greetingVocab)}! What's your name? 🤖`);

window.addEventListener('keydown', function() {
    if (event.key === 'Enter') runApp();
});
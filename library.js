// General functions ---------------------------------------------------------------------------------------------
function getRandArrItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function nthWord(string, n) {
    return string.split(' ')[n-1];
}

function numWords(string) {
    return string.split(' ').length;
}

function isCenter(arr2d, x, y) {
    if (x === Math.floor(arr2d.length / 2) && y === Math.floor(arr2d.length / 2)) return true;
}

function getCenter(arr2d) {
    for (let x = 0; x < arr2d.length; x++) {
        for (let y = 0; y < arr2d.length; y++) {
            if (isCenter(arr2d, x, y)) return [x, y];
        }
    }
}

function chance(percent) {
    if (Math.random()*100 <= percent) return true;
}

function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function isBetween(int, min, max) {
    return int > min && int < max ? true : false;
}

function print(message) {
    mapContainer.innerHTML = message;
}

function addEventListenerList(list, event, fn) {
    for (let el of list) el.addEventListener(event, fn, false);
}
const usernames = {};
const userWords = {};
const words = require('./words.js');

function addUsername({username, sid }) {
    usernames[username] = sid;
}

function getSecertWord(words) {
    const min = 1;
    const max = words.length;
    const index = Math.floor(Math.random() * (max - min + 1) + min); 
    return words[index];
}

function startNewGame(username) {
    const secertWord = getSecertWord(words);
    console.log(username + ' start a new game, the secert word is ' + secertWord);
    userWords[username] = {
        'secertWord' : secertWord,
        'guessedWords' : []
    }
}

function countMatchedLetters(guess, secertWord) {
    let matches = 0;
    const letterCount = {};

    for( let letter of guess.toLowerCase() ) {
        letterCount[letter] = letterCount[letter] + 1 || 1;
    }
    for( let letter of secertWord.toLowerCase() ) {
        if( letterCount[letter] ) {
            letterCount[letter] -= 1;
            matches += 1;
        }
    }

    return matches;
}

function addGuessedWord({username, guess}) {
    const matches = countMatchedLetters(guess, userWords[username]['secertWord']);
    const rounds = Object.keys(userWords[username]['guessedWords']).length + 1;
    userWords[username]['guessedWords'][guess] = 
    {
        matches: matches,
        rounds: rounds,
        used: false,
        isValid: true
    };
}

const userData = {
    usernames,
    userWords,
    addUsername,
    addGuessedWord,
    startNewGame
}

module.exports = userData;
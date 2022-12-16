const words = require('./words.js');
const userData = require('./user-data.js');

const gameWeb = {
    logIn: function() {
      return `
        <!doctype html>
        <html lang="en">
          <head>
            <title>Log In</title>
            <link rel="stylesheet" href="/style.css">
          </head>
          <body>
            <div class="login">
            <form action="/login" method="POST">
              <input name="username" class="username" placeholder="User Name">
              <button type="submit" class="button">Log In</button>
            </form>   
            </div>
          </body>
        </html>
       `;
    },

    logInFail: function() {
        return `
        <!doctype html>
        <html lang="en">
          <head>
            <title>Log In Fail</title>
            <link rel="stylesheet" href="/style.css">
          </head>
          <body>
            <div class="loginfail">
              <h1>Log In Fail</h1>
              <P>Please try to <a href="/">login</a> again</P>
            </div>
          </body>
        </html>
        `;
    },

    guessGame: function(username, guesses, guess) {
        return `
        <!doctype html>
        <html lang="en">
          <head>
            <title>Word Guessing Game</title>
            <link rel="stylesheet" href="/style.css">
          </head>
          <body>
            <div class="guessPage">
              <h1>Welcom ${username}! Let's Start to Guess the Secert Word.</h1>

              <div class="options">
                <form action="/logout" method="POST"><button type="submit" class="button">Log Out</button></form>
                <form action="/startNewGame" method="POST"><button type="submit" class="button">Start A new Game</buttom></form>
              </div>

              <div class="validWords">
                <p>The valid wordlist that you can make a guess: </p>
                ${gameWeb.validWords(words)}
              </div> 

              <div class="userInput">
                  <form action="/guess" method="POST">
                      <input name="guess" class="guess" value="" placeholder="Make A Guess Here" required/>
                      <button type="submit" class="button">Submit</button>
                  </form>
              </div>

              <div class="result">
                <h1>Result: ${gameWeb.result(guesses, guess)}</h1>
              </div> 

              <div class="usedWord">
                <p>The words that you have made a guess before: </p>
                ${gameWeb.usedWords(guesses)}
              </div>
            </div>
          </body>
        </html>
        `;
    },

    result: function(guesses, guess) {
      const guessedWords = guesses['guessedWords'];

      if(Object.keys(guessedWords).length === 0 || guess === "") {
        return `<p>No records yet</p>`
      }
      else {
      //const word = Object.keys(guessedWords)[Object.keys(guessedWords).length - 1];
      const matches = guessedWords[guess]['matches'];
      const rounds = guessedWords[guess]['rounds'];
      if(guessedWords[guess]['isValid'] === false) {
        delete guessedWords[guess];
        return `<p>The word that you entered is invalid, please try the rest valid words</p>`
      }
      else if(guessedWords[guess]['used'] === true) {
        return `<p>The word that you entered have been guessed, please try the rest valid words</p>`
      }
      //else if(matches === guesses['secertWord'].length) {
      else if(guess.toLowerCase() === guesses['secertWord']) {
        return `<p>Congratulations! Your guess is correct! you can start a new game.</p>`
      }
      else {
        return `<p>Round ${rounds}: ${guess} matches ${matches} letters with secret word!</p>`
      }
    }
    },

    usedWords: function(guesses) {
      const guessedWords = guesses['guessedWords'];
      if(Object.keys(guessedWords.length) === 0) {
        return `<p>You don't have guessed word yet</p>`
      }
      else if(guessedWords) {
        return `<ul class="List">` +
        Object.keys(guessedWords).map( word => `
          <li>
            <div class="wordList">
              <p>Round ${guessedWords[word]['rounds']}: ${word} matches ${guessedWords[word]['matches']} letters.</p>
            </div>
          </li>
        `).join('') +
        `</ul>`;
      }
    },

    validWords: function(words) {
      return `<ul class="List">` +
      Object.values(words).map( word => `
        <li>
          <div class="wordList">
            <p>${word}</p>
          </div>
        </li>
      `).join('') +
      `</ul>`;
    }
}

module.exports = gameWeb;
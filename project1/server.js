const express = require('express');
const app = express();
const PORT = 3000;
const cookieParser = require('cookie-parser');
const { v4: uuidv4 } = require('uuid');
const gameWeb = require('./game-web.js');
const words = require('./words.js');
const userData = require('./user-data.js');

app.use(express.static('./public'));
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

const sessions = {};

app.get('/', (req,res) => {
    const sid = req.cookies.sid;
    if(sid && sessions[sid]) {
        const username = sessions[sid].username;
        if(!userData[username]) {
            userData.addUsername({username:username, sid: sid});
        }
        
        let guess ="";
        res.send(gameWeb.guessGame(username, userData.userWords[username], guess));
        return;
    }
    res.send(gameWeb.logIn());
  });

  app.post('/login', (req,res) => {
    const username = req.body.username.trim();
    const validName = /^[0-9a-zA-Z]*$/;
    if(username.toLowerCase() === 'dog' || !username || !username.match(validName)){
      res.status(401).send(gameWeb.logInFail());
      return; 
    }
    const sid = uuidv4();
    sessions[sid] = {username}; 
    res.cookie('sid', sid);
    userData.addUsername({username:username, sid: sid});
    userData.startNewGame(username);
    res.redirect('/');
  });

  app.post('/guess',(req, res) => {
    const guess = req.body.guess.toLowerCase();
    const sid = req.cookies.sid;
    const username = sessions[sid].username;

    if(!guess) {
        res.send(gameWeb.guessGame(username, userData.userWords[username], guess));
    }
    else if(!words.includes(guess)) {
        userData.addGuessedWord({username, guess});
        userData.userWords[username]['guessedWords'][guess]["isValid"] = false;
        res.send(gameWeb.guessGame(username, userData.userWords[username], guess));
        console.log(userData.userWords[username]);
    }
    else if(userData.userWords[username]['guessedWords'][guess]) {
        userData.userWords[username]['guessedWords'][guess]["used"] = true;
        res.send(gameWeb.guessGame(username, userData.userWords[username], guess));
        console.log(userData.userWords[username]);
    }
    else {
        userData.addGuessedWord({username, guess});
        console.log(userData.userWords[username]);
        res.send(gameWeb.guessGame(username, userData.userWords[username], guess));
    }
  });

  app.post('/logout', (req, res) => {
    const sid = req.cookies.sid;
    delete sessions[sid];
    res.clearCookie('sid');
    res.redirect('/');
});

app.post('/startNewGame', (req, res) => {
    const sid = req.cookies.sid;
    if(sid && sessions[sid]) {
        const username = sessions[sid].username;
        userData.startNewGame(username);
        res.redirect('/');
    } else {
        res.send(gameWeb.logInFail());
    }
})

app.listen(PORT,() => console.log( `Listening on http://localhost:${PORT}`));
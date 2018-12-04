'use strict';

require('dotenv').config();
const express = require('express');
const app = express();
const fs = require('fs');
const https = require('https');
const http = require('http');
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const resize = require('./modules/resize');

const multer = require('multer');
const upload = multer({dest: 'public/kuvat/'});

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
// parse application/json
app.use(bodyParser.json());

app.use(express.static('public'));
app.use('/modules', express.static('node_modules'));

const db = require('./modules/database');
const connection = db.connect();

const insertToDB = (data, res, next) => {
  db.insert(data, connection, () => {
    next();
  });
};

passport.serializeUser((user, done) => {
  console.log('serialize: ' + user);
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

app.use(session({
  secret: 'keyboard LOL cat',
  resave: true,
  saveUninitialized: true,
  cookie: {secure: true},
}));

passport.use(new LocalStrategy(
    (username, password, done) => {
      console.log('Here we go: ' + username);
      let res = null;

      const doLogin = (username, password) => {
        return new Promise((resolve, reject) => {
          db.login([username, password], connection, (result) => {
            console.log('result', result.length);
            resolve(result);
          });
        });
      };

      return doLogin(username, password).then((res) => {
        if (res.length < 1) {
          console.log('undone');
          return done(null, false);
        } else {
          console.log('done');
          return done(null, {username: username});
        }
      });
    },
));

app.use(passport.initialize());
app.use(passport.session());

//ohjaa onnistunut login aloitussivulle
app.post('/login',
    passport.authenticate('local',
        {successRedirect: '/node/login.html', failureRedirect: '/node/'}));

//
app.post('/newuser', (req, res, next) => {
  console.log(req.body);
  next();
});

//kysy lupalistaa
app.use('/newuser', (req, res, next) => {
  console.log('body on', req.body);
  const data = [
    req.body[2],
  ];
  db.lupalista(data, connection, (results) => {
    req.custom = results;
    console.log(req.custom, 'custom');
    next();
  });
});

//tallenna tietokantaan
app.use('/newuser', (req, res, next) => {
  if (req.custom.length < 1) {
    res.send('{"status": "No email"}');
  } else {
    res.send('{"status": "email yes"}');
    const dataALL = [
      req.body[0],
      req.body[1],
      req.body[2],
      req.body[3],
    ];
    console.log(dataALL, 'dataAll');
    db.insert(dataALL, connection, next);
    next();
  }
});

app.use('/newuser', (req, res, next) => {
  const data = [
    req.body[2],
  ];
  db.update(data, connection, (results) => {
    req.custom1 = results;
    console.log(req.custom1, 'custom1');
    next();
  });
});

//tallenna kuva
app.use('/kuvaupload', upload.single('photo'),
    (req, res, next) => {
      console.log('päästiin tänne1');
      next();
    });

// create thumbnail
app.use('/kuvaupload', (req, res, next) => {
  resize.doResize(req.file.path, 300,
      './public/thumbs/' + req.file.filename + '_thumb').then(() => {
    console.log('päästiin tänne2');
    next();
  });
});

app.use('/kuvaupload', (req, res, next) => {
  const data1 = [
    'kuvat/' + req.file.filename,
    'thumbs/' + req.file.filename + '_thumb',
    req.body.nimi,
    req.body.saveltaja,
    req.body.sanoittaja,
    req.body.sovittaja,
    req.body.kuvaus,
  ];
  console.log(data1, 'uploads');
  db.insertKuva(data1, connection, next);
  next();
});

app.use('/kuvaupload', (req, res) => {
  res.send('{"status": "insert OK"}');
});

app.set('trust proxy');
const sslkey = fs.readFileSync('/etc/pki/tls/private/ca.key');
const sslcert = fs.readFileSync('/etc/pki/tls/certs/ca.crt');
const options = {
  key: sslkey,
  cert: sslcert,
};

app.get('/', (req, res) => {
  if (req.secure) {
    console.log('req.user', req.user);
    if (req.user !== undefined) res.send('Hello ' + req.user.username);
    else res.redirect(301, './login.html');
  }
  else res.send('hello not secure?');
});

//app.listen(8000);
http.createServer((req, res) => {
  const redir = 'https://' + req.headers.host + '/node' + req.url;
  console.log('redir', redir);
  res.writeHead(301, {'Location': redir});
  res.end();
}).listen(8000);
https.createServer(options, app).listen(3000);
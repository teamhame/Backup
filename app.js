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
const cookieParser = require('cookie-parser');

const multer = require('multer');
const uploadkuva = multer({dest: 'public/kuvat/'});
const uploadaani = multer({dest: 'public/aani/'});

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
// parse application/json
app.use(bodyParser.json());

app.use(express.static('public'));
app.use('/modules', express.static('node_modules'));

const db = require('./modules/database');
const connection = db.connect();

app.use(cookieParser());

const insertToDB = (data, res, next) => {
  db.insert(data, connection, () => {
    next();
  });
};

const loggedIn = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.send('{"error": "Not logged in!"}');
  }
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

app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('./login.html');
});

passport.use(new LocalStrategy(
    (username, password, done) => {
      console.log('Here we go: ' + username);
      let res = null;

      const doLogin = (username, password) => {
        return new Promise((resolve, reject) => {
          db.login([username, password], connection, (result) => {
            console.log('result', result.length);
            resolve(result);

            //const dataID = result[0].kayttajaId;
          });
        });
      };

      return doLogin(username, password).then((res) => {
        if (res.length < 1) {
          console.log('undone');
          return done(null, false);
        } else {
          console.log('done');
          res[0].kayttajaSalasana = ''; // remove password from user's data
          return done(null, res[0]);
        }
      });
    },
));

app.use(passport.initialize());
app.use(passport.session());

//ohjaa onnistunut login aloitussivulle
/*app.post('/login',
    passport.authenticate('local',
        {
          successRedirect: '/node/kuvanlisays.html',
          failureRedirect: '/node/',
        }));*/

app.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) { // if login not happening
      return res.redirect('/node/login.html');
    }
    req.logIn(user, function(err) {
      // send userID as cookie:
      res.cookie('userID', req.user.kayttajaId);
      if (err) {
        return next(err);
      }
      return res.redirect('/node/kuvanlisays.html'); // if login succesful
    });
  })(req, res, next);
});

//
// -----------NEWUSER JUTUT!!!--------------
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

//
//----------------KUVAN TALLENNUS--------------------
//

//tallenna kuva
app.use('/kuvaupload', uploadkuva.single('photo'),
    (req, res, next) => {
      console.log('päästiin tänne1');
      next();
    });

// create thumbnail
app.use('/kuvaupload', (req, res, next) => {
  resize.doResize(req.file.path, 300,
      './public/thumbs/' + req.file.filename + '_thumb').then(() => {
    console.log('päästiin tänne kuva');
    next();
  });
});

app.use('/kuvaupload', (req, res, next) => {
  console.log('upload käyttäjä', req.user);
  const data1 = [
    'kuvat/' + req.file.filename,
    'thumbs/' + req.file.filename + '_thumb',
    req.body.nimi,
    req.body.saveltaja,
    req.body.sanoittaja,
    req.body.sovittaja,
    req.body.kuvaus,
    req.user.kayttajaId,
  ];
  console.log(data1, 'uploads');
  db.insertKuva(data1, connection, next);
  next();
});

app.use('/kuvaupload', (req, res) => {
  res.send('{"status": "kuva OK"}');
});

//
//-------------ÄÄNI TALLENNUS------------------
//

app.use('/aaniupload', uploadaani.single('sound'),
    (req, res, next) => {
      console.log('päästiin tänne ääni');
      next();
    });

app.use('/aaniupload', (req, res, next) => {
  const data2 = [
    'aani/' + req.file.filename,
    req.body.nimi,
    req.body.esittaja,
    req.body.saveltaja,
    req.body.sanoittaja,
    req.body.sovittaja,
    req.body.kuvaus,
    req.user.kayttajaId,
  ];
  console.log(data2, 'uploads');
  db.insertAani(data2, connection, next);
  next();
});

app.use('/aaniupload', (req, res) => {
  res.send('{"status": "aani OK"}');
});

//
//------------VIDEO URL TALLENNUS--------------------
//
app.post('/videoupload', (req, res, next) => {
  console.log(req.body, 'data3');
  next();
});

app.use('/videoupload', (req, res, next) => {
  console.log('päästiin tänne video');
  next();
});

app.use('/videoupload', (req, res, next) => {
  const data3 = [
    req.body[1],
    req.body[0],
    req.body[2],
    req.user.kayttajaId
  ];
  console.log(data3, 'data3');
  db.insertVideo(data3, connection, next);
  next();
});

app.use('/videoupload', (req, res) => {
  res.send('{"status": "video OK"}');
});

//
//-----------------------------------------------------
//

app.get('/logged', (req, res) => {
  if (req.user) {
    console.log(req.user, 'täällä');
    res.send('{"status": "OK"}');
  } else {
    res.send('{"status": "NOT OK"}');
  }
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
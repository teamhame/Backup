'use strict';
const mysql = require('mysql2');

const connect = () => {
  // create the connection to database
  const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
  });
  return connection;
};
const login = (data, connection, callback) => {
  connection.execute(
      'SELECT * FROM Kayttaja WHERE kayttajaEmail = ? AND kayttajaSalasana = ?;',
      data, (err, results, fields) => {
        console.log(results, 'id');
        console.log(err);
        callback(results);
      },
  );
};

const select = (connection, callback, res) => {
  // simple query
  connection.query(
      'SELECT * FROM bc_media',
      (err, results, fields) => {
        // console.log(results); // results contains rows returned by server
        // console.log(fields); // fields contains extra meta data about results, if available
        console.log(err);
        callback(results, res);
      },
  );
};

//vertaa uuden käyttäjän arvoja lupalistaan
const lupalista = (data, connection, callback) => {
  console.log('data on', data);
  connection.query(
      'SELECT lupalistaEmail FROM Lupalista WHERE lupalistaVst <= CURRENT_DATE AND lupalistaVet >= CURRENT_DATE AND lupalistaKaytetty = 0 AND lupalistaEmail =?;',
      data,
      (err, results, field) => {
        console.log('results ', results);
        console.log('error ' + err);
        callback(results);
      },
  );
};
/*
if(lupalista.callback(eiok)){
  console.log('error');
} else {
  const lupakaytetty = (data, connection, callback) => {
    connection.execute(
        'UPDATE Lupalista SET lupalistaKaytetty = 1 WHERE lupalistaKaytetty = 0 AND lupalistaEmail = (?) AND lupalistaVst <= ' +
        date() + ' AND lupalistVet >= ' + date() + ' ;',
        data,
    );
  };
};
*/

const insert = (data, connection, callback) => {
  // simple query
  connection.execute(
      'INSERT INTO Kayttaja (kayttajaEtunimi, kayttajaSukunimi, kayttajaEmail, kayttajaSalasana) VALUES (?, ?, ?, ?);',
      data,
      (err, results, fields) => {
        // console.log(results); // results contains rows returned by server
        // console.log(fields); // fields contains extra meta data about results, if available
        console.log(err, ' database insert console log');
        callback();
      },
  );
};

const insertKuva = (data, connection, callback) => {
  connection.execute(
      'INSERT INTO Media (mediaUrl, mediaThumb, mediaOriginalname, mediaSize, mediaMimetype, mediaNimi, mediaSaveltaja, mediaSanoittaja, mediaSovittaja, mediaKuvaus, kayttajaId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);',
      data,
      (err, results, fields) => {

        console.log(err, ' database insertKuva console log');
        callback();
      },
  );
};

const insertAani = (data, connection, callback) => {
  connection.execute(
      'INSERT INTO Media (mediaUrl, mediaOriginalname, mediaSize, mediaMimetype, mediaNimi, mediaEsittaja, mediaSaveltaja, mediaSanoittaja, mediaSovittaja, mediaKuvaus, kayttajaId ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);',
      data,
      (err, results, fields) => {

        console.log(err, ' database insertÄäni console log');
        callback();
      },
  );
};

const insertVideo = (data, connection, callback) => {
  connection.execute(
      'INSERT INTO Video (videoUrl, videoNimi, videoKuvaus, kayttajaId) VALUES (?, ?, ?, ?);',
      data,
      (err, results, fields) => {

        console.log(err, ' database insertVideo console log');
        callback();
      },
  );
};

const insertTapahtuma = (data, connection, callback) => {
  connection.execute(
      'INSERT INTO Tapahtuma (tapahtumaNimi, tapahtumaIlmoAlkaa, tapahtumaIlmoLoppuu, tapahtumaAlkaa, tapahtumaLoppuu, tapahtumaKuvaus) VALUES (?, NOW(), ?, ?, ?, ?);',
      data,
      (err, results, fields) => {

        console.log(err, ' database insertTapahtuma console log');
        callback();
      },
  );
};

const insertTiedote = (data, connection, callback) => {
  connection.execute(
      'INSERT INTO Tiedote (tiedoteOtsikko, tiedoteTeksti, tiedoteAikaleima, kayttajaId) VALUES (?, ?, NOW(), ?);',
      data,
      (err, results, fields) => {
        console.log(err, ' database insertTiedote console log');
        callback();
      },
  );
};

//lähetä kommentti tietokantaan
const insertKommentti = (data, connection, callback) => {
  connection.execute(
      'INSERT INTO Kommentti (kommenttiTeksti, kommenttiAikaleima, keskusteluId, kayttajaId) VALUES (?, NOW(), 1, ?);',
      data,
      (err, results) => {
        console.log(err, ' database insertkommentti console log');
        callback();
      },
  );
};

//kommenttien nouto
const selectKommentit = (connection, callback) => {
  // simple query
  connection.query(
      'SELECT Kayttaja.kayttajaEtunimi, Kayttaja.kayttajaSukunimi, Kommentti.kommenttiAikaleima, Kommentti.kommenttiTeksti\n' +
      'FROM Kayttaja, Kommentti\n' +
      'WHERE Kommentti.kayttajaId = Kayttaja.kayttajaId\n' +
      'ORDER BY Kommentti.kommenttiAikaleima DESC;',
      (err, results, fields) => {
        console.log(err);
        callback(results);
      },
  );
};

//tiedostojen nouto tietokannasta
const selectHaku = (data, connection, callback) => {
  // simple query
  connection.query(
      'SELECT * FROM Media WHERE mediaNimi LIKE ?;',
      data,
      (err, results, fields) => {
        console.log(err);
        callback(results);
      },
  );
};


//videoiden nouto tietokannasta
const selectVideoHaku = (data, connection, callback) => {
  // simple query
  // 101218 klo 1057 Ville muuttanut .query:n .execute:ksi => ei toiminut
  // yritetty yhdistää ?-lausetta ja LIKE-lausetta;
  connection.execute(
      'SELECT * FROM Video WHERE videoNimi LIKE ?;',
      data,
      (err, results, fields) => {
        console.log(err);
        callback(results);
      },
  );
};

const haeTykkays = (data, connection, callback) =>{
  connection.query(
      'SELECT kayttajaId, mediaId, tykkays FROM TykkaaMediasta WHERE mediaId = ? AND kayttajaId = ?;',
      data,
      (err, results, fields)=>{
        console.log(err, 'database haeTykkäys console log');
        callback(results);
      },
  );
};

const selectHakuTykkays = (data, connection, callback)=> {
  connection.query(
      'SELECT COUNT(*) FROM TykkaaMediasta WHERE mediaId = ?',
      data,
      (err, results, fields) => {
        console.log(err);
        callback(results);
      },
  );
};


//tykkäys
const insertTykkays = (data, connection, callback) =>{
  connection.execute(
      'INSERT INTO TykkaaMediasta (mediaId, kayttajaId) VALUE (? , ?);',
      data,
      (err, results, fields) => {
        console.log(err, ' database insertTykkäys console log');
        callback();
      },
  );
};

const  deleteTykkays =(data, connection, callback)=>{
  connection.execute(
      'DELETE FROM TykkaaMediasta WHERE mediaId = ? AND kayttajaId = ?;',
      data,
      (err, results, fields) => {
        console.log(err, ' database deleteTykkäys console log');
        callback();
      },
      );
};

//------------------------------------------------------------------------

/*
const selectTapahtumatNostatus = (connection, callback) => {
  // simple query
  connection.query(
      'SELECT kayttajaId, kommenttiAikaleima, kommenttiTeksti FROM Kommentti',
      (err, results, fields) => {
        console.log(err);
        callback(results);
      },
  );
};
// TÄMÄ ON VIELÄ KESKEN!!!!!!!!!!!!!
*/
//-------------------------------------------------------------------------
const update = (data, connection) => {
  // simple query
  return connection.execute(
      'UPDATE Lupalista SET lupalistaKaytetty = 1 WHERE lupalistaEmail = ? ;',
      data,
      (err, results, fields) => {
        // console.log(results); // results contains rows returned by server
        // console.log(fields); // fields contains extra meta data about results, if available
        console.log(err, ' database email update console log');
      },
  );
};

module.exports = {
  connect: connect,
  select: select,
  insert: insert,
  login: login,
  update: update,
  lupalista: lupalista,
  insertKuva: insertKuva,
  insertAani: insertAani,
  insertVideo: insertVideo,
  insertTiedote: insertTiedote,
  insertTapahtuma: insertTapahtuma,
  insertKommentti: insertKommentti,
  selectKommentit: selectKommentit,
  selectHaku: selectHaku,
  selectVideoHaku: selectVideoHaku,
  insertTykkays: insertTykkays,
  haeTykkays: haeTykkays,
  deleteTykkays: deleteTykkays,
  selectHakuTykkays: selectHakuTykkays,
};
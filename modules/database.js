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
        console.log(results);
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
      'INSERT INTO Media (mediaUrl, mediaThumb , mediaNimi, mediaSaveltaja, mediaSanoittaja, mediaSovittaja, mediaKuvaus) VALUES (?, ?, ?, ?, ?, ?, ?);',
      data,
      (err, results, fields) => {

        console.log(err, ' database insertKuva console log');
        callback();
      },
  );

};

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
};
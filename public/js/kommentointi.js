'use strict';

const lomakeKommentti = document.querySelector('#formKommentti');

//const moment = require('moment');
console.log(document.cookie);
const userID = document.cookie.split('=')[1];
console.log('userID is', userID);

document.addEventListener('DOMContentLoaded', function() {
  fetch('./logged').then((response) => {
    return response.json();
  }).then((json) => {
    console.log(json);
    respologged(json);
  });
  const respologged = (testi) => {
    if (testi.status === "OK"){
      console.log("ok");
    }else {
      console.log('not ok');
      function timeout(param) {
        console.log(param);
        window.location.replace('HTTPS://10.114.32.171/node/index.html?page='+encodeURIComponent(window.location));
      }
      setTimeout(timeout, 5, 'moi');

    }

  }
}, false);

function alkutulostus(s) {
  const kommenttienTulostus = document.querySelector('#vanhatKommentit');
  console.log('tulosta vanhat kommentit');

  for(let i=0; i<s.length; i++){
    let pikkudiv = document.createElement('li');//div vaihdettu

    let postaaja = document.createElement('h6');
    postaaja.innerHTML = f[i].kayttajaId;

    let leima = document.createElement('p');
    leima.innerHTML = f[i].kommenttiAikaleima;

    let teksti = document.createElement('p');
    teksti.innerHTML = f[i].kommenttiTeksti;

    pikkudiv.appendChild(postaaja);
    pikkudiv.appendChild(leima);
    pikkudiv.appendChild(teksti);

    kommenttienTulostus.appendChild(pikkudiv);
  }
}
/** const vanhatKommentit = document.querySelector('#vanhatKommentit');
 vanhatKommentit.innerHTML = '';

 for (let i = 0; i < f.length; i++) {

    console.log(f[i]);

    let pikkudiv = document.createElement('li');//div vaihdettu

    let postaaja = document.createElement('h6');
    postaaja.innerHTML = f[i].kayttajaId;

    let leima = document.createElement('p');
    leima.innerHTML = f[i].kommenttiAikaleima;
    //console.log(moment().format());


    let teksti = document.createElement('p');
    teksti.innerHTML = f[i].kommenttiTeksti;

    pikkudiv.appendChild(postaaja);
    pikkudiv.appendChild(leima);
    pikkudiv.appendChild(teksti);

    vanhatKommentit.appendChild(pikkudiv);*/









const tulostavanhatKommentit = (evtKommentti) => {
  evtKommentti.preventDefault();

  const data6 = JSON.stringify([
    lomakeKommentti.querySelector('input[name="kommentti"]').value,
  ]);
  const asetukset = {
    method: 'post',
    body: data6,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
  };

//kommentin lähetys tietokantaan
  fetch('./kommenttiupload', asetukset).then((response) => {
    return response.json();
  }).then((json) => {
   // console.log(json);
    alkutulostus(json);
    console.log('vanhat valmis');
  });

};


//poista looppi ja printtaa vain viimeinen
function tulostauusikommentti(f) {
  console.log('löysit minut');

  const vanhatKommentit = document.querySelector('#vanhatKommentit');
  vanhatKommentit.innerHTML = '';

  for (let i = 0; i < f.length; i++) {

    console.log(f[i]);

    let pikkudiv = document.createElement('li');//div vaihdettu

    let postaaja = document.createElement('h6');
    postaaja.innerHTML = f[i].kayttajaId;

    let leima = document.createElement('p');
    leima.innerHTML = f[i].kommenttiAikaleima;
    //console.log(moment().format());


    let teksti = document.createElement('p');
    teksti.innerHTML = f[i].kommenttiTeksti;

    pikkudiv.appendChild(postaaja);
    pikkudiv.appendChild(leima);
    pikkudiv.appendChild(teksti);

    vanhatKommentit.appendChild(pikkudiv);

  }

};



/*-----------------------------------------------------------------------------------------*/
//funktio kommenttien näyttämiseen: vanha ja toimii
function tulosta(f) {

  console.log('löysit minut');

  const vanhatKommentit = document.querySelector('#vanhatKommentit');
  vanhatKommentit.innerHTML = '';

  for (let i = 0; i < f.length; i++) {

    console.log(f[i]);

    let pikkudiv = document.createElement('li');//div vaihdettu

    let postaaja = document.createElement('h6');
    postaaja.innerHTML = f[i].kayttajaId;

    let leima = document.createElement('p');
    leima.innerHTML = f[i].kommenttiAikaleima;
    //console.log(moment().format());


    let teksti = document.createElement('p');
    teksti.innerHTML = f[i].kommenttiTeksti;

    pikkudiv.appendChild(postaaja);
    pikkudiv.appendChild(leima);
    pikkudiv.appendChild(teksti);

    vanhatKommentit.appendChild(pikkudiv);

  }
}

const submitKommentti = (evtKommentti) => {
  evtKommentti.preventDefault();

  const data6 = JSON.stringify([
    lomakeKommentti.querySelector('input[name="kommentti"]').value,
  ]);
  const asetukset = {
    method: 'post',
    body: data6,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
  };
//kommentin lähetys tietokantaan
  fetch('./kommenttiupload', asetukset).then((response) => {
    return response.json();
  }).then((json) => {
    console.log(json);
    tulostauusikommentti(json);
    //tulosta(json); vanha ja toimii
    // tyhjennä kenttä
    lomakeKommentti.querySelector('input[name="kommentti"]').value = '';
    console.log('valmis');
  });

  const respovkommentti = (testi) => {

    if (testi.status === 'kommentti OK') {
      alert('Kommentin Upload onnistui!');
    }
    else {
      alert('Kommentin Upload epäonnistui!');
    }
  };
};

document.addEventListener('DOMContentLoaded', tulostavanhatKommentit);
lomakeKommentti.addEventListener('submit', submitKommentti);
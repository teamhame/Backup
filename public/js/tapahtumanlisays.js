'use strict';

const lomakeTapahtuma = document.querySelector('#formTapahtuma');
const lomakeTiedote = document.querySelector('#formTiedote');
const alkamisaika = document.querySelector('#alku');
const paattumisaika = document.querySelector('#loppu');

const tapahtumanappi = document.querySelector('#tapahtumanappi');
const tiedotenappi = document.querySelector('#tiedotenappi');

lomakeTapahtuma.style.display = 'none';
lomakeTiedote.style.display = 'none';


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


const lahetaTapahtuma = (evtTapahtuma) => {
  evtTapahtuma.preventDefault();
  // poimitaan formista alkamisajat ja päättymisajat
  const alkaapvm = lomakeTapahtuma.querySelector(
      'input[name="Alkaapvm"]').value;
  const alkaaklo = lomakeTapahtuma.querySelector(
      'input[name="Alkaaklo"]').value;
  const loppuupvm = lomakeTapahtuma.querySelector(
      'input[name="Loppuupvm"]').value;
  const loppuuklo = lomakeTapahtuma.querySelector(
      'input[name="Loppuuklo"]').value;

// splitataan ne arrayksi
  const ap = alkaapvm.split('-');
  const ak = alkaaklo.split(':');
  const lp = loppuupvm.split('-');
  const lk = loppuuklo.split(':');

// luodaan uudet aika-objektit (Date-object), johon laitetaan arvoiksi edellisen indeksejä
  const d1 = new Date(ap[0], ap[1], ap[2], ak[0], ak[1]);
  const d2 = new Date(lp[0], lp[1], lp[2], lk[0], lk[1]);

  const alkaaDatetime = alkaapvm + ' ' + alkaaklo;
  const loppuuDatetime = loppuupvm + ' ' + loppuuklo;

  if (d1 >= d2) {
    alert('INVALID DATES!!!');
  } else {
    alert('yay!');
    const data4 = JSON.stringify([
      lomakeTapahtuma.querySelector('input[name="Nimi"]').value,
      alkaaDatetime,
      loppuuDatetime,
      lomakeTapahtuma.querySelector('textarea[name="Kuvaus"]').value,
    ]);
    const asetukset = {
      method: 'post',
      body: data4,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    };
    fetch('./videoupload', asetukset).then((response) => {
      return response.json();
    }).then((json) => {
      console.log('tämä ', json);
      respotapahtuma(json);
    });
  }

};
const respotapahtuma = (testi) => {

  if (testi.status === 'Tapahtuman lisäys valmis') {
    alert('Tapahtuman Upload onnistui!');
  }
  else {
    alert('Tapahtuman Upload epäonnistui!');
  }
};

//****************************************************
//----------------------------------------------------
//****************************************************

const lahetaTiedote = (evtTiedote) => {
  evtTiedote.preventDefault();
  const data5 = JSON.stringify([
    lomakeTiedote.querySelector('input[name="Otsikko"]').value,
    lomakeTiedote.querySelector('textarea[name="Teksti"]').value,
  ]);
  const asetukset = {
    method: 'post',
    body: data5,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
  };

  fetch('./uploadtiedote', asetukset).then((response) => {
    return response.json();
  }).then((json) => {
    console.log('tämä ', json);
    alert('voitit pelin!!!!!!!!!!!!!!!!!!!!!!!!!!');
    //respotapahtuma(json);
  });


};

//****************************************************
//----------------------------------------------------
//****************************************************

const showTapahtuma = (evt1) =>{
  tapahtumanappi.style.display='none';
  tiedotenappi.style.display='block';
  lomakeTapahtuma.style.display = 'flex';
  lomakeTiedote.style.display = 'none';
};


const showTiedote = (evt2)=>{
  tapahtumanappi.style.display='block';
  tiedotenappi.style.display='none';
  lomakeTapahtuma.style.display = 'none';
  lomakeTiedote.style.display = 'flex';
};



//
//-----------------------------------------------------
//

tapahtumanappi.addEventListener('click', showTapahtuma);
tiedotenappi.addEventListener('click', showTiedote);
lomakeTapahtuma.addEventListener('submit', lahetaTapahtuma);
lomakeTiedote.addEventListener('submit', lahetaTiedote);

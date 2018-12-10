'use strict';

const lomakeTapahtuma = document.querySelector('#formTapahtuma');
const alkamisaika = document.querySelector('#alku');
const paattumisaika = document.querySelector('#loppu');

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
      respovideo(json);
    });
  }
  ;
};
const respovideo = (testi) => {

  if (testi.status === 'video OK') {
    alert('Videon Upload onnistui!');
  }
  else {
    alert('Videon Upload epäonnistui!');
  }
};

//
//-----------------------------------------------------
//

lomakeTapahtuma.addEventListener('submit', lahetaTapahtuma);

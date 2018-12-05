'use strict';

const lomakeTapahtuma = document.querySelector('#formTapahtuma');
const alkamisaika = document.querySelector('#alku');
const paattumisaika = document.querySelector('#loppu');



const lahetaTapahtuma = (evtTapahtuma) => {
  evtTapahtuma.preventDefault();
  if (alkamisaika.value() >= paattumisaika.value()) {
    alert('Alkamispäivä ei voi olla loppumispäivän jälkeen!');
  }
  else {
    const data4 = JSON.stringify([
      lomakeTapahtuma.querySelector('input[name="Nimi"]').value,
      lomakeTapahtuma.querySelector('date[name="Alkaapvm"]').value,
      lomakeTapahtuma.querySelector('date[name="Loppuupvm"]').value,
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
  const respovideo = (testi) => {

    if (testi.status === 'video OK') {
      alert('Videon Upload onnistui!');
    }
    else {
      alert('Videon Upload epäonnistui!');
    }
  };
};

//
//-----------------------------------------------------
//


lomakeTapahtuma.addEventListener('submit', lahetaTapahtuma);

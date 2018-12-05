'use strict';
const lomakeKuva = document.querySelector('#formKuva');
const kuvafrm = document.querySelector('#formKuva');

const lomakeAani = document.querySelector('#formAani');
const aanifrm = document.querySelector('#formAani');

const lomakeVideo = document.querySelector('#formVideo');

const lahetaKuva = (evtKuva) => {
  evtKuva.preventDefault();
  const fd = new FormData(kuvafrm);
  const settings = {
    method: 'post',
    body: fd,
  };

  fetch('./kuvaupload', settings).then((response) => {
    return response.json();
  }).then((json) => {
    console.log(json);
  });
};

const lahetaAani = (evtAani) => {
  evtAani.preventDefault();
  const fd = new FormData(aanifrm);
  const settings = {
    method: 'post',
    body: fd,
  };

  fetch('./aaniupload', settings).then((response) => {
    return response.json();
  }).then((json) => {
    console.log(json);
  });
};

const lahetaVideo = (evtVideo) => {
  evtVideo.preventDefault();
  const data3 = JSON.stringify([
    lomakeVideo.querySelector('input[name="nimi"]').value,
    lomakeVideo.querySelector('input[name="url"]').value,
    lomakeVideo.querySelector('textarea[name="kuvaus"]').value,
  ]);
  const asetukset = {
    method: 'post',
    body: data3,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
  };
  fetch('./videoupload', asetukset).then((response) => {
    return response.json();
  }).then((json) => {
    console.log('tämä ', json);
  });
};

lomakeVideo.addEventListener('submit', lahetaVideo);
lomakeAani.addEventListener('submit', lahetaAani);
lomakeKuva.addEventListener('submit', lahetaKuva);
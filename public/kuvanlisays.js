'use strict';
const lomakeKuva = document.querySelector('#formKuva');
const kuvafrm = document.querySelector('#formKuva');

const lomakeAani = document.querySelector('#formAani');
const aanifrm = document.querySelector('#formAani');


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


lomakeAani.addEventListener('submit', lahetaAani);
lomakeKuva.addEventListener('submit', lahetaKuva);
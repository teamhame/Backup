'use strict';
const lomakeKuva = document.querySelector('#formKuva');

const kuvafrm = document.querySelector('#formKuva');

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

lomakeKuva.addEventListener('submit', lahetaKuva);
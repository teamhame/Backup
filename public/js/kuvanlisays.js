'use strict';
const lomakeKuva = document.querySelector('#formKuva');
const kuvafrm = document.querySelector('#formKuva');
const lomakeAani = document.querySelector('#formAani');
const aanifrm = document.querySelector('#formAani');
const lomakeVideo = document.querySelector('#formVideo');

const kuvanappi = document.querySelector('#buttonKuva');
const aaninappi = document.querySelector('#buttonAani');
const videonappi = document.querySelector('#buttonVideo');

lomakeKuva.style.display = 'none';
lomakeAani.style.display = 'none';
lomakeVideo.style.display = 'none';

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

//
//-------------Nappien näyttö
//
const showKuva = (evt1) => {
  lomakeKuva.style.display = 'flex';
  kuvanappi.style.display = 'none';
lomakeAani.style.display = 'none';
lomakeVideo.style.display = 'none';
videonappi.style.display = 'block';
aaninappi.style.display = 'block';
};
const showAani = (evt1) => {
  lomakeAani.style.display = 'flex';
  aaninappi.style.display = 'none';
  lomakeVideo.style.display = 'none';
  lomakeKuva.style.display = 'none';
  kuvanappi.style.display = 'block';
  videonappi.style.display = 'block';
};
const showVideo = (evt1) => {
  lomakeVideo.style.display = 'flex';
  videonappi.style.display = 'none';
  lomakeKuva.style.display = 'none';
  lomakeAani.style.display = 'none';
  kuvanappi.style.display = 'block';
  aaninappi.style.display = 'block';
};

//
//--------------Kuvan lähetys----------------------------
//

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
    respokuva(json);
  });
};
const respokuva = (testi) => {
  if (testi.status === 'kuva OK') {
    alert('Kuvan Upload onnistui!');
  }
  else {
    alert('Kuvan Upload epäonnistui!');
  }
};

//
//--------------Äänen lähetys-----------------------------
//

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
    respoaani(json);
  });
};
const respoaani = (testi) => {

  if (testi.status === 'aani OK') {
    alert('Äänen Upload onnistui!');
  }
  else {
    alert('Äänen Upload epäonnistui!');
  }
};

//
//----------------Videon lähetys-------------------
//

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
    respovideo(json);
  });
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
kuvanappi.addEventListener('click', showKuva);
aaninappi.addEventListener('click', showAani);
videonappi.addEventListener('click', showVideo);

lomakeVideo.addEventListener('submit', lahetaVideo);
lomakeAani.addEventListener('submit', lahetaAani);
lomakeKuva.addEventListener('submit', lahetaKuva);
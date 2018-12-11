'use strict';
//let hakutulos = '';
const lomakeVideoHaku = document.querySelector('#formVideoHaku');

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

const lahetaVideoHaku = (evtVideoHaku) => {
  evtVideoHaku.preventDefault();
  const data8 = JSON.stringify([
    lomakeVideoHaku.querySelector('input[name="haku"]').value,
  ]);
  const asetukset = {
    method: 'post',
    body: data8,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
  };

  fetch('./uploadvideohaku', asetukset).then((response) => {
    return response.json();
  }).then((videot) => {
    const videoholder = document.querySelector('#showVideo');
    console.log('haku upload ', videot);
    try {
      videoholder.innerHTML = '';
    } catch (err) {
      console.log(err);
    }
    for (let item of videot) {
      const divK = document.createElement('div');
      const a = document.createElement('a');
      const h = document.createElement('h1');
      const url = item.videoUrl;
      const nimi = item.videoNimi;

      a.setAttribute('href',url);

      a.innerHTML = url;
      h.innerHTML = nimi;

      videoholder.appendChild(divK);
      divK.appendChild(h);
      divK.appendChild(a);

    }
  });

};

lomakeVideoHaku.addEventListener('submit', lahetaVideoHaku);
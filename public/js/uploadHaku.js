'use strict';
//let hakutulos = null;
const lomakeHaku = document.querySelector('#formHaku');
//const holder = document.querySelector('#holder');
const button = document.querySelector('#like');
const userID = document.cookie.split('=')[1];
const loginHaku = localStorage.getItem('haku');

console.log('userID is', userID);

const lahetaHaku = (evtHaku) => {
  document.querySelector('#modal1').classList.add('hidden');
  document.querySelector('#modal1 img').src = '';
  try {
    evtHaku.preventDefault();
  } catch (e) {

  }
  const data7 = JSON.stringify([
    lomakeHaku.querySelector('input[name="haku"]').value,
  ]);
  const asetukset = {
    method: 'post',
    body: data7,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
  };
  fetch('./uploadhaku', asetukset).then((response) => {
    return response.json();
  }).then((kuvat) => {
    const holder = document.querySelector('#holder');
    console.log('haku upload ', kuvat);

    try {
      holder.innerHTML = '';
    } catch (err) {
      console.log(err);
    }
    let x = 1;
    for (let item of kuvat) {

      const divK = document.createElement('div');
      //const p = document.createElement('p');

      if (item.mediaMimetype.includes('image')) {
        const img = document.createElement('img');
        const h = document.createElement('header');
        img.src = item.mediaThumb;
        h.innerHTML = item.mediaNimi;
        divK.appendChild(img);
        divK.appendChild(h);

        img.addEventListener('click', () => {
          // tähän
          document.querySelector('#modal1 #Nimi').innerHTML = '';
          document.querySelector('#modal1 #Saveltaja').innerHTML = '';
          document.querySelector('#modal1 #Sanoittaja').innerHTML = '';
          document.querySelector('#modal1 #Sovittaja').innerHTML = '';
          document.querySelector('#modal1 #Kuvaus').innerHTML = '';
          document.querySelector('#modal1').classList.remove('hidden');
          document.querySelector('#modal1 img').src = item.mediaUrl;
          document.querySelector('#modal1 a').href = item.mediaUrl;

          try {
            if (item.mediaNimi.length > 0) {
              document.querySelector('#modal1 #Nimi').innerHTML = 'NIMI: ' +
                  item.mediaNimi;
            }
            if (item.mediaSaveltaja.length > 0) {
              document.querySelector(
                  '#modal1 #Saveltaja').innerHTML = 'SÄVELTÄJÄ: ' +
                  item.mediaSaveltaja;
            }
            if (item.mediaSanoittaja.length > 0) {
              document.querySelector(
                  '#modal1 #Sanoittaja').innerHTML = 'SANOITTAJA: ' +
                  item.mediaSanoittaja;
            }
            if (item.mediaSovittaja.length > 0) {
              document.querySelector(
                  '#modal1 #Sovittaja').innerHTML = 'SOVITTAJA: ' +
                  item.mediaSovittaja;
            }
            if (item.mediaKuvaus.length > 0) {
              document.querySelector('#modal1 #Kuvaus').innerHTML = 'KUVAUS: ' +
                  item.mediaKuvaus;
            }

          } catch (err) {
            console.log(err);
          }

          // const tykkays = document.createElement('p');
          document.querySelector('#like').addEventListener('click', () => {
            const data11 = JSON.stringify([
              item.mediaId,
            ]);
            const asetukset = {
              method: 'post',
              body: data11,
              headers: {
                'Content-Type': 'application/json; charset=utf-8',
              },
            };
            fetch('./tykkays', asetukset).then((response) => {
              return response.json();
            }).then((json) => {
              console.log('tykkäys ', json);
              tykkaatesti(json);

            });
            const tykkaatesti = (testi) => {
              //console.log(testi);
              //console.log(testi.testi1);
              if (testi.status === 'jo tykätty') {
                alert('Tykkäys poistettu!');
                //console.log(typeof(testi[0]));
                //tykkays.innerHTML = 'Tykkäysten määrä';
                //document.querySelector('#modal1').appendChild(tykkays);
              }
              else {
                alert('Tykkäsit tästä!');
                //tykkays.innerHTML = 'Tykkäysten määrä' + testi.testi1;
                //document.querySelector('#modal1').appendChild(tykkays);
              }
            };
          });
          document.querySelector('#x').addEventListener('click', () => {
            document.querySelector('#modal1').classList.add('hidden');
            document.querySelector('#modal1 img').src = '';
            document.querySelector('#modal1 #Nimi').innerHTML = '';
            document.querySelector('#modal1 #Saveltaja').innerHTML = '';
            document.querySelector('#modal1 #Sanoittaja').innerHTML = '';
            document.querySelector('#modal1 #Sovittaja').innerHTML = '';
            document.querySelector('#modal1 #Kuvaus').innerHTML = '';

          });
        });
      }/* else if (item.mediaMimetype.includes('application')) {
        const embed = document.createElement('embed');
        const h = document.createElement('header');
        embed.src = item.mediaUrl;
        embed.pluginspage = 'http://www.adobe.com/products/acrobat/readstep2.html';
        embed.width = '400';
        embed.height = '300';
        h.innerHTML = item.mediaNimi;
        divK.appendChild(embed);
        divK.appendChild(h);

        embed.addEventListener('click', () => {
          // tähän
          document.querySelector('#modal1').classList.remove('hidden');
          document.querySelector('#modal1 img').src = item.mediaUrl;
          document.querySelector('#modal1 a').href = item.mediaOriginalname;
          document.querySelector('#x').addEventListener('click', () => {
            document.querySelector('#modal1').classList.add('hidden');
            document.querySelector('#modal1 img').src = '';
            document.querySelector('#modal1 #Nimi2').innerHTML = "";
            document.querySelector('#modal2 #Esittaja').innerHTML = "";
          });
        });
      }*/ else if (item.mediaMimetype.includes('audio')) {
        const audio = document.createElement('audio');
        audio.setAttribute('controls', 'controls');
        const h = document.createElement('header');
        audio.src = item.mediaUrl;
        h.innerHTML = item.mediaNimi;
        divK.appendChild(audio);
        divK.appendChild(h);

        h.addEventListener('click', () => {
          // tähän
          document.querySelector('#modal2 #Nimi2').innerHTML = '';
          document.querySelector('#modal2 #Esittaja').innerHTML = '';
          document.querySelector('#modal2 #Saveltaja2').innerHTML = '';
          document.querySelector('#modal2 #Sanoittaja2').innerHTML = '';
          document.querySelector('#modal2 #Sovittaja2').innerHTML = '';
          document.querySelector('#modal2 #Kuvaus2').innerHTML = '';
          document.querySelector('#modal2').classList.remove('hidden');
          document.querySelector('#modal2 audio').src = item.mediaUrl;

          //-------------------------------------------------------

          try {
            if (item.mediaNimi.length > 0) {
              document.querySelector('#modal2 #Nimi2').innerHTML = 'NIMI:' +
                  item.mediaId;
            }
            if (item.mediaEsittaja.length > 0) {
              document.querySelector(
                  '#modal2 #Esittaja').innerHTML = 'ESITTÄJÄ: ' +
                  item.mediaEsittaja;
            }
            if (item.mediaSaveltaja.length > 0) {
              document.querySelector(
                  '#modal2 #Saveltaja2').innerHTML = 'SÄVELTÄJÄ: ' +
                  item.mediaSaveltaja;
            }
            if (item.mediaSanoittaja.length > 0) {
              document.querySelector(
                  '#modal2 #Sanoittaja2').innerHTML = 'SANOITTAJA: ' +
                  item.mediaSanoittaja;
            }
            if (item.mediaSovittaja.length > 0) {
              document.querySelector(
                  '#modal2 #Sovittaja2').innerHTML = 'SOVITTAJA: ' +
                  item.mediaSovittaja;
            }
            if (item.mediaKuvaus.length > 0) {
              document.querySelector(
                  '#modal2 #Kuvaus2').innerHTML = 'KUVAUS: ' + item.mediaKuvaus;
            }

          } catch (err) {
            console.log(err);
          }

          document.querySelector('#y').addEventListener('click', () => {
            document.querySelector('#modal2').classList.add('hidden');
            document.querySelector('#modal2 audio').src = '';
            document.querySelector('#modal2 #Nimi2').innerHTML = '';
            document.querySelector('#modal2 #Esittaja').innerHTML = '';
            document.querySelector('#modal2 #Saveltaja2').innerHTML = '';
            document.querySelector('#modal2 #Sanoittaja2').innerHTML = '';
            document.querySelector('#modal2 #Sovittaja2').innerHTML = '';
            document.querySelector('#modal2 #Kuvaus2').innerHTML = '';
          });

        });

      }

      //p.innerHTML = 'tykkäykset';
      divK.setAttribute('id', 'divKid' + x);

      holder.appendChild(divK);
      //divK.appendChild(p);

      x++;
    }

  });
};

document.addEventListener('DOMContentLoaded', function() {
  fetch('./logged').then((response) => {
    return response.json();
  }).then((json) => {
    console.log(json);
    respologged(json);
  });
  const respologged = (testi) => {
    if (testi.status === 'OK') {
      console.log('ok');
    } else {
      console.log('not ok');

      function timeout(param) {
        console.log(param);
        window.location.replace('HTTPS://10.114.32.171/node/index.html?page=' +
            encodeURIComponent(window.location));
      }

      setTimeout(timeout, 50, 'moi');

    }
    if (loginHaku.length >= 1) {
      console.log('hei' + loginHaku);
      lomakeHaku.querySelector('input[name="haku"]').value = loginHaku;
      localStorage.removeItem("haku");
      lahetaHaku();

    }
  };
}, false);

/*button.addEventListener('click', like);*/
lomakeHaku.addEventListener('submit', lahetaHaku);


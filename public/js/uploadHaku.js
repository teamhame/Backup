'use strict';
//let hakutulos = null;
const lomakeHaku = document.querySelector('#formHaku');
//const holder = document.querySelector('#holder');
const button = document.querySelector('#like');

/*document.addEventListener('DOMContentLoaded', function() {
  alert('Ready!');
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

  };
}, false);*/

const lahetaHaku = (evtHaku) => {
  evtHaku.preventDefault();
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
      const p = document.createElement('p');

      if(item.mediaMimetype.includes('image')) {
        const img = document.createElement('img');
        const h = document.createElement('header');
        img.src = item.mediaThumb;
        h.innerHTML = item.mediaNimi;
        divK.appendChild(img);
        divK.appendChild(h);

        img.addEventListener('click', () => {
          // tähän
          document.querySelector('#modal1').classList.remove('hidden');
          document.querySelector('#modal1 img').src = item.mediaUrl;
          document.querySelector('#modal1 a').href = item.mediaUrl;
          document.querySelector('#x').addEventListener('click', () => {
            document.querySelector('#modal1').classList.add('hidden');
            document.querySelector('#modal1 img').src = "";
          });

        });
      } else if(item.mediaMimetype.includes('application')){
        const embed = document.createElement('embed');
        const h = document.createElement('header');
        embed.src = item.mediaUrl;
        embed.pluginspage="http://www.adobe.com/products/acrobat/readstep2.html";
        embed.width="400";
        embed.height="300";
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
            document.querySelector('#modal1 img').src = "";
          });
        });
      }else if (item.mediaMimetype.includes('audio')){
        const audio = document.createElement('audio');
        audio.setAttribute('controls', 'controls');
        const h = document.createElement('header');
        audio.src=item.mediaUrl;
        h.innerHTML=item.mediaNimi;
        divK.appendChild(audio);
        divK.appendChild(h);

        h.addEventListener('click', () => {
          // tähän
          document.querySelector('#modal2').classList.remove('hidden');
          document.querySelector('#modal2 audio').src = item.mediaUrl;
          document.querySelector('#modal2 a').href = item.mediaUrl;
          document.querySelector('#y').addEventListener('click', () => {
            document.querySelector('#modal2').classList.add('hidden');
            document.querySelector('#modal2 audio').src = "";
          });

        });

      }


      p.innerHTML = 'tykkäykset';
      divK.setAttribute('id', 'divKid' + x);

      holder.appendChild(divK);
      divK.appendChild(p);

      x++;
    }

  });
};

const like = (evtLike) => {
  alert('tykkäsit tästä');

};

button.addEventListener('click', like);
lomakeHaku.addEventListener('submit', lahetaHaku);


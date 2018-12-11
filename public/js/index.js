'use strict';
const lomake = document.querySelector('#uusiuser');

const password = document.querySelector('#password1');
const password2 = document.querySelector('#password2');


const nappi = document.querySelector('#button1');

const newUserform = document.querySelector('#uusiuser');

newUserform.style.display = 'none';

const herja = document.querySelector('#herja');

herja.style.display = 'none';


const createUser = (evt1) => {
  newUserform.style.display = 'flex';
  nappi.style.display = 'none';
};

const lahetaLomake = (evt) => {
  evt.preventDefault();
  if (password.value !== password2.value) {
    //concolelog muutettu alertiksi 4.12
    alert('salasanat eivät täsmää');
  } else {
    const data = JSON.stringify([
      lomake.querySelector('input[name="fname"]').value,
      lomake.querySelector('input[name="lname"]').value,
      lomake.querySelector('input[name="email"]').value,
      lomake.querySelector('input[name="password"]').value,
      lomake.querySelector('input[name="password2"]').value,
    ]);
    const asetukset = {
      method: 'post',
      body: data,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    };

    fetch('./newuser', asetukset).then((response) => {
      return response.json();
    }).then((json) => {
      console.log('tämä ', json);
      respo(json);
    });
  }

  const respo = (testi) => {

    if (testi.status === 'No email') {
      console.log('no email');
      herja.style.display = 'flex';
    }
    if (testi.status === 'email yes') {
      console.log('yes email');
      herja.style.display = 'none';
      newUserform.style.display = 'none';
      alert('Olet luonut uuden käyttäjän, ole hyvä ja kirjaudu sisään');

    }
  };
};

nappi.addEventListener('click', createUser);
lomake.addEventListener('submit', lahetaLomake);


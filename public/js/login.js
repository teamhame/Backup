'use strict';
const valikko = document.querySelector('#valikko');

//login.html:n valikon toiminnallisuus
const menuFunction= () => {
  let x = document.getElementById("valikko");
  if (x.className === "valikko") {
    x.className += " responsive";
  } else {
    x.className = "valikko";
  }
}
valikko.addEventListener('click', menuFunction());
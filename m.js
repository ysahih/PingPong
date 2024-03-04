var secrett;

fetch('http://localhost:3000/api/auth/2fa')
.then(response => response.json())
.then(data => secrett = data)
.then(data => document.getElementById('img').src = data.qrCodeData);
// console.log(data);

const ptn = document.getElementById('btn');
const input = document.getElementById('input');

ptn.addEventListener('click', () => {
    const token = {
      token: input.value,
      secret: secrett.secret
    };
    console.log(token);
    fetch('http://localhost:3000/api/auth/2fa', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(token) // Convert the token object to a JSON string
    })
      .then(response => response.json())
      .then(data => {
        document.getElementById('h1').innerText = data;
      })
      .catch(error => {
        console.error(error);
      });
  });
const http = require('http');
const readline = require('readline'); 

function sendRequest(userData) {

  const data = JSON.stringify(userData);
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/users',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length,
    },
  };

  const req = http.request(options, res => {
    let responseBody = '';
    console.log(`\n[Client] Response status: ${res.statusCode}`);
    res.on('data', d => {
      responseBody += d;
    });
    res.on('end', () => {
      console.log('[Client] Response body:', responseBody);
      console.log('------------------------------------');
    });
  });

  req.on('error', error => {
    console.error('[Client] Error:', error);
  });

  console.log('[Client] Sending data:', data);
  req.write(data);
  req.end();
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log('--- Criando um novo usuário ---');

rl.question('Digite o e-mail do usuário: ', (email) => {
  rl.question('Digite a senha do usuário: ', (password) => {

    const userData = {
      email: email,
      password: password,
    };

    sendRequest(userData);
    rl.close();
  });
});
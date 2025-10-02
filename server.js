const http = require('http');
const { readFileSync, writeFileSync } = require('fs');

const DB_PATH = './appointments.json';

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/users') {
    let body = '';

    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      const { email, password } = JSON.parse(body);

      if (!email || !email.includes('@') || !password || password.length < 8) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid email format or password too short (minimum 8 characters).' }));
        return;
      }

      try {
        const appointments = JSON.parse(readFileSync(DB_PATH));
        const newUser = { id: appointments.length + 1, email, password };
        appointments.push(newUser);

        writeFileSync(DB_PATH, JSON.stringify(appointments, null, 2)); 

        console.log(`User saved with email: ${email}`);

        // DEBT 2 (TODO): Implement the welcome email sending.
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(newUser)); 

      } catch (error) {
        console.error('Error writing to database:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Internal server error.' }));
      }
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not Found' }));
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
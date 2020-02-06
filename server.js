// server.js
const net = require('net');
const port = 8124;
const firstRequestString = 'QA';
const successRes = 'ASC';
const failedRes = 'DEC';
const qa = require('./qa.json');

let seed = 1;

const server = net.createServer((client) => {
  console.log('Client connected');

  client.setEncoding('utf8');
  client.ID = Date.now() + seed++ ;

  client.on('data', (data) => {
    console.log(data);

    switch (data) {
      case firstRequestString:
        client.write(successRes);
        break;
      default:
        client.write(failedRes);
        break;
    }
  });

  client.on('end', () => console.log('Client disconnected'));
});

server.listen(port, () => {
  console.log(`Server listening on localhost:${port}`);
});

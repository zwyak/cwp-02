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
  client.RequestNumber = 0;

  client.on('data', (data) => {

    client.RequestNumber = client.RequestNumber + 1;

    if ( (data == firstRequestString) && (client.RequestNumber == 1) ){
      console.log(data);
      client.write(successRes);
    }else if ( (data != firstRequestString) && (client.RequestNumber == 1) ){
      console.log(data);
      client.write(failedRes);
    }else {
      console.log(data);
      client.write(qa[client.RequestNumber - 2].Answer);
    }
  });

  client.on('end', () => console.log('Client disconnected'));
});

server.listen(port, () => {
  console.log(`Server listening on localhost:${port}`);
});

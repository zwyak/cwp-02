// server.js
const net = require('net');
const fs = require('fs');
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

      fs.writeFile(client.ID + '.log', 'Client: ' + data + '\r\n', function (err) {
        if (err) throw err;
      });

      client.write(successRes);
    }else if ( (data != firstRequestString) && (client.RequestNumber == 1) ){
      console.log(data);
      client.write(failedRes);
    }else {
      console.log(data);

      fs.appendFile(client.ID + '.log', 'Client: ' + data + '\r\n', function (err) {
        if (err) throw err;
      });

      fs.appendFile(client.ID + '.log', 'Server: ' + qa[client.RequestNumber - 2].Answer + '\r\n', function (err) {
        if (err) throw err;
      });

      client.write(qa[client.RequestNumber - 2].Answer);
    }
  });

  client.on('end', () => console.log('Client disconnected'));
});

server.listen(port, () => {
  console.log(`Server listening on localhost:${port}`);
});

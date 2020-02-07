// client.js
const net = require('net');
const port = 8124;
const firstRequestString = 'QA';
const successRes = 'ASC';
const failedRes = 'DEC';

let qa = require('./qa.json');

const client = new net.Socket();

console.log('Question list:')
console.log(qa);

qa = shuffle(qa);

console.log('Swaped question list:')
console.log(qa);

client.setEncoding('utf8');

client.connect(port, function() {
  console.log('Connected');
  client.RequestNumber = 0;
  client.write(firstRequestString);
});


client.on('data', function(data) {

  client.RequestNumber = client.RequestNumber + 1;

  if ( (data == successRes) && (client.RequestNumber == 1) ){
    console.log(data);
    client.write(qa[client.RequestNumber - 1].Question);
  }else if ( (data != successRes) && (client.RequestNumber == 1) ){
    console.log(data);
    client.destroy();
  }else {
    if (client.RequestNumber < qa.length + 1){
      console.log(data);
      client.write(qa[client.RequestNumber - 1].Question);
    }else{
      console.log(data);
      client.destroy();
    }
  }
});

client.on('close', function() {
  console.log('Connection closed');
});

function shuffle(arr){
	var j, temp;
	for(var i = arr.length - 1; i > 0; i--){
		j = Math.floor(Math.random()*(i + 1));
		temp = arr[j];
		arr[j] = arr[i];
		arr[i] = temp;
	}
	return arr;
}

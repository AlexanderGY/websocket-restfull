# The Websokets to RESTfull

### Requirements:
Node.js 6+

### Instalation
```
npm install websocket-restfull
```

### Usage:
Initialize
```javascript
const io = require('socket.io').listen(server);
const RestfullWS = require('websocket-restfull');
```
listen a connection
```javascript
io.on('connection', (socket) => {

})
```
handle a income request
```javascript
io.on('connection', (socket) => {
  const options = {
    path: '/../models' //Path to models folder
  };
  const wr = new RestfullWS(socket, options);

  wr
    .read()
    .then(data => {
      socket.emit(data); //Data is a response of Mongodb
    })
    .catch(err => {
      //error handling
    });

  //Also, you can use .create, .update and .delete methods

})
```
make a request from client

```javascript
  const socket = io();
  socket.emit('read:users');

  socket.emit('create:users', {
    username: 'John',
    lastname: 'Doe'
  });
  //etc...
```

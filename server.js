//make a basic web server
let http = require('http');
let port = process.env.PORT; //3032

//Load the express functionality
let express = require('express');

let app = express();
//Ask http to make me a server
let server = app.listen(3000);
//Let my server app handle all request
http.createServer(app).listen(port);

//Tell my web app where to look for content to serve up in response to requests
app.use(express.static('public'));
//1. return
//2. callback function
console.log ("My socket is running")

var socket = require('socket.io');
var io = socket(server);

io.sockets.on('connection', newConnection);

// Emit the event to all connected sockets
io.emit('some event', { someProperty: 'some value', otherProperty: 'other value' }); 

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
  });
  
  //Broad casting
  io.on('connection', (socket) => {
    socket.broadcast.emit('hi');
  });

  io.on('connection', (socket) => {
    socket.on('chat message', (msg) => {
      console.log('message: ' + msg);
    });
  });
  
  http.listen(3000, () => {
    console.log('listening on *:3000');
  });
  
//incoming data
function newConnection(socket) {
    console.log('new connection:' + socket.id );

    socket.on('mouse', mouseMsg);

    function mouseMsg(data){
        socket.broadcast.emit('mouse', data);

        console.log(data);
    }

}


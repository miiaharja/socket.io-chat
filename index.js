// Socket.io Chat application
// Miia Harja

// Variables
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
// Users on a server
var people = {}; 

// Set path to static files
app.use(express.static(__dirname + '/public'));

// Get index.html
app.get('/', function(req, res){
    res.sendFile(__dirname + '/public/index.html');
    });

// Connecting user to server
io.on("connection", function (client) {
    // Creating nickname
    client.on("join", function(name){
        people[client.id] = name;
        // Print message when user joins
        client.emit("update", "You have connected to the server.");
        io.sockets.emit("update", name + " has joined the server.");
        // Adds username to list of users on the server
        io.sockets.emit("update-people", people);
    });
    // Sending messages
    client.on("send", function(msg){
        io.sockets.emit("chat", people[client.id], msg);
    });
    // Sending message when user leaves server
    client.on("disconnect", function(){
        io.sockets.emit("update", people[client.id] + " has left the server.");
        // Deleting username from userlist
        delete people[client.id];
        io.sockets.emit("update-people", people);
    });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

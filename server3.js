const DBScript = require('./sql/dbScripts.js');

var app = require('http').createServer(handler);
var io = require('socket.io')(app);
var fs = require('fs');
var port = 3000;

app.listen(port);
console.log("server started listen on Port " + port);

var totalConnections = 0;
// const initialFile = '/game.html';
const initialFile = '/html/main.html';

var CAHNSP = io.of('/CAHGame');
var DBNSP = io.of('/DB');
var LOBBYNSP = io.of('/lobby');

// var games=[];

// const nsp = io.of('/defGameid');
// var num = 0;

//answer http request
function handler (req, res) {
    var url = req.url;
    console.log(url);

    if (req.url == '/'){
        url = initialFile;
    } else if (url.endsWith('.html')) {
        url = '/html/' + url;
    }

    fs.readFile(__dirname + url, function (err, data) {
        if (err) {
            res.writeHead(500);
            return res.end('Error loading ' + url);
        }
        res.writeHead(200);
        res.end(data);
    });
}
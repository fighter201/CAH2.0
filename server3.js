const DBScript = require('./sql/dbScripts.js');
const Game = require('./js/Game.js');
const dbConnection = require('./sql/dbConnection');

var app = require('http').createServer(handler);
var io = require('socket.io')(app);
var fs = require('fs');
var port = 3000;

app.listen(port);
console.log("server started listen on Port " + port);

const initialFile = '/html/main.html';

var CAHNSP = io.of('/CAHGame');
var DBNSP = io.of('/DB');
var LOBBYNSP = io.of('/lobby');

var playerIDs = [];
var games=[];

//answer http request
function handler (req, res) {
    var url = req.url;
    // console.log(url);

    if (req.url == '/'){
        url = initialFile;
    } else if (url.endsWith('.html')) {
        url = '/html' + url;
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

//CAH Namespace
CAHNSP.on('connection', function(socket){
    // socket.on('createGame', function(input) {
    //     var newGameID = getNewGameID();
    //     games.push(new Game(newGameID, input.name, input.password, input.maxPlayer, input.numHand, input.packages));
    //     socket.emit('createdGame', newGameID);
    // });

    console.log(socket.id)
    socket.on('joinGameReq', function(playerID, gameID){
        if (canJoinGame(playerID, gameID)) {
            socket.emit('joinGame', true);
        } else {
            socket.emit('joinGame', false);
        }
    });

    socket.on('disconnect', function(){
        player = getPlayerById(socket.id);
        if (player!==null) {
            player.connected=false;
            player.socketID='';
        }
    });
});

LOBBYNSP.on('connection', function(socket){
    // console.log(socket.id);
    socket.on('createLobby', function(settings, playerID, nickname){
        //settings: {name:String, maxPlayer:int>=3, maxPoints:int>0, packages:[{packagename:String, checked:boolean}], password:String};
        var gameID = getNewGameID();
        var game = new Game(gameID, settings.name, settings.password, settings.maxPlayer, settings.numHand, settings.packages);
        game.master = playerID;
        games.push(game);
        console.log('player: ' + playerID + '; nickname: ' , nickname + '; created game:' + gameID + '; with settings: ', settings);
    });
})

    /* socket.on('createGame', function(newGameID){
        window.sessionStorage.setItem('master', true);
        window.sessionStorage.setItem('gameID', newGameID);
        window.location.href='/waitingGamestart';
    }) */

DBNSP.on('connection', function(socket){
    socket.on('packagesReq', function(){
        var req = 'SELECT name FROM packages';
        dbConnection.query(req, function(err, result, fields){
            // console.log('packages: ', result);
            socket.emit('packages', result);
        });
    })

    socket.on('getNewPlayerID', function(){
        var newID = getNewPlayerID();
        playerIDs.push(newID);
        socket.emit('newPlayerID', newID);
    })
})

function canJoinGame(playerID, gameID){
    if (playerID.gameID!=='') {
        //allready ingame
        return false;
    } else if (getGame(gameID).numPlayer===getGame(gameID).maxPlayer){
        //fullLobby
        return false;
    }

    return true;
}

function getNewGameID() {
    while (true) {
        var id = Math.random().toString(36).substring(2, 15);
        if (getGame(id) == undefined) {
            return id;
        }
    }
}

function getGame(gameID){
    games.forEach(element => {
        if (element.id===gameID) {
            return element;
        }
    });
    return undefined;
}

function getNewPlayerID() {
    while(true){
        var newID = Math.random().toString(36).substring(2, 15);
        if (!playerIDs.includes(newID)){
            return newID;
        }
    }
}

function getPlayerById(socketID) {
    games.forEach(game => {
        game.players.forEach(player => {
            if (player.socketID===socketID){
                return player;
            }
        })
    });
    return null;
}

function getLobbys() {
    var arr=[];
    games.forEach(element => {
        if (element.gamestate==='Lobby') {
            arr.push({id:element.id, name:element.name, numPlayer:element.numPlayer, maxPlayer:element.maxPlayer});
        }
    });
    return arr;
}
const Game = require('./js/Game.js');
const Player = require('./js/Player.js');
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

var players = [];
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
    
});

LOBBYNSP.on('connection', function(socket){
    // console.log(socket.id);
    socket.on('createLobby', function(settings, playerID, nickname){
        //settings: {name:String, maxPlayer:int>=3, maxPoints:int>0, packages:[{packagename:String, checked:boolean}], password:String};
        var gameID = getNewGameID();
        var packages = settings.packages.filter(function(package){
            if (package.checked){
                return true;
            } else {
                return false;
            }
        })
        // console.log(packages)
        var game = new Game(gameID, settings.name, settings.password, settings.maxPlayer, settings.numHand, packages);
        game.addPlayer(new Player(playerID, nickname));
        game.master = playerID;
        games.push(game);
        console.log('created Lobby:', game.toString());

        //testing
        game.startGame();
        setInterval(function(){
            console.log(game.ready);
            if (game.ready){
                console.log('ready');
                clearInterval(this);
            }
        },1000);

        // console.log('player: ' + playerID + '; nickname: ' , nickname + '; created game:' + gameID + '; with settings: ', settings);
    });

    socket.on('inLobby', function(gameID){
        socket.join(gameID);
    });

    socket.on('chatmessage', function(source, message, gameID){
        io.to(gameID).emit('newChatMessage', source, message, gameID);
    });

    socket.on('startGame', function(gameID){
        var game = getGame(gameID);
        if (game!==null){
            game.startGame();
            setInterval(function(){
                console.log(game.ready);
                if (game.ready){
                    console.log('ready');
                    clearInterval(this);
                    io.to(gameID).emit('gameStart');
                }
            },1000);
        }
    });
})

DBNSP.on('connection', function(socket){
    // console.log(socket.id);
    socket.on('packagesReq', function(){
        var req = 'SELECT name FROM packages';
        dbConnection.query(req, function(err, result, fields){
            // console.log('packages: ', result);
            socket.emit('packages', result);
        });
    })

    socket.on('lobbyReq', function() {
        socket.emit('lobbys', getLobbys());
    })

    socket.on('newPlayer', function(nickname){
        var newID = getNewPlayerID();
        var newPlayer = new Player(newID, nickname);
        // console.log('new player added', newPlayer.id, newPlayer.nickname);
        players.push(newPlayer);
        // console.log(players[0].toString());
        // console.log(getPlayerById(newID));
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
        if (getGame(id) == null) {
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
    return null;
}

function getNewPlayerID() {
    while(true) {
        var newID = Math.random().toString(36).substring(2, 15);
        if (getPlayerById(newID)===null){
            return newID;
        }
    }
}

function getPlayerBySocket(socketID) {
    games.forEach(game => {
        game.players.forEach(player => {
            if (player.socketID===socketID){
                return player;
            }
        })
    });
    return null;
}

function getPlayerById(playerID){
    // console.log(players);
    // console.log('looking for', playerID)
    for(player of players){
        if (player.id==playerID){
            return player;
        }
    }
    return null;
}

function getLobbys() {
    var arr=[];
    games.forEach(element => {
        if (element.gamestate==='Lobby') {
            // console.log(element.name, element.master, element.maxPlayer);
            var masterNickname = getPlayerById(element.master).nickname;
            arr.push({name:element.name, master:masterNickname, numPlayer: element.numPlayer, maxPlayer:element.maxPlayer});
        }
    });
    return arr;
}

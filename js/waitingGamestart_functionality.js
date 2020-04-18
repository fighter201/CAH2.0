


//mainMinSize(numberToCheckTo, numberToAdd) -> Ändere nur, wenn kleiner als... 
//für jedes Feld minSize? -> Einzelne Elemente Scrollbar machen wenn > minSize ->?
//									-> v.a. Chat, evtl. PlayerList

// console.log(window.sessionStorage.getItem('master'));
if (window.sessionStorage.getItem('master')==='true'){
    var button = document.getElementById('startGame');
    button.style.visibility='visible';
}

// checkConnection();

// console.log(socket);
// const gameId = 'defGameid';
//get user id from session variable
// var isMaster = false;
// if (isMaster){
//     document.getElementById('startGame').style.visibility='visible';
// }

//get gameId
// var gameId = "";
// var userId = "default user";


var gameID = window.sessionStorage.getItem('gameID');
var playerID = "defPlayer";

socket.emit('inWaitingLobby', gameID, playerID);

socket.on('startGame', function() {
    window.location.href = '/game.html';
});

// function checkConnection(){
//     if (socket.connected == false){
//     console.log('create lobby with this id');
//     window.location.href = '/';
//     }
// }

function startGame() {
    // window.location.href = '/';
    socket.emit('gameStart', gameID);
        }
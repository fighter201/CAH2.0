console.log("waitingGamestart_functionality.js loaded");
const spanInsideLobby = document.getElementById('insideLobby');
const spanMaxLobby = document.getElementById('maxLobby');
const ulPlayerList = document.getElementById('playerList');
const h2LobbyName = document.getElementById('lobbyName');
//settings:
const spanMaxPoints = document.getElementById('maxPoints');
const spanNumbCards = document.getElementById('numbCards');
const spanTimeLimit = document.getElementById('timeLimit');
//settings ende
const btnChange = document.getElementById('changeSettings');
const btnStart = document.getElementById('startGame');


//useful functions ================================================
String.prototype.isEmpty = function(){
	return (this.length === 0 || !this.trim());
};
function addClass(element, theClass){
	if(!element.classList.contains(theClass)) element.classList.add(theClass);
}
function switchClass(element, adding, removing){
	if(element.classList.contains(removing)) element.classList.remove(removing);
	if(element.classList.contains(adding)) element.classList.remove(adding);
	addClass(element, adding);
}
function removeClass(element, theClass){
	if(element.classList.contains(theClass)) element.classList.remove(theClass);
}
function htmlElement(type, id, innerHTML){
	var theElement = document.createElement(type);
	if(typeof id !== "undefined") theElement.id = id;
	if(typeof innerHTML !== "undefined") theElement.innerHTML = innerHTML;
	return theElement;
}
function getHeight(element){
	return element.offsetHeight;
}
function getCSSHeight(element){
	return element.style.height;
}
//=================================================================

function setInsideLobby(insideLobby){
	spanInsideLobby.innerHTML = insideLobby;
}
function setMaxLobby(maxLobby){
	spanMaxLobby.innerHTML = maxLobby;
}
function setMaxPoints(maxPoints){
	spanMaxPoints.innerHTML = maxPoints;
}
function setNumbCards(numbCards){
	spanNumbCards.innerHTML = numbCards;
}
function setTimeLimit(timeLimit){
	spanTimeLimit.innerHTML = timeLimit;
}

function addPlayer(playerName){
	//var playerNumb = spanInsideLobby.innerHTML;
	var spanPlayer = htmlElement('span', "", playerName);
	var liPlayer = htmlElement('li');
	addClass(liPlayer, 'playerItem');
	liPlayer.id = "player_"+playerName.replace(/\s/g, "_");
	
	liPlayer.appendChild(spanPlayer);
	ulPlayerList.appendChild(liPlayer);
	
	setInsideLobby(spanInsideLobby.innerHTML++);
}
function removePlayer(playerName){
	ulPlayerList.removeChild(document.getElementById("player_"+playerName.replace(/\s/g, "_")));
	console.log("removed "+playerName);
}

//					string		number 		number 		string[]
function initLobby(lobbyName, insidePlayer, maxPlayer, players /*,settings...*/){
	h2LobbyName.innerHTML = lobbyName;
	setInsideLobby(insidePlayer);
	setMaxLobby(maxPlayer);
	
	for (x in players) addPlayer(players[x]);
}

btnChange.addEventListener('click', function(){
	
});
btnStart.addEventListener('click', function(){
	
});


//mainMinSize(numberToCheckTo, numberToAdd) -> Ändere nur, wenn kleiner als... 
//für jedes Feld minSize? -> Einzelne Elemente Scrollbar machen wenn > minSize ->?
//									-> v.a. Chat, evtl. PlayerList

/*
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
*/
		
		
window.onload = function(){
	console.log("onLoad()");
	var players = ["ready", "totally ready", "hi"];
	initLobby("Automatically generated Lobby", 3, 5, players);
};
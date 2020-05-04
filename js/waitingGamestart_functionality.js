console.log("waitingGamestart_functionality.js loaded");
const head = document.getElementById('head');
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
function addStylesheet(sheetName){
	var link = htmlElement('link');
	link.rel = "stylesheet";
	link.href = "../css/"+sheetName+".css";
	head.appendChild(link);
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

function onSettingsChanged(input, oldValue){
	if(input.value!=oldValue){
		console.log("settingsChanged::buttonApplyActivated: input.value:"+input.value+" oldValue:"+oldValue);
		btnStart.disabled = true;
		btnChange.disabled = false;
	}
	else{
		console.log("settingsChanged::buttonApplyDeactivated");
		btnStart.disabled = false;
		btnChange.disabled = true;
	}
}

//					string		number 		number 		string[]  number	number
function LobbyHost(lobbyName, insidePlayer, maxPlayer, players, maxPoints, numbCards /*,settings...*/){
	//default setting values
	this.maxPoints = 10;
	this.numbCards = 10;
	const timeLimit = "disabled";
	
	this.maxPoints = maxPoints;
	this.numbCards = numbCards;
	
	//init Lobby
	h2LobbyName.innerHTML = lobbyName;
	setInsideLobby(insidePlayer);
	setMaxLobby(maxPlayer);
	
	for (x in players) addPlayer(players[x]);
	
	//init host settings
	const settingList = document.getElementById('settingListHost');
	var li1 = htmlElement('li');
	var span1 = htmlElement('span', "", "Round ends at ");
	var span1EndingText = document.createTextNode(" points");
	var input1 = htmlElement('input', 'maxPoints');
	
	var li2 = htmlElement('li');
	var span2 = htmlElement('span', "", "White Cards per player: ");
	var input2 = htmlElement('input', 'numbCards');
	
	var li3 = htmlElement('li');
	var span3 = htmlElement('span', "", "Time limit: ");
	var input3 = htmlElement('select', 'timeLimit');
	var option31 = htmlElement('option', "", timeLimit);
	
	input1.setAttribute('type', "number");
	input1.setAttribute('value', maxPoints);
	input1.setAttribute('min', "1");
	input1.addEventListener('change', function(){
		onSettingsChanged(input1, maxPoints);
	});
	
	input2.setAttribute('type', "number");
	input2.setAttribute('value', numbCards);
	input2.setAttribute('min', "1");
	input2.addEventListener('change', function(){
		onSettingsChanged(input2, numbCards);
	});
	
	input3.addEventListener('change', function(){
		onSettingsChanged(input3, timeLimit);
	});
	option31.selected = true;
	
	span1.appendChild(input1);
	span1.appendChild(span1EndingText);
	li1.appendChild(span1);
	settingList.appendChild(li1);
	
	span2.appendChild(input2);
	li2.appendChild(span2);
	settingList.appendChild(li2);
	
	input3.appendChild(option31);
	span3.appendChild(input3);
	li3.appendChild(span3);
	settingList.appendChild(li3);
	
}
function initLobbyMember(lobbyName, insidePlayer, maxPlayer, players, maxPoints, numbCards /*,settings...*/){
	h2LobbyName.innerHTML = lobbyName;
	setInsideLobby(insidePlayer);
	setMaxLobby(maxPlayer);
	//settings
	setMaxPoints(maxPoints);
	setNumbCards(numbCards);
	
	for (x in players) addPlayer(players[x]);
}


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

//event Listener für settingInputs

btnChange.addEventListener('click', function(){
	
});
btnStart.addEventListener('click', function(){
	
});

window.onload = function(){
	console.log("onLoad()");
	
	//vars werden von Server abgefragt
	var isHost = true;
	var lobbyName = "Automatically generated ";
	var players = ["ready", "totally ready", "hi", "Der ist besonders lang"];
	var playerIn = players.length;
	var playerMx = 5;
	var maxPnts = 10;
	var numbCrds = 10;
	//================================
	
	if(isHost){
		addStylesheet('waitingGamestart_host');
		var lobby1 = new LobbyHost(lobbyName+"Host Lobby", playerIn, playerMx, players, maxPnts, numbCrds);
		btnStart.disabled = false;
		btnChange.disabled = true;
	}
	else{
		addStylesheet('waitingGamestart_member');
		initLobbyMember(lobbyName+"Member Lobby", playerIn, playerMx, players, maxPnts, numbCrds);
	}
};
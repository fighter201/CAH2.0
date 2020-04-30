console.log("joinGame_functionality.js loaded");
const ulGameList = document.getElementById('gameList');
const btnJoinGame = document.getElementById('joinGame');
const btnCreateGame = document.getElementById('createGame');
const main = document.getElementById("main");
var mainMinSize = 400;
var myLobbys = [];
var chosenLobby;
//68

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
//=================================================================

function updateMainMinSize(increase){
	console.log("myLobbys length:"+myLobbys.length);
	if(myLobbys.length > 3) mainMinSize += increase;
	main.style.minHeight = mainMinSize+"px";
}

/*	Methoden: addPlayer() -> gibt 'true' zurück, wenn erfolgreich; updateStatus()
	Getter: .name -> gameId; .creator -> Ersteller; .player -> Anzahl Spieler in Lobby
		.html -> HtmlElement
*/
function LobbyElement(gameName, theCreator, nowPlayer, maxPlayer, lobbyNum){
	this.gameName = "awesomeGameName";
	this.theCreator = "nobody";
	this.playerInside = 0;
	this.playerMax = 0;
	this.num = -1;
	
	this.gameName = gameName;
	this.theCreator = theCreator;
	this.playerInside = nowPlayer;
	this.playerMax = maxPlayer;
	this.num = lobbyNum;
	
	/*
	get name(){	return this.gameName;	}
	get creator(){	return this.theCreator;	}
	get player(){	return this.playerInside;	}
	*/
	
	//Einzelelemente erzeugen
	var li = htmlElement('li');
	var button = htmlElement('button');
	var sub1 = htmlElement('div');
	var h3 = htmlElement('h3', "" , gameName);
	var playerCont = htmlElement('span');
	var insideLobby = htmlElement('span',"", this.playerInside);
	var maxLobby = htmlElement('span', "", this.playerMax);
	var sub2 = htmlElement('div');
	var creatorCont = htmlElement('span');
	var creatorSpan = htmlElement('span', "", this.theCreator);
	
	//CSS Klassen zuweisen
	addClass(button, 'lobbyElement');
	addClass(sub1, 'subContainer1');
	addClass(sub2, 'subContainer2');
	addClass(h3, 'lobbyName');
	addClass(playerCont, 'dispPlayer');
	addClass(insideLobby, 'dispPlayer');
	addClass(maxLobby, 'dispPlayer');
	addClass(creatorCont, 'creatorLobby');
	addClass(creatorSpan, 'creatorLobby');
	
	//Elemente anordnen
	playerCont.appendChild(insideLobby);
	playerCont.appendChild(document.createTextNode(" / "));
	playerCont.appendChild(maxLobby);
	sub1.appendChild(h3);
	sub1.appendChild(playerCont);
	creatorCont.appendChild(document.createTextNode("created by "));
	creatorCont.appendChild(creatorSpan);
	sub2.appendChild(creatorCont);
	button.appendChild(sub1);
	button.appendChild(sub2);
	li.appendChild(button);
	this.html = li;
	this.spanPlayerInLobby = insideLobby;
	
	//Methoden
	this.updateStatus = function(){
		if(this.playerInside < this.playerMax){
			switchClass(playerCont, "empty", "full");
			switchClass(insideLobby, "empty", "full");
			switchClass(maxLobby, "empty", "full");
		}
		else {
			switchClass(playerCont, "full", "empty");
			switchClass(insideLobby, "full", "empty");
			switchClass(maxLobby, "full", "empty");
		}
	};
	this.addPlayer = function(){
		if(this.playerInside < this.playerMax){
			this.playerInside++;
			this.spanPlayerInLobby.innerHTML = this.playerInside;
			this.updateStatus();
			return true;
		}
		else{
			console.log("lobby is full, could not add player");
			this.updateStatus();
			return false;
		}
	};
	this.html.addEventListener('click', function(){
		var innerhtml = this.innerHTML;
		var namePos = innerhtml.indexOf("lobbyName");
		var nameStart = innerhtml.indexOf(">", namePos);
		var nameEnd = innerhtml.indexOf("<", nameStart);
		var name = innerhtml.substring(nameStart+1, nameEnd);
		
		console.log("name:"+name);
		chosenLobby = name;
	});
}

function addLobby(gameName, theCreator, nowPlayer, maxPlayer){
	var lobbyNum = myLobbys.length;
	myLobbys.push(new LobbyElement(gameName, theCreator, nowPlayer, maxPlayer, lobbyNum));
	ulGameList.appendChild(myLobbys[lobbyNum].html);
	myLobbys[lobbyNum].updateStatus();
	updateMainMinSize(76);
}

btnJoinGame.addEventListener('click', function(){
	join(gameName);
});
btnCreateGame.addEventListener('click', function(){
	window.location.href='createGame.html';
});

function loadLobbys() {
	var dbSocket = io('/DB');
	dbSocket.emit('lobbyReq');
	dbSocket.on('lobbys', function(lobbys) {
		console.log(lobbys);
		lobbys.forEach(lobby => {
			addLobby(lobby.name, lobby.master, lobby.numPlayer, lobby.maxPlayer);
		});
	});
}

function join(gameID){
    // console.log('button pressed: ' + gameID);
    socket.emit('joinGame', gameID);
    socket.on('canJoinGame', function(canJoin) {
        if (canJoin){
            console.log('button clicked: ' + gameID);
            window.sessionStorage.setItem('gameID', gameID);
            window.sessionStorage.setItem('master', false);
            console.log(window.sessionStorage.getItem('gameID'));
            window.location.href='waitingGamestart.html';
        } else {
            window.alert('cant join Lobby full');
        }
    });
}


window.onload = function(){
	addLobby("automaticallyAdded1", "js", 5, 10);
	loadLobbys();
};
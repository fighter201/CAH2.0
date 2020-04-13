const ulGameList = document.getElementById('gameList');
const btnJoinGame = document.getElementById('joinGame');
const btnCreateGame = document.getElementById('createGame');
var myLobbys = [];
var chosenLobby;

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

/*	Methoden: addPlayer() -> gibt 'true' zurück, wenn erfolgreich; updateStatus()
	Getter: .name -> gameId; .creator -> Ersteller; .player -> Anzahl Spieler in Lobby
		.html -> HtmlElement
*/
function LobbyElement(gameName, theCreator, maxPlayer){
	this.gameName = "awesomeGameName";
	this.theCreator = "nobody";
	this.playerInside = 0;
	this.playerMax = 0;
	
	this.gameName = gameName;
	this.theCreator = theCreator;
	this.playerInside = 0;
	this.playerMax = maxPlayer;
	
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
	
	
	//Methoden
	this.addPlayer = function(){
		if(playerInside < playerMax){
			playerInside++;	
			return true;
		}
		else{
			console.log("lobby is full, could not add player");
			return false;
		}
	};
	this.updateStatus = function(){
		//TODO setze Styles, ob Lobby voll
	};
}

function addLobby(gameName, theCreator, maxPlayer){
	myLobbys.push(new LobbyElement(gameName, theCreator, maxPlayer));
	ulGameList.appendChild(myLobbys[0].html);
}



btnJoinGame.addEventListener('click', function(){
	join(gameName);
});
btnCreateGame.addEventListener('click', function(){
	window.location.href='createGame.html';
});

/*
socket = io('/DB');
socket.emit('getGames');
socket.on('res', function(data) {
    var liste = document.getElementById('gameList');
    var initialContent = liste.innerHTML;
    
    if (initialContent === undefined){
        initialContent = "";
    }

    // console.log(data.length);
    
    var newContent = '';
    var oldContent = initialContent;
    // // liste.innerHTML='<li>ein weiterer test</li>';
    data.forEach(element => {
        var gameID = element.gameID;
        newContent = oldContent + "<li><button id='" + gameID + "', onclick=\"join('" + gameID + "')\">" + gameID +"</button></li>";
        oldContent = newContent;
    });

    liste.innerHTML = newContent;
    // socket.disconnect();
    // return false;
})
	*/	
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
	addLobby("automaticallyAdded1", "js", 10);
};
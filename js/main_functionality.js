const content = document.getElementById('content');
const inputNickname = document.getElementById('nickname');
const btnCreate = document.getElementById('btnCreate');
const btnJoin = document.getElementById('btnJoin');
const maxNickname = 32;
let nickname;

//useful functions ================================================
function empty(string){
	console.log("empty()");
	return (string.length === 0 || !string.trim());
}

function addClass(element, theClass){
	if(!element.classList.contains(theClass)) element.classList.add(theClass);
}
function switchClass(element, adding, removing){
	if(element.classList.contains(removing)) element.classList.remove(removing);
	addClass(element, adding);
}
function removeClass(element, theClass){
	if(element.classList.contains(theClass)) element.classList.remove(theClass);
}
//=================================================================

function checkNickname(){
	console.log("nickname:"+inputNickname.value);
	nickname = inputNickname.value;
	
	if(empty(nickname) || nickname.length > maxNickname){
		btnCreate.disabled = true;
		btnJoin.disabled = true;
		console.log("disabled");
	}
	else{
		btnCreate.disabled = false;
		btnJoin.disabled = false;
		console.log("enabled");
	}
}

inputNickname.addEventListener('keyup', checkNickname);
btnCreate.addEventListener('click', createGame);
btnJoin.addEventListener('click', joinGame);

//nickname to sessionvariable
function saveNickname(){
	window.sessionStorage.setItem('nickname', inputNickname.value);
	console.log(window.sessionStorage.getItem('nickname'))
}

//button onclick
function createGame() {
	saveNickname();
	window.location.href='createGame.html';
}

//button onclick
function joinGame() {
	saveNickname();
	window.location.href='joinGame.html';
}

function setPlayerID(){
	var socket = io('/DB');
	socket.emit('getNewPlayerID');
	socket.on('newPlayerID', function(newPlayerID){
		window.sessionStorage.setItem('playerID', newPlayerID);
	})
}

window.onload = function(){
	this.setPlayerID();
	console.log("window onload event");
	inputNickname.setAttribute("maxlength", maxNickname);
	inputNickname.focus();
};

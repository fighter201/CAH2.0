const content = document.getElementById('content');
const inputNickname = document.getElementById('nickname');
const btnCreate = document.getElementById('btnCreate');
const btnJoin = document.getElementById('btnJoin');
const maxNickname = 32;
const joinGameUrl = 'joinGame.html';
const createGameUrl = 'createGame.html';
let nickname;

//requires usefulFunctions.js

function checkNickname(){
	// console.log("nickname:"+inputNickname.value);
	nickname = inputNickname.value;
	
	if(empty(nickname) || nickname.length > maxNickname){
		btnCreate.disabled = true;
		btnJoin.disabled = true;
		// console.log("disabled");
	}
	else{
		btnCreate.disabled = false;
		btnJoin.disabled = false;
		// console.log("enabled");
	}
}

inputNickname.addEventListener('keyup', checkNickname);
btnCreate.addEventListener('click', createGame);
btnJoin.addEventListener('click', joinGame);

//button onclick
function createGame() {
	savePlayer(createGameUrl);
}

//button onclick
function joinGame() {
	savePlayer(joinGameUrl);
}

function savePlayer(nextPage){
	saveNickname();
	
	var nickname = window.sessionStorage.getItem('nickname');
	console.log(nickname);
	try {var socket = io('/DB');}
	catch (e){
		console.log(e)
	}
	if (socket != undefined){
		socket.emit('newPlayer', nickname);
		socket.on('newPlayerID', function(newPlayerID){
			window.sessionStorage.setItem('playerID', newPlayerID);
			window.location.href = nextPage;
		})
	}
}

//nickname to sessionvariable
function saveNickname(){
	window.sessionStorage.setItem('nickname', inputNickname.value);
}

window.onload = function(){
	console.log("window onload event");
	inputNickname.setAttribute("maxlength", maxNickname);
	inputNickname.focus();
};

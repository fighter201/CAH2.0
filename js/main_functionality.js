console.log("script loaded via defer");
const content = document.getElementById('content');
const inputNickname = document.getElementById('nickname');
const btnCreate = document.getElementById('btnCreate');
const btnJoin = document.getElementById('btnJoin');
const btnCheck = document.getElementById('validate');
const maxNickname = 32;
let nickname;

//useful functions ================================================
String.prototype.isEmpty = function(){
	console.log("length"+this.length);
	return (this.length === 0 || !this.trim());
};
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
	
	if(empty(inputNickname.value) || inputNickname.value.length > maxNickname){
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

inputNickname.addEventListener('keyup', function(){
	checkNickname();
});
/*
btnCheck.addEventListener('click', function(){ //evtl. nutzen, um gleiche Nicknames zu verbieten
	checkNickname();
	if(btnCreate.enabled) switchClass(inputNickname, 'valid', 'invalid');
	else{ switchClass(inputNickname, 'invalid', 'valid'); }
});*/

//nickname to sessionvariable
function saveNickname(){
	window.sessionStorage.setItem(nickname, inputNickname);
}

//button onclick
function createGame() {
	saveNickname();
	window.location.href='/createGame.html';
}

//button onclick
function joinGame() {
	saveNickname();
	window.location.href='/joinGame.html';
}

window.onload = function(){
	console.log("window onload event");
};
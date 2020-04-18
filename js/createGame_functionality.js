console.log("loaded createGame_functionality.js");
const inputGameName = document.getElementById('gameName');
const inputMaxPlayer = document.getElementById('maxPlayer');
const inputMaxPoints = document.getElementById('maxPoints');
const inputPassword = document.getElementById('password');
const inputNumbCard = document.getElementById('numbCards');
const ulSetList = document.getElementById('setList');
const gameNameError = document.getElementById('gameNameError');
const numbError = document.getElementById('numbError');
const btnApply = document.getElementById('apply');
const main = document.getElementById('main');
var mainMinSize = 400; //für keine card sets aufgelistet, pro set +20

var gameName;
var writables ={
	name: inputGameName,
	players: inputMaxPlayer,
	points: inputMaxPoints,
	password: inputPassword
};

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

function updateMainMinSize(){
	main.style.minHeight = mainMinSize+"px";
}

var availableCardSets = [];
function CardSet(setName){
	this.setName = setName;
	this.id = setName.replace(/\s/g, "_");
	
	console.log("id:"+this.id);
	console.log("setName:"+this.setName);
	
	//create html elements for list entry
	var li = htmlElement('li');
	var checkBox = htmlElement('input', this.id);
	checkBox.setAttribute("type", "checkBox");
	checkBox.setAttribute("name", this.id);
	var label = htmlElement('label',"label_"+this.id, setName);
	label.setAttribute("for", this.id);
	
	li.appendChild(checkBox);
	li.appendChild(label);
	
	this.html = li;
}
//alle Card Sets hierüber einfügen!
function addCardSet(setName){
	var newSet = new CardSet(setName);
	availableCardSets.push(newSet);
	ulSetList.appendChild(newSet.html);
	mainMinSize += 29;
	updateMainMinSize();
}

function checkEntries(){
	var allCorrect = true;
	for (x in writables){
		if(writables[x].value.isEmpty()){
			allCorrect = false;
			console.log(x+" is empty");
		}
	}
	if(allCorrect) btnApply.disabled = false;
	else{ btnApply.disabled = true;}
}


function createLobby() {
	gameName = inputGameName.value;
	console.log('input content: ' + gameName);
	
	//das mit dem Leerzeichen war just for fun d.h. wir können es eigentlich raus nehmen
	//test for whitespaces
<<<<<<< HEAD
	// if (gameName.includes(' ')) {
	// 	console.log('no valid gameID');
	// 	switchClass(gameNameError, 'show', 'hide');
	// 	/*addClass(inputGameName, 'inputError');*/
	// 	return;
	// }
	// else{ switchClass(gameNameError, 'hide', 'show');}
=======
	if (gameName.includes("<") || gameName.includes(">")) {
		console.log('no valid gameID');
		switchClass(gameNameError, 'show', 'hide');
		/*addClass(inputGameName, 'inputError');*/
		return;
	}
	else{ switchClass(gameNameError, 'hide', 'show');}
>>>>>>> 82688fdc1a50e920e4c7496f1922731f9875c4b7
	
	//test for invalid characters in number inputs
	if(inputMaxPlayer.value<3||inputMaxPoints.value<1){
		switchClass(numbError, 'show', 'hide');
		return;
	}
	else{ switchClass(numbError, 'hide', 'show');}

	var settings = extractSettings();
	var socket = io('/lobby');
	var playerID = window.sessionStorage.getItem('playerID');
	console.log(window.sessionStorage.getItem('nickname'))
	socket.emit('createLobby', settings, playerID, window.sessionStorage.getItem('nickname'));
}

function extractSettings() {
	// console.log('extractSettings now');
	var packagesList = document.getElementById('setList').children;
	// console.log(packagesList);
	// console.log(packagesList.length);
	var packageArr = [] //[{packagename:String, checked:boolean}]
	for(var i=0; i<packagesList.length; i++){
		packageArr.push({packagename:packagesList[i].innerText, checked:packagesList[i].firstChild.checked})
		// console.log(packageArr);
	}
	return {
		name : inputGameName.value,
		maxPlayer : inputMaxPlayer.value,
		maxPoints : inputMaxPoints.value,
		packages : packageArr,
		password : inputPassword.value,
		numHand : inputNumbCard.value
	};
}

function loadPackages(){
	var dbSocket = io('/DB');
	dbSocket.emit('packagesReq');
	dbSocket.on('packages', function(result) {
		result.forEach(element => {
			addCardSet(element.name);
		});
	});
}

btnApply.addEventListener('click', createLobby);

window.onload = function(){
	loadPackages();
	checkEntries();
	for(x in writables) writables[x].addEventListener('keyup', checkEntries);
	addCardSet("automatically added	1");
};

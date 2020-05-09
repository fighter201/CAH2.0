console.log("loaded game_functionality.js");

var sb; //Scoreboard 
var gc; //gameContainer

//requires usefulFunctions.js 

function ScoreBoardPlayer(name, score){
	this.name = name;
	this.id = "player_"+name.replace(/\s/g, "_");
	this.score = score;
	this.rank = 0;
	this.html;
	
	var trPlayer = htmlElement('tr', this.id);
	var tdName = htmlElement('td');
	var spanName = htmlElement('span', "", this.name);
	this.tdScore = htmlElement('td', "", this.score);
	this.tdRank = htmlElement('td', "", "# "+this.rank);
	
	tdName.addClasses(['tableCell', 'nameCell']);
	spanName.addClass('scoreboardName');
	this.tdScore.addClasses(['tableCell','scoreCell']);
	this.tdRank.addClasses(['tableCell', 'rankCell']);
	
	tdName.appendChild(spanName);
	trPlayer.appendChild(tdName);
	trPlayer.appendChild(this.tdScore);
	trPlayer.appendChild(this.tdRank);
	this.html = trPlayer;
	
	//Methoden
	this.updateScoreBoard = function(){
		this.tdScore.innerHTML = this.score;
		this.tdRank.innerHTML = "# "+this.rank;
	};
	this.increaseScore = function(){
		this.score++;
	};
	this.setRank = function(rnk){
		this.rank = rnk;
		//console.log(this.name+"	-> setRank() to "+rnk);
	};
	this.getScore = function(){ return this.score; }
	this.getRank = function(){ return this.rank; }
	
}
//					string[]
function ScoreBoard(players){
	this.scoreBoardPlayers = [];
	
	for(x in players){
		var newPlayer = new ScoreBoardPlayer(players[x], 0);
		this.scoreBoardPlayers.push(newPlayer);
		gc.tableScoreboard.appendChild(newPlayer.html);
	}
	
	/*Methoden: countRound() -> Rundenzahl erhöhen; 
				addPlayer(name) -> Spieler hinzufügen;
				addPoint(playerName) -> Punkt an Spieler vergeben;
	*/
	this.addPlayer = function(name){
		var newPlayer = new ScoreBoardPlayer(name, 0);
		this.scoreBoardPlayers.push(newPlayer);
		gc.tableScoreboard.appendChild(newPlayer.html);
		this.doRanking();
	}
	this.getPlayer = function(name){
		for(x in this.scoreBoardPlayers){
			if(name==this.scoreBoardPlayers[x].name) return this.scoreBoardPlayers[x];
		}
	}
	this.addPoint = function(playerName){
		var p = this.getPlayer(playerName);
		p.increaseScore();
		sb.doRanking();
	}
	this.doRanking = function(){
		var p = this.scoreBoardPlayers;
		var r = [];
		//add: push->end; unshift->beginning
		//remove: pop->end; shift->beginning
		
		//sort players by points
		for(x in p){
			p[x].setRank(0);
			if(x==0) r.push(x); 
			else if(x!=0){
				let placed = false;
				for(i in r){
					if(p[x].score > p[r[i]].score){
						console.log("p["+x+"].score:"+p[x].score+", p["+r[i]+"].score:"+p[r[i]].score);
						r.splice(i, 0, x); //insert before element with lower score
						placed = true;
						break;
					}
				}
				if(!placed) r.push(x);
			}
		}
		
		//set Rank based on position in r
		var beforeScore = 0;
		var playersSameRank = 0;
		for(i in r){
			p[r[i]].html.removeClass('first');
			if(i==0){
				p[r[i]].setRank(1);
				p[r[i]].html.addClass('first');
			}
			else if(p[r[i]].score==beforeScore){
				p[r[i]].rank = i-playersSameRank;
				playersSameRank++;
				if(p[r[i]].rank==1) p[r[i]].html.addClass('first');
			}
			else{ 
				p[r[i]].setRank(parseInt(i)+1); 
				playersSameRank = 0;
			}
			
			beforeScore = p[r[i]].score;
		}
		for(x in p) p[x].updateScoreBoard();
	};
}
//Speicherort für alle relevanten Settings
function GameContainer(){
	this.content_blackScore = document.getElementById('content_blackScore');
	this.blackCardCont = document.getElementById('blackCardCont');
	this.scoreBoardCont = document.getElementById('scoreBoardCont');
	this.divide_afterBlackScore = document.getElementById('divide_afterBlackScore');
	this.content_czarWait = document.getElementById('content_czarWait');
	this.content_whiteCards = document.getElementById('content_whiteCards');
	this.content_chooseWinner = document.getElementById('content_chooseWinner');
	this.content_endscreen = document.getElementById('content_endscreen');
	
	this.tableScoreboard = document.getElementById('scoreboard');
	this.whiteCardContainer = document.getElementById('whiteCards');
	this.chooseCardContainer = document.getElementById('chooseCards');
	
	this.blackCard = "default black Card";
	this.answerNum = 0;
	this.burnable = true;
	this.whiteCards = [];
	this.czar = false;
	this.blankCardsAllowed = false;
	
	this.getHtmlOf = function(elementName){
		switch(elementName){
			case "content_blackScore": return this.content_blackScore;
			case "blackCardCont": return this.blackCardCont;
			case "scoreBoardCont": return this.scoreBoardCont;
			case "divide_afterBlackScore": return this.divide_afterBlackScore;
			case "content_czarWait": return this.content_czarWait;
			case "content_whiteCards": return this.content_whiteCards;
			case "content_chooseWinner": return this.content_chooseWinner;
			case "content_endscreen": return this.content_endscreen;
			default: return;
		}
	}
	this.setVisible = function(elementName, status){
		var e = this.getHtmlOf(elementName);
		if(status) e.switchClass('show', 'hide');
		else{ e.switchClass('hide', 'show'); }
		console.log("setVisible -> "+elementName+":"+status);
	}
	this.getWhiteCard = function(index){
		if(index > this.whiteCards.length) return;
		return this.whiteCards[index];
	}
	this.setBlackCard = function(text, answerNum){
		this.blackCard = text;
		this.answerNum = answerNum;
		document.getElementById('blackCardText').innerHTML = text;
		for(x in this.whiteCards) this.whiteCards[x].applyAnswerPossibilities();
		//evtl: wenn Zeichenlänge überschritten wird, Schrift kleiner machen
	}
	this.setBurnable = function(burnable){
		this.burnable = burnable;
	}
}
function Card(text, index, burnable){
	this.text = "Hallo ich bin der Inhalt einer weissen Karte. Und das sind meine Gedanken.";
	this.burnable = true;  //based on game settings
	this.index = -1;
	this.answerNum = 0;
	
	this.text = text;
	this.burnable = burnable;
	this.index = index;
	
	//Generate HTMLElements
	var divCard = htmlElement('div', "card_"+this.index);
	var divClose = htmlElement('div');
	this.spanClose = htmlElement('span', "card_"+this.index);
	var divText = htmlElement('div');
	var spanText = htmlElement('span', "", this.text);
	this.divBottom = htmlElement('div');
	this.button1;
	this.button2;
	this.button3;
	
	divCard.addClass('card');
	divClose.addClass('card_close');
	if(this.burnable) divClose.addClass('show');
	this.spanClose.addClass('close');
	divText.addClass('card_text');
	this.divBottom.addClass('card_bottom');
	
	divClose.appendChild(this.spanClose);
	divText.appendChild(spanText);
	divCard.appendChild(divClose);
	divCard.appendChild(divText);
	divCard.appendChild(this.divBottom);
	this.html = divCard;
	
	//Methoden
	this.applyAnswerPossibilities = function(){
		if(this.button1){
			this.divBottom.removeChild(this.button1);
			delete this.button1;
		}
		if(this.button2){
			this.divBottom.removeChild(this.button2);
			delete this.button2;
		}
		if(this.button3){
			this.divBottom.removeChild(this.button3);
			delete this.button3;
		}
		switch(gc.answerNum){
			case 0:
				break;
			case 1:
				this.button1 = htmlElement('button', "card_"+this.index, "Play");
				this.divBottom.appendChild(this.button1);
				break;
			case 2:
				this.button1 = htmlElement('button', "card_"+this.index, "Play as 1");
				this.button2 = htmlElement('button', "card_"+this.index, "Play as 2");
				this.divBottom.appendChild(this.button1);
				this.divBottom.appendChild(this.button2);
				break;
			case 3:
				this.button1 = htmlElement('button', "card_"+this.index, "Play 1");
				this.button2 = htmlElement('button', "card_"+this.index, "Play 2");
				this.button3 = htmlElement('button', "card_"+this.index, "Play 3");
				this.divBottom.appendChild(this.button1);
				this.divBottom.appendChild(this.button2);
				this.divBottom.appendChild(this.button3);
				break;
			default:
				console.log("setAnserNum("+num+") failed");
				break;
		}
		
		if(this.button1){
			this.button1.addEventListener('click', function(){
				var cardText = gc.getWhiteCard(parseInt(this.id.substring(this.id.indexOf("_")+1))).text;
				console.log("pressed button1 on: "+cardText);
			});
		}
		if(this.button2){
			this.button2.addEventListener('click', function(){
				var cardText = gc.getWhiteCard(parseInt(this.id.substring(this.id.indexOf("_")+1))).text;
				console.log("pressed button2 on: "+this.text);
			});
		}
		if(this.button3){
			this.button3.addEventListener('click', function(){
				var cardText = gc.getWhiteCard(parseInt(this.id.substring(this.id.indexOf("_")+1))).text;
				console.log("pressed button3 on: "+this.text);
			});
		}
	}
	
	this.spanClose.addEventListener('click', function(){
		var cardText = gc.getWhiteCard(parseInt(this.id.substring(this.id.indexOf("_")+1))).text;
		console.log("pressed spanClose on: "+cardText);
	});
}

/*
var gameID = window.sessionStorage.getItem('gameID');
    var playerID = 'defplayer';
    // var playerID = window.sessionStorage.getItem('playerID');
    socket.emit('inGame', gameID, playerID);
    socket.on('roundInfo', function(czar, BC, WC, scoreboard) {
        //display data
        if (czar) {
            //display Czar waiting screen
        } else {
            //display Slaves choose screen
        }

});
*/

function addCard(cardText, container){
	var newCard = new Card(cardText, gc.whiteCards.length, gc.burnable);
	newCard.applyAnswerPossibilities();
	container.appendChild(newCard.html);
	gc.whiteCards.push(newCard);
}
//								string[]
function addCards_slaveWhiteCards(cards){
	for(x in cards) addCard(cards[x], gc.whiteCardContainer);
}
function addCards_chooseWinner(cards){
	gc.answerNum = 0;
	for(x in cards) addCard(cards[x], gc.chooseCardContainer);
}
function addCustomCard(customText){ //für blank Cards
	if(gc.blankCardsAllowed) addCard(customText, gc.whiteCardContainer);
}

function setMode_slaveWhiteCards(){
	gc.setVisible("blackCardCont", true);
	gc.setVisible("scoreBoardCont", true);
	gc.setVisible("content_czarWait", false);
	gc.setVisible("content_chooseWinner", false);
	gc.setVisible("content_endscreen", false);
	gc.setVisible("content_whiteCards", true);
	gc.setVisible("divide_afterBlackScore", true);
}
function setMode_czarWait(){
	gc.setVisible("blackCardCont", true);
	gc.setVisible("scoreBoardCont", true);
	gc.setVisible("content_czarWait", true);
	gc.setVisible("content_chooseWinner", false);
	gc.setVisible("content_endscreen", false);
	gc.setVisible("content_whiteCards", false);
	gc.setVisible("divide_afterBlackScore", true);
}
function setMode_chooseWinner() {
	gc.setVisible("blackCardCont", true);
	gc.setVisible("scoreBoardCont", true);
	gc.setVisible("content_czarWait", false);
	gc.setVisible("content_chooseWinner", true);
	gc.setVisible("content_endscreen", false);
	gc.setVisible("content_whiteCards", false);
	gc.setVisible("divide_afterBlackScore", true);
}
function setMode_endscreen(){
	gc.setVisible("blackCardCont", false);
	gc.setVisible("scoreBoardCont", true);
	gc.setVisible("content_czarWait", false);
	gc.setVisible("content_chooseWinner", false);
	gc.setVisible("content_endscreen", true);
	gc.setVisible("content_whiteCards", false);
	gc.setVisible("divide_afterBlackScore", false);
}

window.onload = function(){
	gc = new GameContainer();
	
	//Generate test players
	sb = new ScoreBoard(["Player1", "Player2", "dritterSpieler", "der schlechteste Spieler ever!!!"]);
	sb.addPlayer("ich bin auch dabei");
	for(let i = 0; i<2; i++){ sb.getPlayer("Player2").increaseScore();}
	for(let i = 0; i<3; i++){ sb.getPlayer("ich bin auch dabei").increaseScore();}
	sb.getPlayer("dritterSpieler").increaseScore();
	sb.addPoint("Player1");
	
	//init round (white cards legen)
	setMode_slaveWhiteCards();
	gc.setBlackCard("Das hier ________ ist eine automatisch generierte schwarze Karte ________ .", 2);
	addCards_slaveWhiteCards(["Ich bin die erste Karte.",
	 						"ich passe nicht in die Lücke, aber bin trotzdem hier.",
	 						"Hallo, das ist die am besten passende Karte",
	 						"Und zu guter letzt noch eine weitere nutzlose Karte"]);
};
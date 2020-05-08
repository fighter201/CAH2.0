console.log("loaded game_functionality.js");
const head = document.getElementById('head');
const tableScoreboard = document.getElementById('scoreboard');
const whiteCardContainer = document.getElementById('whiteCards');
const chosseCardContainer = document.getElementById('chooseCards');
var sb; //Scoreboard 
var gc; //gameContainer

//requires usefulFunctions.js 

//scoreboard: rounds played/to go, ranking
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
//					number		string[]
function ScoreBoard(numbRounds, players){
	this.numbRounds = numbRounds;
	this.nowRound = 0;
	this.scoreBoardPlayers = [];
	
	for(x in players){
		var newPlayer = new ScoreBoardPlayer(players[x], 0);
		this.scoreBoardPlayers.push(newPlayer);
		tableScoreboard.appendChild(newPlayer.html);
	}
	
	/*Methoden: countRound() -> Rundenzahl erhöhen; 
				addPlayer(name) -> Spieler hinzufügen;
				addPoint(playerName) -> Punkt an Spieler vergeben;
	*/
	this.countRound = function(){ this.nowRound++;}
	this.addPlayer = function(name){
		var newPlayer = new ScoreBoardPlayer(name, 0);
		this.scoreBoardPlayers.push(newPlayer);
		tableScoreboard.appendChild(newPlayer.html);
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
		
		//console.log("first time r[i]");
		//for(i in r) console.log(r[i]);
		
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
					//console.log("wasn't bigger: "+x);
				}
				if(!placed){
					r.push(x);
					//console.log("pushed "+x);
				}
			}
		}
		console.log("second time r[i]");
		for(i in r) console.log(r[i]+" score:"+p[r[i]].score);
		
		//set Rank based on position in r
		var beforeScore = 0;
		var playersSameRank = 0;
		for(i in r){
			//console.log("doRanking::findRank	-> r["+i+"]:"+r[i]+" name:"+p[r[i]].name);
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
		//console.log("third time r[i]");
		//for(i in r) console.log(r[i]+" score:"+p[r[i]].score);
	};
}
function GameContainer(){
	this.content_blackScore = document.getElementById('content_blackScore');
	this.divide_afterBlackScore = document.getElementById('divide_afterBlackScore');
	this.content_czarWait = document.getElementById('content_czarWait');
	this.content_whiteCards = document.getElementById('content_whiteCards');
	this.content_chooseWinner = document.getElementById('content_chooseWinner');
	this.content_endscreen = document.getElementById('content_endscreen');
	//TODO: Auswahl Rundengewinner, Endscreen
	
	this.getHtml = function(elementName){
		switch(elementName){
			case "content_blackScore": return this.content_blackScore;
			case "divide_afterBlackScore": return this.divide_afterBlackScore;
			case "content_czarWait": return this.content_czarWait;
			case "content_whiteCards": return this.content_whiteCards;
			case "content_chooseWinner": return this.content_chooseWinner;
			case "content_endscreen": return this.content_endscreen;
			default: return;
		}
	}
	this.setVisible = function(elementName, status){
		var e = this.getHtml(elementName);
		if(status) e.switchClass('show', 'hide');
		else{ e.switchClass('hide', 'show'); }
		console.log("setVisible -> "+elementName+":"+status);
	}
}
function Card(text, hasAnswer, hasDoubleAnswer){
	this.text = "Hallo ich bin der Inhalt einer weissen Karte. Und das sind meine Gedanken.";
	this.burnable = true;  //based on game settings
	this.hasAnswer = true;
	this.hasDoubleAnswer = false; //based on game settings
	
	this.text = text;
	this.hasAnswer = hasAnswer;
	this.hasDoubleAnswer = hasDoubleAnswer;
	
	//Generate HTMLElements
	var divCard = htmlElement('div');
	var divClose = htmlElement('div');
	this.spanClose = htmlElement('span');
	var divText = htmlElement('div');
	var spanText = htmlElement('span', "", this.text);
	var divBottom = htmlElement('div');
	this.button1;
	this.button2;
	if(this.hasDoubleAnswer){
		this.button1 = htmlElement('button', "", "Play as 1");
		this.button2 = htmlElement('button', "", "Play as 2");
	}
	else{ this.button1 = htmlElement('button', "", "Play"); }
	
	divCard.addClass('card');
	divClose.addClass('card_close');
	if(this.burnable) divClose.addClass('show');
	this.spanClose.addClass('close');
	divText.addClass('card_text');
	divBottom.addClass('card_bottom');
	
	divClose.appendChild(this.spanClose);
	divText.appendChild(spanText);
	divBottom.appendChild(this.button1);
	if(this.hasDoubleAnswer) divBottom.appendChild(this.button2);
	divCard.appendChild(divClose);
	divCard.appendChild(divText);
	divCard.appendChild(divBottom);
	this.html = divCard;
	
	this.button1.addEventListener('click', function(){
		/*
		var innerhtml = this.innerHTML;
		var namePos = innerhtml.indexOf("lobbyName");
		var nameStart = innerhtml.indexOf(">", namePos);
		var nameEnd = innerhtml.indexOf("<", nameStart);
		var name = innerhtml.substring(nameStart+1, nameEnd);
		*/
		
		console.log("pressed button1 on: "+this.text);
	});
	this.button2.addEventListener('click', function(){
		console.log("pressed button2 on: "+this.text);
	});
	this.spanClose.addEventListener('click', function(){
		console.log("pressed spanClose on: "+this.text);
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

//TODO: Wenn Karten mit mehreren Antworten, Parameterübergabe hinzufügen
//								string[]
function addCards_slaveWhiteCards(cards, hasDoubleAnswer){
	for(x in cards) whiteCardContainer.appendChild((new Card(cards[x], true, hasDoubleAnswer)).html);
}
function addCards_chooseWinner(cards){
	for(x in cards) chooseCardContainer.appendChild((new Card(cards[x], false, false)).html);
}

function setMode_slaveWhiteCards(){
	gc.setVisible("content_blackScore", true);
	gc.setVisible("content_czarWait", false);
	gc.setVisible("content_chooseWinner", false);
	gc.setVisible("content_endscreen", false);
	gc.setVisible("content_whiteCards", true);
}
function setMode_czarWait(){
	gc.setVisible("content_blackScore", true);
	gc.setVisible("content_czarWait", true);
	gc.setVisible("content_chooseWinner", false);
	gc.setVisible("content_endscreen", false);
	gc.setVisible("content_whiteCards", false);
}
function setMode_chooseWinner() {
	gc.setVisible("content_blackScore", true);
	gc.setVisible("content_czarWait", false);
	gc.setVisible("content_chooseWinner", true);
	gc.setVisible("content_endscreen", false);
	gc.setVisible("content_whiteCards", false);
}
function setMode_endscreen(){
	gc.setVisible("content_blackScore", false);
	gc.setVisible("content_czarWait", false);
	gc.setVisible("content_chooseWinner", false);
	gc.setVisible("content_endscreen", true);
	gc.setVisible("content_whiteCards", false);
}

window.onload = function(){
	gc = new GameContainer();
	sb = new ScoreBoard(10, ["Player1", "Player2", "dritterSpieler", "der schlechteste Spieler ever!!!"]);
	sb.addPlayer("ich bin auch dabei");
	sb.countRound();
	for(let i = 0; i<2; i++){ sb.getPlayer("Player2").increaseScore();}
	for(let i = 0; i<3; i++){ sb.getPlayer("ich bin auch dabei").increaseScore();}
	sb.getPlayer("dritterSpieler").increaseScore();
	sb.addPoint("Player1");
	
	setMode_slaveWhiteCards();
	addCards_slaveWhiteCards(["Ich bin die erste Karte.",
	 						"ich passe nicht in die Lücke, aber bin trotzdem hier.",
	 						"Hallo, das ist die am besten passende Karte",
	 						"Und zu guter letzt noch eine weitere nutzlose Karte"], true);
};
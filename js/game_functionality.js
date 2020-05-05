console.log("loaded game_functionality.js");
const head = document.getElementById('head');
const tableScoreboard = document.getElementById('scoreboard');

//requires usefulFunctions.js 

//scoreboard: rounds played/to go, ranking
function ScoreBoardPlayer(name, score){
	this.name = name;
	this.id = "player_"+name.replace(/\s/g, "_");
	this.score = score;
	this.rank = 0;
	this.html;
	
	var trPlayer = htmlElement('tr', this.id);
	var tdName = htmlElement('td', "", this.name);
	this.tdScore = htmlElement('td', "", this.score);
	this.tdRank = htmlElement('td', "", "#"+this.rank);
	
	tdName.addClasses(['tableCell', 'nameCell']);
	this.tdScore.addClasses(['tableCell','scoreCell']);
	this.tdRank.addClasses(['tableCell', 'rankCell']);
	
	trPlayer.appendChild(tdName);
	trPlayer.appendChild(this.tdScore);
	trPlayer.appendChild(this.tdRank);
	this.html = trPlayer;
	
	//Methoden
	this.updateScore = function(score, rank){
		this.score = score;
		this.rank = rank;
		this.tdScore.innerHTML = score;
		this.tdRank.innerHTML = "#"+rank;
	};
	this.increaseScore = function(){
		this.score++;
	}
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
	}
	this.getPlayer = function(name){
		for(x in this.scoreBoardPlayers){
			if(name==this.scoreBoardPlayers[x].name) return this.scoreBoardPlayers[x];
		}
	}
	this.addPoint = function(playerName){
		var p = this.getPlayer(playerName);
		p.increaseScore();
		p.updateScore(p.getScore(), 0);
	}
	this.doRanking = function(){
		
	};
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

window.onload = function(){
	var scoreBoard = new ScoreBoard(10, ["Player1", "Player2", "dritterSpieler", "der schlechteste Spieler ever!!!"]);
	scoreBoard.addPlayer("ich bin auch dabei");
	scoreBoard.countRound();
	scoreBoard.addPoint("Player1");
};
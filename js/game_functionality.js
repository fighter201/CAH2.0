console.log("loaded game_functionality.js");
const head = document.getElementById('head');
const tableScoreboard = document.getElementById('scoreboard');
var sb; 

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
		console.log(this.name+"	-> setRank() to "+rnk);
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
		
		console.log("first time r[i]");
		for(i in r) console.log(r[i]);
		
		//sort players by points
		for(x in p){
			p[x].setRank(0);
			if(x==0) r.push(x); 
			else if(x!=0){
				let placed = false;
				for(i in r){
					if(p[x].score > p[r[i]].score){
						/*console.log("r.unshift("+x+") before "+i+":contains now "+*/r.unshift(x)/*)*/;
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
		for(i in r) console.log(r[i]);
		
		//set Rank based on position in r
		var beforeScore = 0;
		var playersSameRank = 0;
		for(i in r){
			console.log("doRanking::findRank	-> r["+i+"]:"+r[i]+" name:"+p[r[i]].name);
			if(i==0){
				p[r[i]].setRank(1);
				p[r[i]].html.addClass('first');
			}
			else if(p[r[i]].score==beforeScore){
				p[r[i]].rank = i-playersSameRank;
				playersSameRank++;
			}
			else{ 
				p[r[i]].setRank(parseInt(i)+1); 
				playersSameRank = 0;
			}
			
			beforeScore = p[r[i]].score;
		}
		for(x in p) p[x].updateScoreBoard();
		console.log("third time r[i]");
		for(i in r) console.log(r[i]+" score:"+p[r[i]].score);
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
	sb = new ScoreBoard(10, ["Player1", "Player2", "dritterSpieler", "der schlechteste Spieler ever!!!"]);
	sb.addPlayer("ich bin auch dabei");
	sb.countRound();
	for(let i = 0; i<2; i++){ sb.getPlayer("Player2").increaseScore();}
	for(let i = 0; i<3; i++){ sb.getPlayer("ich bin auch dabei").increaseScore();}
	sb.getPlayer("dritterSpieler").increaseScore();
	sb.addPoint("Player1");
};
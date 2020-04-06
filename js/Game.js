const Player = require('./js/Player.js')

class Game {

    #id='';
    #password='';
    #gamestate=''; //ACHTUNG: soll nur "Lobby", "Running", "End" annehmen
    #numPlayer=0;
    #maxPlayer=3; // min. 3
    #WC=[];
    #BC=[];
    #currentBC='';
    #master=''; //socketID
    // #settings={}; //{numHand:int, maxPoint:int }
    #numHand=5;
    #maxPoints=10;
    #winner='';
    #czar={}; // Playerobj
    #players=[]; //Playerobjekte

    constructor(id, password, maxPlayer, master, packages) {
        if (maxPlayer < 3) {
            return false;
        }

        this.#id = id;
        this.#password = password;
        this.#maxPlayer = maxPlayer;
        this.#master = master;

        //load WC BC from packages
        this.#WC=this.loadWC(packages);
        this.#BC=this.loadBC(packages);
    }

    removePlayer(playerID) {
        if (!this.playerInGame(oldPlayer)){
            return false;
        }
        this.#players.filter(element => {
            return element.valueOf()!==playerID;
        });
    }

    addPlayer(newPlayer){
        //player instanceof Player.js
        if (this.#numPlayer >= this.#maxPlayer) {
            return false;
        } else if (this.#gamestate!='Lobby') {
            return false;
        } else {
            if (this.playerInGame(newPlayer)) {
                return false;
            }
            this.#players.push(newPlayer);
            this.#numPlayer++;
            return true;
            
        }
    }

    startGame(){
        if (this.#gamestate!=='Lobby'){
            return false;
        }
        this.#gamestate="Running";
        this.newRound();
    }

    newRound(){
        if (!this.checkForWinner()){
            this.newCzar;
            this.newBC();
            this.fillHands();
            return true;
        }
        return false;
    }

    loadWC(packages) {
        //TODO
        return [];
    }

    loadBC(packages){
        //TODO
        return [];
    }

    newBC() {
        var ranNum = Math.floor(Math.random()*this.#BC.length);
        this.#currentBC = this.#BC[ranNum];
        this.#BC.splice(ranNum, 1);
    }

    newCzar() {
        var index = this.#players.indexOf(this.#czar);
        if (index === -1){
            index = Math.floor(Math.random()*this.#players.length);
        }
        if (index+1===this.#players.length){
            this.#czar=this.#players[0];
        } else {
            this.#czar=this.#players[index++];
        }
    }

    fillHands() {
        this.#players.forEach(player => {
            while (player.numHand() <= this.#settings.numHand){
                var ranNum = Math.floor(Math.random()*this.#WC.length);
                player.addWC(this.#WC[ranNum]);
                this.#WC.splice(ranNum, 1);
            }
        });
    }

    getScoreboard(){
        return this.#players.sort(function(a, b) {
            return a-b
        });
    }

    checkForWinner(){
        this.#players.sort(function(a,b){return a-b})
        if (this.#players[0].score>=this.#maxPoints) {
            this.#gamestate='End';
            this.#winner=this.#players[0];
            return true;
        }
        return false;
    }

    roundWinner(playerID){
        this.getPlayer(playerID).won;
        this.newRound();
    }

    //if return is null player is not in this game
    getPlayer(playerID){
        for (player in this.#players){
            if(playerID===player.valueOf()){
                return player;
            }
        }
        return null;
    }

    get id(){
        return this.#id;
    }

    get password(){
        return this.#password;
    }

    get gamestate(){
        return this.#gamestate;
    }

    set gamestate(gamestate){
        if (gamestate==='Lobby' || gamestate==='Running' || gamestate==='End'){ 
            return false;
        }
        this.#gamestate = gamestate;
    }

    get numPlayer() {
        return this.#numPlayer;
    }

    get maxPlayer(){
        return this.#maxPlayer;
    } 

    get currentBC(){
        return this.#currentBC;
    }

    get master(){
        return this.#master
    }

    valueOf(){
        return this.#id;
    }

}

module.exports = Game;
const Player = require('./Player.js')
const dbConnection = require('../sql/dbConnection');

class Game {

    #id='';
    #name='';
    #password='';
    #gamestate=''; //ACHTUNG: soll nur "Lobby", "Running", "End" annehmen
    #numPlayer=0;
    #maxPlayer=3; // min. 3
    #WC=[];
    #BC=[];
    #currentBC='';
    #currentWC=''; //{socketID, [WC]}
    #master=''; //socketID
    // #settings={}; //{numHand:int, maxPoint:int }
    #numHand=5;
    #maxPoints=10;
    #packages = []; //[packageID]
    #winner='';
    #czar={}; // Playerobj
    #players=[]; //Playerobjekte
    #ready=false; //true wenn startGame erfolgreich war

    constructor(id, name, password, maxPlayer, numHand, packages) {
        if (maxPlayer < 3) {
            return false;
        }

        this.#id = id;
        this.#name = name;
        this.#password = password;
        this.#maxPlayer = maxPlayer;
        this.#numHand = numHand;
        this.#packages = packages;
        
        this.#gamestate = 'Lobby';
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
            // if (this.playerInGame(newPlayer)) {
            //     return false;
            // }
            this.#players.push(newPlayer);
            this.#numPlayer++;
            return true;
        }
    }

    startGame(){
        if (this.#gamestate!=='Lobby'){
            return false;
        }       
        
        var WCIDs = [];
        var BCIDs = [];
        var req = 'SELECT BC, WC FROM packages WHERE';
        
        for (var i = 0; i<this.#packages.length; i++){
            if (i==0){
                req += ' name = "' + this.#packages[i].packagename + '"';
            } else {
                req += ' OR name = "' + this.#packages[i].packagename + '"';
            }
        }
        // console.log(req);
        // var gameID = this.gameID;
        var obj = this;
        dbConnection.query(req, function(err, result, fields){
            for (var i = 0; i<result.length; i++){
                WCIDs.push(result[i].WC)
                BCIDs.push(result[i].BC)
            }
            console.log(WCIDs);
            console.log(BCIDs);
            obj.newRound();
            obj.#gamestate="Running";
            obj.#ready=true;
        });
        console.log('exiting method');
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
            while (player.numHand() <= this.numHand){
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
        if (this.#players.length===0){
            return false;
        }
        // console.log(this.#players);
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

    get players(){
        return this.#players;
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
        return this.#master;
    }

    set master(master){
        this.#master = master;
    }

    get name(){
        return this.#name;
    }

    get ready(){
        return this.#ready;
    }

    valueOf(){
        return this.#id;
    }

    toString(){
        return '{id: ' + this.#id + ', name: ' + this.#name + ', master: ' + this.#master + ', password: ' + this.#password + '}';
    }
}



module.exports = Game;
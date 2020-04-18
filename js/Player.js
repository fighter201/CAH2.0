class Player {
    /**
     * 
     */
    #id = "";
    #socketID = "";
    #gameID = "";
    #nickname = "";
    #score = 0;
    #hand = [];
    #czar = false;
    #connected = true;
    #inLobby = false;

    constructor(id, nickname) {
        this.#id = id;
        // this.#socketID = socketID;
        this.#nickname = nickname;
        console.log(this.#id, this.#socketID, this.#nickname)
    }

    addWC(WC){
        this.#hand.push(WC);
    }

    numHand(){
        return this.#hand.length;
    }

    get score(){
        return this.#score;
    }

    get connected(){
        return this.#connected;
    }
    
    set connected(connected){
        if (connected==true || connected== false) {
            this.#connected = connected;
        }
        // wrong type of connected;
    }

    get inLobby(){
        return this.#inLobby;
    }

    set inLobby(boolean){
        if (boolean===true || boolean===false){
            this.#inLobby = boolean;
        } else {
            return false;
        }
    }

    get nickname(){
        return this.#nickname;
    }

    get id(){
        return this.#id;
    }

    get socketID(){
        return this.#socketID;
    }

    set socketID(socketID) {
        this.#socketID = socketID;
    }

    won(){
        this.#score++;
    }

    valueOf(){
        return this.#id;
    }

}

module.exports = Player;
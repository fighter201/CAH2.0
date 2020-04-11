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

    constructor(id, socketID, nickname) {
        this.#id = id;
        this.#socketID = socketID;
        this.#nickname = nickname;
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
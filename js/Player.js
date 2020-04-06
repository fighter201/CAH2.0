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

    constructor(socketID, nickname) {
        // this.#userID = userID;
        this.#socketID = socketID;
        this.nickname = nickname;
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

    won(){
        this.#score++;
    }

    valueOf(){
        return this.#id;
    }

}

module.exports = Player;
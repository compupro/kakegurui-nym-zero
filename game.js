/* Utility functions */

/* @param Array o   An array to be shuffled */
function shuffle(o) {
	for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
	return o;
};

/*
Returns a random integer from 0 to n

@param int n   
*/
function randInt(n) {
    return Math.floor(Math.random() * n);
}

class Deck {
    /*
    @param int maxValue     The greatest value of card that will be made. Inclusive.
    @param int copies       The amount of each card value to add to the deck
    */
    constructor(maxValue, copies) {
        this.deck = [];
        for (var card = 0; card <= maxValue; card++) {
            for (var i = 0; i < copies; i++) {
                this.deck.push(card);
            }
        }
        this.shuffle();
    }
    
    shuffle() {
        this.deck = shuffle(this.deck);
    }
    
    /*
    @param int n
    @return int     When n == 1
    @return Array   When n > 1
    */
    deal(n) {
        if (n === 1) { return this.deck.pop(); }
        var cards = []
        for (var i = 0; i < n; i++){
            cards.push(this.deck.pop());
        }
        return cards
    }
    
    getLength() {
        return this.deck.length;
    }
}

class Player {
    /*
    @param bool     isHuman
    @param int      startBalance    The amount of starting money
    @paran string   name
    */
    constructor(isHuman, startBalance, name) {
        this.isHuman = isHuman;
        this.balance = startBalance;
        this.hand = [];
        this.pot = 0;
    }
    
    /*
    @param  int i   The index of the card to be played from hand
    @return int     The value of the card played
    */
    play(i) {
        return this.hand.splice(i, 1)[0];
    }
    
    bet(amount) {
        this.pot += amount;
    }
}

class Game {
    /*
    @param int players      The number of players
    @param int threshold    The threshold for losing a round
    @param int startBalance The amount player starting money
    @param int handSize     The size of the hand at the start of round
    */
    constructor(players, threshold, startBalance, handSize) {
        this.deck = new Deck(3, 10);
        this.threshold = threshold;
        this.handSize = handSize;
        this.round = -1;
        this.playerIndex = 0;
        this.players = [];
        for (var i = 0; i < players-1; i++){
            this.players.push(new Player(false, startBalance, 'AI'));
        }
        this.players.push(new Player(true, startBalance, 'You'));
    }
    
    dealHands() {
        for (const player of this.players){
            player.hand = this.deck.deal(this.handSize);
        }
    }
    
    nextRound() {
        this.round++;
    }
}
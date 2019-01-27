/* Utility functions */

/*
@param Array o
*/
function shuffle(o) {
	for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
	return o;
};

/*
Returns a random integer from 0 to n
*/
function randInt(n) {
    return Math.floor(Math.random() * n);
}

/*
jQuery-like alias for the stupidly long function name
*/
function $(elemId){
    return document.getElementById(elemId);
}

/*
Use this so negative n doesn't return negative answer
*/
function mod(n, m) {
    return ((n % m) + m) % m;
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
        this.balance -= amount;
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
        this.players = [];
        for (var i = 0; i < players-1; i++){
            this.players.push(new Player(false, startBalance, 'AI'));
        }
        this.players.push(new Player(true, startBalance, 'You'));
        this.startingPlayer = randInt(players);
        this.round = -1;
        this.turn = -players; //While turn is negative, we are still betting
        this.total = 0;
    }

    dealHands() {
        for (const player of this.players){
            player.hand = this.deck.deal(this.handSize);
        }
    }

    nextRound() {
        this.dealHands();
        for (const player of this.players){
            player.balance += player.pot;
            player.pot = 0;
        }
        this.round++;
        this.turn = -this.players.length;
    }

    /*
    @param int n    A bet if betting, an index in the hand if playing
    */
    playTurn(n) {
        var player = this.players[mod(this.turn, this.players.length)]
        if (this.turn < 0) { //If betting
            player.bet(n);
        } else { //If playing
            this.total += player.play(n);
            if (this.total > this.threshold){ //If the player loses
                var pot_split = player.pot / (this.players.length - 1);
                for (const p of this.players){
                    if (p !== player) {
                        p.balance += pot_split;
                    }
                }
                player.pot = 0;
                this.nextRound();
            }
        }
        this.turn++;
    }
}

class Display {
    /*
    @param Array[String] playerNames
    @param int           threshold      The threshold for losing a round
    */
    constructor(playerNames, threshold) {
        var gameSurface = $('game-surface');
        gameSurface.innerHTML = ''
        this.players = [];
        this.threshold = threshold;
        for (var i = 0; i < 4; i++){
            var player = document.createElement('div');
            player.classList.add('player');
            player.classList.add('pos' + i);
            player.setAttribute('data-position', i);

            var playerName = playerNames[i];
            var name = document.createElement('div');
            name.classList.add('player-name');
            name.appendChild(document.createTextNode(playerName));
            player.appendChild(name);

            var bet = document.createElement('div');
            bet.classList.add('player-bet');
            bet.appendChild(document.createTextNode('Bet: '));
            var betAmount = document.createElement('span');
            betAmount.classList.add('player-bet-amount');
            betAmount.appendChild(document.createTextNode('0'));
            betAmount.id = 'bet-amount-' + i;
            bet.appendChild(betAmount);
            player.appendChild(bet);

            var cards = document.createElement('div');
            cards.classList.add('player-cards');
            cards.id = 'player-cards-' + i;
            player.appendChild(cards);

            this.players.push(player);
            gameSurface.appendChild(player);
        }

        var gameMiddle = document.createElement('div');
        gameMiddle.id = 'game-middle';
        gameSurface.appendChild(gameMiddle)

        var totalTracker = document.createElement('span');
        totalTracker.id = 'total-tracker';
        totalTracker.appendChild(document.createTextNode('Total: 0/' + this.threshold));
        gameMiddle.appendChild(totalTracker);
    }

    /*
    @param int playerIndex  Index of player in this.players
    @param int bet
    */
    setBet(playerIndex, bet) {
        var betAmountElem = $('bet-amount-' + playerIndex);
        betAmountElem.innerHTML = '';
        betAmountElem.appendChild(document.createTextNode(bet));
    }

    /*
    @param int playerIndex  Index of player in this.players
    @param int cards        The number of cards the player has
    */
    setCards(playerIndex, cards) {
        var cardContainer = $('player-cards-' + playerIndex);
        cardContainer.innerHTML = '';
        for (var i = 0; i < cards; i++){
            var card = document.createElement('div');
            card.classList.add('card-back');
            cardContainer.appendChild(card);
        }
    }

    setTotal(total) {
        var totalTracker = $('total-tracker');
        totalTracker.innerHTML = '';
        totalTracker.appendChild(document.createTextNode('Total:' + total + '/' + this.threshold));
    }
    
    playCard(playerIndex, cardValue) {
        var card = document.createElement('div');
        card.appendChild(document.createTextNode(cardValue));
        $('game-middle').appendChild(card);
        card.classList.add('pos' + playerIndex);
        card.classList.add('card-played');
        setTimeout( function(){
            $('game-middle').removeChild(card);
            }, 1000);
    }
}
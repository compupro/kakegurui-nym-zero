testDeck = new Deck(3, 10);
console.assert(testDeck.deck.filter(x => x===0).length === 10, 'There should have been 10 cards of value 0!');
console.assert(testDeck.getLength() === 40, 'There should only be 40 cards in the deck!');
console.log(testDeck.deck);
console.log(testDeck.deal(1));
console.log(testDeck.deal(1));
console.log(testDeck.deal(1));
console.log(testDeck.deal(4));
console.log(testDeck.deal(4));
console.assert(testDeck.getLength() === (40 - 11), 'Incorrect number of cards in deck after dealing!')

testPlayer = new Player(false, 100, 'test player');
testPlayer.bet(1);
console.assert(testPlayer.pot === 1, 'Player should be betting only 1!');
testPlayer.hand = testDeck.deal(4);
console.log(testPlayer.hand);
console.log(testPlayer.play(0));
console.log(testPlayer.hand);

testGame = new Game(4, 1, 200, 4);
testGame.nextRound();
testGame.playTurn(9);
testGame.playTurn(9);
testGame.playTurn(9);
testGame.playTurn(9);
testGame.playTurn(1);
console.table(testGame.players);
console.log(testGame.round);

testDisplay = new Display(['You0', 'Alice0', 'Bob0', 'Carol0'], 0);
testDisplay = new Display(['You', 'Alice', 'Bob', 'Carol'], 9);
testDisplay.setBet(1, 500);
testDisplay.setCards(1, 4);
testDisplay.setTotal(4);
console.log(testDisplay.players)
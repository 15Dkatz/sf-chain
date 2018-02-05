const DIFFICULTY = 4;
const MINE_RATE = 3000; //milliseconds
// in this implementation, give each wallet 500 coins to start with.
// Because it gets the economy going
// Use this implementation unless research discloses a more traditional starting mechanism
const INITIAL_BALANCE = 500;
const MINING_REWARD = 50;

module.exports = { DIFFICULTY, MINE_RATE, INITIAL_BALANCE, MINING_REWARD };
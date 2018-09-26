# Dapp from zero to Programmer

- Players choose a number from 1-10
- Bet value is **1 ETH**
- If total slots exceed, prize will be distributed
- Won players will receive *totalbet/(number of player who bet winner number)*

## Init project
```
npm install -g truffle
mkdir betting-app
cd betting-app
truffle init
```

## Write contract & test & deploy on Remix IDE
deployed contract address: 0x10760d4227c8c87161a3ef93e2c4c3b6b04b95e1

### Install metamask
[https://metamask.io/](https://metamask.io/)

### Create contract file
create `Betting.sol` inside *contracts* folder and open it.

### Constructor & Destructor
```js
pragma solidity ^0.4.23

contract Betting {
  address owner;

  constructor () public {
    owner = msg.sender;
  }

  function kill() public {
    require(msg.sender == owner);
    selfdestruct(owner);
  }
}
```

### Declare variables

```js
uint public lastWinnerNumber;
uint public betValue = 1 ether;
uint public totalBet;
uint public numberOfBets;
uint public totalPlayers = 3;
address[] players;

mapping(uint => address[]) public numberToPlayers;
mapping(address => uint) public playerToNumber;
```

### Check a bet is valid or not
```js
modifier validBet(uint betNumber) {
    require(playerToNumber[msg.sender] == 0);
    require(msg.value >= betValue);
    require(numberOfBets < 10);
    require(betNumber >= 1 && betNumber <= 10);
    _;
}
```

### bet function
```js
function bet(uint betNumber) public payable validBet(betNumber) {
    if (msg.value > betValue) {
        msg.sender.transfer(msg.value - betValue);
    }
    playerToNumber[msg.sender] = betNumber;
    players.push(msg.sender);
    numberToPlayers[betNumber].push(msg.sender);
    numberOfBets += 1;
    totalBet += msg.value;
    if(numberOfBets >= totalPlayers) {
        distributePrizes();
    }
}
```

### Right after total players exceeds, we will find a winnerNumber and distribute prizes to the lucky one
```js
function distributePrizes() internal {
    uint winnerNumber = generateRandomNumber();
    address[] memory winners = numberToPlayers[winnerNumber];
    if (winners.length > 0) {
        uint winnerEtherAmount = totalBet / winners.length;
        for (uint i = 0; i < numberToPlayers[winnerNumber].length; i++) {
            numberToPlayers[winnerNumber][i].transfer(winnerEtherAmount);
        }
    }
    lastWinnerNumber = winnerNumber;
    reset();
}
```

### At the end of a game, we reset all data
```js
function reset() internal {
    for (uint i = 1; i <= 10; i++) {
        numberToPlayers[i].length = 0;
    }

    for (uint j = 0; j < players.length; j++) {
        playerToNumber[players[j]] = 0;
    }

    players.length = 0;
    totalBet = 0;
    numberOfBets = 0;
}
```

### Test it on Remix IDE

## Write front-ent
```
src/
  css/
    boostrap.min.css
    index.css
  images/
    logo.png
  js/
    app.js
    boostrap.min.js
    web3.min.js
  index.html
```

## Run front-end

install lite-server
```
npm init -y
npm install lite-server
```

config `bs-config.json`
```
{
    "server": {
      "baseDir": ["./src"]
    }
}
```
config `package.json`
```
"scripts": {
    "dev": "lite-server",
```

run app
```
npm run dev
```

## Deploy to IPFS (optional)
1. run ipfs daemon
```
ipfs daemon
```
2. get peers
```
ipfs swarm peers
```
3. share your content
```
ipfs add -r src/
```
your can see some thing like bellow
```
added QmYUaCPwvJWiueRXFSTTv8vdedWWzRhRdn8RMw35e7k67u src/css/bootstrap.min.css
added QmdeMuRDxvEcva1wUW6yQzqS3JDJqnXtSNpB48rPuCEp4J src/css/index.css
added QmWYhkEbjC1ZsxeEUNQ5bfLYyNJuuc1SDZJ1MfSvfV1Dzx src/index.html
added QmTcHzbH9poCjJPrkoC1MQx4M444Uu47Yk2awsbiR3znpD src/js/app.js
added QmNXRFREw7waGtKW9uBUze3PkR9E12HeeAQSkZQSiFUJqo src/js/bootstrap.min.js
added QmdTtsVM7KtvycQ68f9M43N4EQKvbd58q8aeAhP2fMz4Di src/js/web3.min.js
added Qmah2JkYdcqytu794cY8NxVhtUXckYgiDJJPWKct6ywVJN src/cssadded QmUtKod7sQRbZYr2kKBnT4egn1xT6C6KxHTCue7zYx1zJX src/js
added QmXGoRSnAqs155hNHXNdD2q7UTBZm3UoSH9jUKTDKf6oxy src
```
4. publish your site
```
ipfs name publish QmXGoRSnAqs155hNHXNdD2q7UTBZm3UoSH9jUKTDKf6oxy
```
wait for a minutes, your site will be ready:
```
Published to Qmaig4moutzi6ZUTrVUTDUDi6rMYX7tKSHuFjaDCEiZ34M: /ipfs/QmXGoRSnAqs155hNHXNdD2q7UTBZm3UoSH9jUKTDKf6oxy
```
go to http://gateway.ipfs.io/ipns/QmXGoRSnAqs155hNHXNdD2q7UTBZm3UoSH9jUKTDKf6oxy and check your site

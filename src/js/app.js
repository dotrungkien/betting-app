App = {
  web3Provider: null,
  contract: null,

  init: function() {
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
    } else {
      // If no injected web3 instance is detected, fall back to Ganache
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
    web3 = new Web3(App.web3Provider);

    App.initContract();
  },

  initContract: function() {
    var bettingContract = web3.eth.contract([{"constant":true,"inputs":[{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"name":"numberToPlayers","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"numberOfBets","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSlots","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"kill","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"betNumber","type":"uint256"}],"name":"bet","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"playerToNumber","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"betValue","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"lastWinnerNumber","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"players","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalBet","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_betValue","type":"uint256"},{"name":"_totalSlots","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"}]);
    App.contract = bettingContract.at("0xdcd9bf7da671017150d75c1ac47b316def610776")
    $(document).on('click', '.bet-number', App.handleBet);
    setInterval(App.updateState, 1000);
  },

  updateState: function() {
    let contract = App.contract;
    let coinbase = web3.eth.coinbase;
    web3.eth.getBalance(coinbase, function (err, result) {
      if (!err) {
        $("#coinbase").text(coinbase + " (" + web3.fromWei(result.toNumber()) + " ETH)");
      }
      else console.error(err);
    });
    contract.numberOfBets(function (err, result) {
      if (!err) {
        $("#number-of-bets").text(result.toNumber());
      }
      else console.error(err);
    });
    contract.lastWinnerNumber(function (err, result) {
      if (!err) {
        result = result.toNumber()
        $("#last-winner-number").text(result);
      }
      else console.error(err);
    });

    contract.totalBet(function (err, result) {
      if (!err) {
        result = web3.fromWei(result)
        $("#total-bet").text(result.toNumber() + " ETH");
      }
      else console.error(err);
    });

    contract.totalSlots(function (err, result) {
      if (!err) {
        let totalSlots = result.toNumber()
        $("#total-slots").text(totalSlots);
        for (var i = 0; i < totalSlots; i++) {
          let player = "#player" + (i+1);
          contract.players(i, function (err, result) {
            if (!err) {
              if (result !== "0x") {
                $(player).text(result)
              } else {
                $(player).text("N/A");
              }
            }
            else console.error(err);
          });
        }
      }
      else console.error(err);
    });
  },

  handleBet: function(event) {
    event.preventDefault();

    var betNumber = parseInt($(event.target).text());
    let contract = App.contract;
    contract.bet(betNumber, { value: web3.toWei(1, 'ether') }, function (err, result) {
      if (!err) console.log(result);
      else console.error(err);
    })
    console.log("bet Number = " + betNumber);
  }
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});

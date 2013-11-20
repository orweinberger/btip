var config = require('./config');
var logger = require('./lib/logger');
var Netmask = require('netmask').Netmask
var bitaddress = require('bitcoin-address');
var express = require('express');
var bitcoin = require('bitcoin');

var app = express();
var block = new Netmask(config.netmask);

var client = new bitcoin.Client({
  host: config.host,
  port: config.port,
  user: config.username,
  pass: config.password
});

app.use(express.bodyParser());
client.getBalance('*', 6, function (err, balance) {
  if (err) return console.log(err);
  app.post('/api', function (req, res) {
    if (block.contains(req.connection.remoteAddress)) {
      if (balance > 0) {
        var gitjson = JSON.parse(req.body.payload);
        if (gitjson.ref == 'refs/heads/' + config.branch) {
          logger.log('detected push to master');
          var regExp = /\(btip:([^)]+)\)/;
          var tipaddr = regExp.exec(gitjson.head_commit.message);
          if (bitaddress.validate(tipaddr[1]).trim()) {
            var validAddr = tipaddr[1].trim();
            if (balance >= config.tip) {
              logger.log('Sending ' + config.tip + 'BTC to ' + validAddr);
              client.walletPassphrase(config.walletPassphrase, '1');
              client.sendToAddress(validAddr, config.tip);
            }
            else
              logger.log('error', 'Failed send to: ' + validAddr + ' - Insufficient balance');
          }
          else
            logger.log('error', 'Failed send to: ' + tipaddr[1] + ' - Invalid address');
        }
      }
      else
        logger.log('error', 'No balance available');
    }
    else {
      logger.log('warn', 'Logged unauthorized request from IP: ' + req.connection.remoteAddress);
      res.send('IP Not authorized');
    }
    res.end('done');
  });

});

app.listen(3090);
logger.log('info', 'btip Listening on port 3090');

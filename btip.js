var config = require('./config');
var logger = require('./lib/logger');
var Netmask = require('netmask').Netmask
var bitaddress = require('bitcoin-address');
var express = require('express');
var bitcoin = require('bitcoin');
var git = require('./lib/github');

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
          var tipTo = tipaddr[1].trim();
          if (bitaddress.validate(tipTo)) {
            if (balance >= config.tip) {
              logger.log('Sending ' + config.tip + 'BTC to ' + tipTo);
              client.walletPassphrase(config.walletPassphrase, '1');
              client.sendToAddress(tipTo, config.tip);
              var pullnumber = git.getPullNumber(gitjson.head_commit.message)
              git.addComment('Sent ' + config.tip + 'BTC to ' + tipTo + '. Thanks for committing!')
            }
            else {
              logger.log('error', 'Failed send to: ' + tipTo + ' - Insufficient balance');
              git.addComment('Failed send to: ' + tipTo + ' due to insufficient balance. Repo admin has been notified')
            }
          }
          else {
            logger.log('error', 'Failed send to: ' + tipTo + ' - Invalid address');
            git.addComment('Failed send to: ' + tipTo + ' Address is invalid. Repo admin has been notified')
          }
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

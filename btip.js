var config = require('./config');
var Netmask = require('netmask').Netmask
var block = new Netmask(config.netmask);
var bitaddress = require('bitcoin-address');

var express = require('express');
var app = express();
var bitcoin = require('bitcoin');

var client = new bitcoin.Client({
  host: config.host,
  port: config.port,
  user: config.username,
  pass: config.password
});

app.use(express.bodyParser());

app.post('/api', function (req, res) {
  client.getBalance('*', 6, function (err, balance) {
    if (err) return console.log(err);
    if (balance > 0) {
      if (block.contains(req.connection.remoteAddress)) {
        var gitjson = JSON.parse(req.body.payload);

        if (gitjson.ref == 'refs/heads/master') {
          console.log('detected push to master');
          var regExp = /\(btip:([^)]+)\)/;
          var tipaddr = regExp.exec(gitjson.head_commit.message);
          if (bitaddress.validate(tipaddr[1])) {

            if (balance >= config.tip) {
              console.log('Sending ' + config.tip + 'BTC to ' + tipaddr[1]);
              client.sendToAddress(tipaddr[1]);
            }
            else {
              console.log('Failed send to: ' + tipaddr[1] + ' - Insufficient balance');
            }

          }
          else
            console.log('Failed send to: ' + tipaddr[1] + ' - Invalid address');
        }
        res.end('done');
      }
      else {
        console.log('Logged unauthorized request from IP: ' + req.connection.remoteAddress);
        res.send('IP Not authorized');
      }
    }
    else {
      console.log('No balance available');
    }
  });

});

app.listen(80);
console.log('btip Listening on port 80');

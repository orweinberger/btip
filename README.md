#btip _(beta)_
btip is a bitcoin tipping service that allows repository owners to tip contributors automatically.

It integrates to the natural github flow where contributors use forks and pull requests to contribute to other repositories.

Once a pull request is merged and has the correct btip syntax at the end of the commit message, a tip will be sent from the repo admin wallet to the contributor

**USE WITH CAUTION**

**btip is still under development, please run this service on machines with low amounts of BTC**

##Requirements

btip runs on nodejs >=0.10.x and also requires the bitcoin-qt daemon running.

More dependencies/packages listed in the package.json file

##Quick start
These commands needs to be executed on the server that will be hosting the btip service.

###Run bitcoind in daemon mode
1. Define the rpcusername and rpcpassword in your `bitcoin.conf` file (usually located at ~/.bitcoin/bitcoin.conf) and run the bitcoin daemon.
2. Run the bitcoind in daemon mode `./bitcoind -daemon`
3. Encrypt your bitcoin wallet `./bitcoind encryptwallet '<your-passphrase>'` You will be required to restart the bitcoind daemon
4. Create a new address `./bitcoind getnewaddress <account>`
5. Send some coins to the new address so you could tip contributors (Please note the warning at the top of this readme)

###Set a webhook URL for the desired github repository
1. Enable a URL webhook on the github repository by going to your repo page -> Settings -> Service hooks -> WebHook URLs -> Set the URL of the server you are about to run btip on. Default path is http://<your-server-address:3090/api

###Run btip
1. Clone the btip repository to your server `git clone https://github.com/orweinberger/btip.git`
2. Edit the configuration file with the relevant details `nano btip/config.js`
3. Run btip `node btip.js` or, if you would like to run btip as a daemon, you could install `npm install -g forever` and then `forever start btip.js`
4. Make sure that your contributors are including the following string in their commit message `(btip:<BTCAddress>)`, You will also need to make sure that the merge to the `config.branch` has that message.


**Notes:**

* Running the bitcoin daemon takes about 30seconds - 1 minute so please have some patience between step step 2 and 3
* Currently btip's default port is 3090. Don't forget to define that in your github webhook configuration.

##Configuration

```
var config = {
  "host": "127.0.0.1", //bitcoind hostname
  "port": 8332, // bitcoind port
  "username": "<rpc-username>", //bitcoind username
  "password": "<rpc-password>", //bitcoind password
  "branch": "master", //branch to monitor and tip for contributions
  "netmask": "192.30.252.0/22", //allowed netmask, you can get this info from the URL hooks section of you repo settings
  "walletPassphrase": "1234", //Your encrypted wallet passphrase
  "tip": 0.001 //tip amount
  "githubuser": "git-username", // Your github username
  "githubpass": "git-password", // Your github password
  "gitrepo": "repo-name" // Your github repository name
}
```

If you found this useful and feel like donating, please send some coins to:
**13K9DtTXf5kANesDdK3VSrGPdF4FaYk8nX**

[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/orweinberger/btip/trend.png)](https://bitdeli.com/free "Bitdeli Badge")


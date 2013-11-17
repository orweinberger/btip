#BTip _(alpha)_
BTip is a bitcoin tipping service that allows repository owners to tip contributors automatically.
**BTip is still under development, please run this service on machines with low amounts of BTC**

##Requirements

BTip runs on nodejs >=0.10.x and also requires the bitcoin-qt daemon running.
More dependencies/packages listed in the package.json file

##Quick start
First, define the rpcusername and rpcpassword in your `bitcoin.conf` file (usually located at ~/.bitcoin/bitcoin.conf) and run the bitcoin daemon
Then, enable URL webhooks on the desired repository. Go to your repo page -> Settings -> Service hooks -> WebHook URLs -> Set the URL of the server you are about to run btip on. Default path is http://<your-server-address/api

```
./bitcoind -daemon
git clone https://github.com/orweinberger/btip.git
cd btip
#Edit the config.js file to suit your needs, see config section below for more info
node btip.js
```

##Configuration

```
var config = {
  "host": "127.0.0.1", //bitcoind hostname
  "port": 8332, // bitcoind port
  "username": "<rpc-username>", //bitcoind username
  "password": "<rpc-password>", //bitcoind password
  "branch": "master", //branch to monitor and tip for contributions
  "netmask": "192.30.252.0/22", //allowed netmask, you can get this info from the URL hooks section of you repo settings
  "tip": 0.001 //tip amount
}
```

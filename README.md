#btip _(alpha)_
btip is a bitcoin tipping service that allows repository owners to tip contributors automatically.

**btip is still under development, please run this service on machines with low amounts of BTC**

##Requirements

btip runs on nodejs >=0.10.x and also requires the bitcoin-qt daemon running.

More dependencies/packages listed in the package.json file

##Quick start
1. Define the rpcusername and rpcpassword in your `bitcoin.conf` file (usually located at ~/.bitcoin/bitcoin.conf) and run the bitcoin daemon.
2. Run the bitcoind in daemon mode `./bitcoind -daemon`
3. Create a new address `./bitcoind getnewaddress <account>`
4. Enable a URL webhook on the github repository by going to your repo page -> Settings -> Service hooks -> WebHook URLs -> Set the URL of the server you are about to run btip on. Default path is http://<your-server-address:3090/api
5. Clone the btip repository to your server `git clone https://github.com/orweinberger/btip.git`
6. Edit the configuration file with the relevant details `nano btip/config.js`
7. Run btip `node btip.js`

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
  "tip": 0.001 //tip amount
}
```

# DHotel

`npm install`

## Blockchain

```
cd blockchain
make init
```

Note the contract's address for later use.

* Every time a new version of the contract is deployed:
	* Update the `config.json` files
	* Update the environment variables of the NodeJS server / Heroku

## Server

Run `npm start` on the root of the project

## Client

The mobile client and the door simulator

Check [https://dhotel-server.herokuapp.com/](https://dhotel-server.herokuapp.com/)

## Disclaimers
* Not taking into account timezones
* Unable to simulate different timestamps on the test cases
* Obviously, the door server private key would never be on a repo
* Single person team

## TO DO
* Allow to replay without needing to sign again
* Check that the timestamps are +/- 10 seconds
* Check that signatures are always incremental
* Design, look and feel
* Nicely arrange and reorder the code
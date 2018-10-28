# DHotel

This is a work of Jordi Moraleda. 

`npm install`

## Blockchain

```
cd blockchain
make init
make test
make build
make deploy
```

* Every time a new version of the contract is deployed:
	* Update the `config.json` files with the booking contract's address
	* Update the environment variables of the NodeJS server / Heroku

## Server

Run `npm start` on the root of the project or `make run` on the own folder.
At the time, it is deployed on Heroku.

## Client

The mobile client and the door simulator

* Mobile client: [https://dhotel-server.herokuapp.com/](https://dhotel-server.herokuapp.com/)
* Door simulator: run `cd door-simulator ; make www`

## Disclaimers

* Not taking into account the timezones
* Unable to simulate timestamps on the test cases
* Obviously, the door server private key would never be on a repo
* Single person team, everything is a best effort

## TO DO

* Limit the interval during which a user can replay
* Check that the timestamps are +/- 10 seconds
* Check that signatures are always incremental
* Design, look and feel
* Nicely arrange and reorder the code
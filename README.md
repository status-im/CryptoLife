# DHotel

## Blockchain

```
cd blockchain
make init
```

```
WEB3_PROVIDER_URI=https://ropsten.infura.io/---YOUR-API-KEY-HERE--- node scripts/deploy
```

Note the contract's address for later use.

## Client
Copy the contract address you got before and paste it into `client/contracts/bookings.js`

## Disclaimers
* Not taking into account timezones
* Unable to simulate different timestamps on the test cases
* Obviously, the door server private key would never be on a repo
* Single person team

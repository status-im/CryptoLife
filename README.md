# Onbotting.eth

This hack extends "invite link" functionality to "Universal Login" [EIP1077](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1077.md).


## Contribution


**From a user experience**

- New users can receive crypto assets and get an identity contract and ENS name, without needing or understanding any thing about crypto
- Easier possibility for sending social key recovery links


**From a technical perspective**

 - Invite link functionality added to [identity smart-contract deployed on ropsten](https://ropsten.etherscan.io/tx/0x7e50b62248473cf3976829f1d404d6cad911b3c8a3799a31f375403facd9243a)
 - Updated relay server endpoints, Universal Login SDK & UI to demo "invite links" via the robotwars app




## Assumptions

- Bob is a new user without ETH, wallet or any prior crypto knowledge

- Alice has an EIP 1077 identity contract and a spare ERC721 Robot

- Alice share the invite link with Bob over a secure channel e.g Whatsapp

- There is an incentive in place (on a user, dapp or relay level) to pay gas


## Steps of the scheme

![alt text](https://github.com/Dobrokhvalov/CryptoLife/blob/master/onbotting.eth%20(1).svg)

1) Alice shares an  invite link to Bob
2) Link includes a transit private key and a signature
3) Bob is directed to a webpage
4) Bob generates his own private key stored in the browser
5) Bob uses transit private key to sign Bob’s private key
6) Bob’s browser sends his two signatures to the relayer 
7) Relayer calls Alice’s identity contract
8) Alice’s identity contract creates an identity contract for Bob and sends a Robot
9) Bob is now onboarded to Ethereum and owns a robot that he can play with!

## Install steps to follow


### App

- In order to build the front-end, clone and run the robowars-app with yarn/build in parent folder & yarn/start in the sub folder client

### Relayer 

- In order to build smart-contracts and relayer you need to follow the instructions in relayer/readme.md





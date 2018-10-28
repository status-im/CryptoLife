# Submission for CryptoLife: xDai Chain Oracle

I build an easy to use oracle system for the xDai Chain.
It's based only on smart contract event.
Developers can simply copy/paste the desired event to their smart contract and use it.
The application I created listens for events that match and execute the desired function.

The oracle have for now 2 functions:
- Send an email
- Post a Whisper message

## Send an email

To send an email from a smart contract, add the following event to it:

```solidity
event SendEmail(string to, string from, string subject, string body);
```

Then, from any function, emit the event:
```solidity
emit SendEmail("to_email", "from_email", "subject", "body");
```

## Post a Whisper message

To post a whisper message from a smart contract, add the following event to it:

```solidity
event PostWhisper(string topic, string payload);```

Then, from any function, emit the event:
```solidity
emit PostWhisper("0xffaadd11", "0x00000001");
```

## Limitation

I didn't deployed the app on a server yet, so if you try without running the app yourself it will not work.

The function `PostWhisper` works but I couldn't find a way to post a message to the Status application. I need more knowledge about Whisper and how Status is using it.

## Technology used

The application is developed in TypeScript using the framework [MESG](https://github.com/mesg-foundation/core) to connect to Ethereum, Whisper and SendGrid.
The framework MESG is based on an event and task broker called MESG Core, and multiple services that emit event to Core and execute tasks on the behave of Core.
Applications are only connecting to Core.

I used 3 services:
- [Service Ethereum](https://github.com/mesg-foundation/service-ethereum)
This service listens in real time for block event, transaction event and log event. Every tine an event occurs, the service send it to MESG Core.
It also can decode logs.

- [Service Ethereum Whisper](https://github.com/mesg-foundation/service-ethereum-whisper)
This service listens and post Whisper messages.

- [Service Email SendGrid](https://github.com/mesg-foundation/service-email-sendgrid)
This service connect to SendGrid to send email.

## Installation

### Install MESG Core

```
bash <(curl -fsSL https://mesg.com/install)
```

### Start the Ethereum Service

```
mesg-core service deploy https://github.com/mesg-foundation/service-ethereum
```

Copy the returned id.

```
mesg-core service start __PASTE_ID_HERE__
```

### Start the Ethereum Whisper Service

```
mesg-core service deploy https://github.com/mesg-foundation/service-ethereum-whisper
```

Copy the returned id.

```
mesg-core service start __PASTE_ID_HERE__
```

### Start the SendGrid Service

```
mesg-core service deploy https://github.com/mesg-foundation/service-email-sendgrid
```

Copy the returned id.

```
mesg-core service start __PASTE_ID_HERE__
```

### Start the application

The application is in the `app` folder.

Copy `src/config.model.json` to `src/config.json`.
Populate the empty value with the id from the services and also the API Key for SendGrid.

Install dependencies:
```
npm i
```

Start the `sendEmail` app:
```
npm run sendEmail
```

Start the `postWhisper` app:
```
npm run postWhisper
```

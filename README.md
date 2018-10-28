Detsy
============

## Info

Detsy is a decentralized e-commerce website focused on handmade or vintage items. 
The main purpose of the platform is to enable individuals to be able to sell their handmade items, while being paid in DAI tokens. 

The platform connects the producers with large amount of buyers due to the fact that the buyers can be non-tech savvy and pay with their credit cards, while still using the properties of the blockchain to record the authenticity of the transactions.

The producer receives their money instantly in the form of DAI. The shopper has the option to pay with DAI (if is crypto-savy) or with credit card (if non-cypto-savy or does not want to go through the hassle)

The platform uses the Bloom protocol to authenticate the shoppers, making the experience smooth and seamless. Once the shopper is authenticated he can choose whether to buy the goods with DAI or with credit card. If he chooses to buy with credit card, 3rd party service named LimePay is used to provide the solution.

The things that happend behind the scenes when paying with Credit Card:
1. Detsy generates new wallet for the shopper (if he is first time user)
2. The shopper signs the required blockchain transactions that he would otherwise do if he is buying with DAI
3. The transactions and additional information is sent to LimePay.
4. LimePay emulates automicity of the transactions between Detsy, the shopper and the producer

Once the whole payment is processed:
- The producer gets DAI tokens for his item
- The Shopper pays in fiat, while in the background executes transactions as if he has DAI tokens and ether 
- Detsy charges small comissions in DAI from the producer

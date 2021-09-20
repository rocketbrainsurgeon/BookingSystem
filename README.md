# BookingSystem
Demo project using Typescript, Node, React, and Solidity. It's a CRUD (Create, Read, Update, Delete) application with a twist: the data layer uses the Ethereum blockchain instead of a database or document store.

[Live demo](https://idktechnology.com/bookingsystem/) on Rinkeby

How to try the demo:

1. You must have a web3 wallet installed, preferably MetaMask.
2. Click 'Connect' on the site. This'll prompt you to unlock your wallet and connect. Select the Rinkeby network.
3. Click 'Sign Up' and send the transaction to be added to the list of approved users.
4. Start reserving! Select a room from the drop down and a date from the date picker, then click 'Reserve' to send a transaction making your reservations.
5. Cancel any unwanted reservations.

Test Wallets on Rinkeby with ETH if you want to use them:

Wallet #1:
* Address: 0x3d8AD929FD359cD44a8f95Da7A3cc6baF092ee3a
* Key: 882fd4716b637db987da4fe25418f5fc9110848448be7f7a5d1f1133b88cb71a

Wallet #2:
* Address: 0x7fbe7B4853CaFF9C76fA346aBDbEbB37c8463187
* Key: 914c4a4033508efa9751313b4851009a4a6126166aa0565854248c253b464256

Features:
* The date picker will grey out any confirmed reservations for that room and time.
* Each users has a maximum of 10 open reservations possible.
* Fully responsive, tested to work on MetaMask app.

As this is a demo, some edge cases are unsolved.

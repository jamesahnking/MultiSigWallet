# Multisig Wallet Quorum & Transfer (contracts and tests)

## What type of dapp is this?
A multi-signature wallet crypto wallet that runs on an Ethereum based blockchain.

![SMMultiSig](https://user-images.githubusercontent.com/4562552/159700355-910f7c93-69d6-4071-a4fd-2a20a705d799.png)

## What technolgies were used to build and test this dapp ? 

- React
- Node
- JavaScript 
- Solidity
- CSS 
- Material UI 
- Truffle 

## How does the wallet work? 
- The MultiSig Quorum & Transfer MVP is a 2-of-3 signature address application. 
- Each address that is apart of the quorum can create a transfer by specifying an amount and a recipient.
- Each approved address can also authorize a transfer. 
- Each transfer needs two approvals to release and send a payment.
- Any unauthorized address that attempts to perform the actions of a member will be denied

## Why are Multi-Sig wallets important? 
- Funds stored in a multi-sig wallet can be moved only if the multiple signatures are provided at the same time. 
- Each signature is generated through the use of a different private keys and designated the right to approve or propose and approve transactions and transfers of funds.
- The most common signature combination is 2-of-3. It means only two signatures are enough to access or perform an operation on the funds of a 3-signature address. 


## What is a Quorum? 
The minimum number of designated addresses that must approve a transfer before it can be sent to a recipient.



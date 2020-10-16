[![#ubuntu 18.04](https://img.shields.io/badge/ubuntu-v18.04-orange?style=plastic)](https://ubuntu.com/download/desktop)
[![#npm 12.18.2](https://img.shields.io/badge/npm-v12.18.2-blue?style=plastic)](https://github.com/nvm-sh/nvm#installation-and-update)
[![#built_with_Truffle](https://img.shields.io/badge/built%20with-Truffle-blueviolet?style=plastic)](https://www.trufflesuite.com/)
[![#solc 0.7.3](https://img.shields.io/badge/solc-v0.7.3-brown?style=plastic)](https://github.com/ethereum/solidity/releases/tag/v0.7.3)
[![#testnet rinkeby](https://img.shields.io/badge/testnet-Rinkeby-yellow?style=plastic&logo=Ethereum)](https://rinkeby.etherscan.io/address/0x75f7ac694E50A527E4f25BD6C86d4f4Fa1026706)

<img src="wfil.svg" width="20%">

# WFIL

> Wrapped Filecoin, ERC20 Wrapper over Filecoin

`WFIL` is the first ERC20 wrapper over Filecoin, representing a stablecoin on deposits on a custodial Filecoin wallet (1:1 ratio).  

The current iteration implements a custodial pattern where users need to send filecoins to a custodial wallet and they'll get automatically the correspondent amount in `WFIL` to their ethereum addresses.  

Future Developments & Features:

We'd like to migrate to a non-custodial pattern where by leveraging on Filecoin smart contracts we'd be able to implement a fully decentralized application.

Extend the Filecoin Wallet into a MetaMask for Filecoin.  

One of the features we're considering is to add the permit() function to WFIL to allow meta transactions by leveraging on OpenZeppelin ERC20Permit module (currently in progress) and incentivise adoption in the space.

Applications:

- Uniswap
- WFIL as Collater on MakerDAO
- De-Fi
- ...

## Mentors

- Andrew W. Hill (Textile), [@andrewxhill](https://github.com/andrewxhill)  
- Aaron Sutula (Textile), [@asutula](https://github.com/asutula)
- Ignacio Hagopian (Textile) [@jsign](https://github.com/jsign)

[Demo (HackFS)](https://www.youtube.com/watch?v=EmdEGsnYjgs&feature=youtu.be)  
[HackFS](http://hack.ethglobal.co/showcase/wfil-recCwbCnY2rnipjcR)  
[Demo (APOLLO)](https://youtu.be/UbB5F03OTo0)  
[Pitch Deck](https://www.beautiful.ai/player/-MIKcB-BSZr83qSqvhHI)

## Sections
* [Building Blocks](#building-blocks)
* [Setup](#setup)
* [Deploy](#deploy)
* [Using the DApp](#using-the-dapp)
* [About](#about)

## Building Blocks

![Smart Contracts Flow-Chart](WFIL.png)

### [WFIL](./contracts/WFIL.sol)

Implements an ERC20 token by leveraging on OpenZeppelin Library.  

It allows the owner of the contract, set as Default Admin to add/remove a Minter via **addMinter()**, **removeMinter()** functions.  

The contract implements the **wrap()** function to mint WFIL by passing the recepient address and the amount of Filecoin to wrap as parameters and emitting an event, *Wrapped*.  

The contract also implements the **unwrap()** function to burn the WFIL by passing the filecoin address and the amount of WFIL to unwrap as parameters and emitting an event, *Unwrapped*.  

The contract inherits OpenZeppelin *AccessControl* module to set the Pauser role to the owner of the contract that can call the **pause()**, **unpause()** functions in case of emergency (Circuit Breaker Design Pattern).

Once the owner call the **pause()** function, thanks to the **_beforeTokenTransfer()** hook, *_mint()*, *_burn()* and *_transfer()* internal functions, will revert.

To manage the wrapping - unwrapping fee, the contract set the Fee Setter role to the owner of the contract that can set the fee via **setFee()** and the recipient via **setFeeTo()**. The fee is public and can be queried via the getter function **fee()**. 

A **Gnosis Safe Multisig** is used to receive and store the wrapping fees.

### [Backend](https://github.com/cristiam86/wfil-backend)

Implements a custodial wallet by leveraging on Texitle Powergate APIs.  

Via AWS Lambda Function, allows to automatically wrap Filecoin, by minting WFIL from an account set as Minter.  

It's also connected via Filscan APIs to Filecoin to check for transactions that are tracked via Textile ThreadDB.

### [Frontend](./app)

The Frontend has been implemented via Rimble UI & Rimble Web3 Components and deployed on IPFS via [Fleek](https://fleek.co/): [wfil.on.fleek.co](https://wfil.on.fleek.co)

### [Filecoin Wallet](https://wfil.on.fleek.co/#/wallet)

Implements a Filecoin client by leveraging on Textile Powergate APIs.  

Further developments of the project include building a MetaMask for Filecoin, creating an extension for Chrome.  


Setup
============

Clone this GitHub repository.

## Steps to compile and test

  - Local dependencies:
    - Truffle
    - Ganache CLI
    - OpenZeppelin Contracts v3.1.0
    - Truffle HD Wallet Provider
    - Truffle-Flattener
    ```sh
    $ npm i
    ```
  - Global dependencies:
    - Truffle (recommended):
    ```sh
    $ npm install -g truffle
    ```
    - Ganache CLI (recommended):
    ```sh
    $ npm install -g ganache-cli
    ```
    - Slither (optional):
    ```sh
    $ git clone https://github.com/crytic/slither.git && cd slither
    $ sudo python3 setup.py install
    ```
    - MythX CLI (optional):
    ```sh
    $ git clone git://github.com/dmuhs/mythx-cli && cd mythx-cli
    $ sudo python setup.py install
    ```
## Running the project with local test network (ganache-cli)

   - Start ganache-cli with the following command (global dependency):
     ```sh
     $ ganache-cli
     ```
   - Compile the smart contract using Truffle with the following command (global dependency):
     ```sh
     $ truffle compile
     ```
   - Deploy the smart contracts using Truffle & Ganache with the following command (global dependency):
     ```sh
     $ truffle migrate
     ```
   - Test the smart contracts using Mocha & OpenZeppelin Test Environment with the following command:
     ```sh
     $ npm test
     ```
   - Analyze the smart contracts using Slither with the following command (optional):
      ```sh
      $ slither .
      ```
   - Analyze the smart contracts using MythX CLI with the following command (optional):
     ```sh
     $ mythx analyze
     ```

Deploy
============
## Deploy on Rinkeby Testnet
 - Get an Ethereum Account on Metamask.
 - On the landing page, click “Get Chrome Extension.”
 - Create a .secret file cointaining the menomic.
 - Get some test ether from a [Rinkeby's faucet](https://faucet.rinkeby.io/).
 - Signup [Infura](https://infura.io/).
 - Create new project.
 - Copy the rinkeby URL into truffle-config.js.
 - Uncomment the following lines in truffle-config.js:
   ```
   // const HDWalletProvider = require("@truffle/hdwallet-provider");
   // const infuraKey = '...';
   // const infuraURL = 'https://rinkeby.infura.io/...';

   // const fs = require('fs');
   // const mnemonic = fs.readFileSync(".secret").toString().trim();
   ```
 - Install Truffle HD Wallet Provider:
   ```sh
   $ npm install @truffle/hdwallet-provider
   ```
 - Deploy the smart contract using Truffle & Infura with the following command:
   ```sh
   $ truffle migrate --network rinkeby
   ```

## Project deployed on Rinkeby
[WFIL.sol](https://rinkeby.etherscan.io/address/0x75f7ac694E50A527E4f25BD6C86d4f4Fa1026706)

Using the DApp
==============
  - Install [Ganache GUI](https://www.trufflesuite.com/ganache).
  - Change Ganache GUI port to 8545.
  - Import Ganache GUI mnemonic into MetaMask.
  - Connect MetaMask to Ganache GUI, adding a custom RPC specifing the Ganache GUI's RPC server URL.
  - Deploy the smart contracts to Ganache GUI:
    ```
    $ truffle migrate
    ```
  - Move to client directory on the project:
    ```sh
    $ cd app
    ```
  - Install dependencies:
    ```sh
    $ yarn install
    ```
  - Start the Local Web Server:
    ```sh
    $ npm run start
    ```

About
============
## Inspiration & References

- [WBTC](https://etherscan.io/address/0x2260fac5e5542a773aa44fbcfedf7c193bc2c599#code)
- [WETH](https://etherscan.io/address/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2#code)
- [Chai](https://github.com/dapphub/chai)
- [EIP 2612](https://github.com/ethereum/EIPs/blob/8a34d644aacf0f9f8f00815307fd7dd5da07655f/EIPS/eip-2612.md)
- [EIP 712](https://eips.ethereum.org/EIPS/eip-712)
- [ERC-2612](https://github.com/ethereum/EIPs/issues/2613)
- [How to use permit function and relayers to pay gas for Dai transactions in Dai](https://github.com/makerdao/developerguides/blob/master/dai/dai-permit-function/how-to-use-permit-function.md)
- [Add ERC20 permit() function (OpenZeppelin)](https://github.com/OpenZeppelin/openzeppelin-contracts/issues/2206)
- [Understanding Wrapped Bitcoin and the Wrapped Tokens Framework](https://medium.com/@mutheevincent/understanding-wrapped-bitcoin-and-the-wrapped-tokens-framework-6ed45e52acdb)

## Authors

Project created by [Nazzareno Massari](https://nazzarenomassari.com) and [Cristiam Da Silva](https://cristiamdasilva.com/).  
Team WrapFS for HackFS ETHGlobal Virtual Hackathon.  
Logo by Cristiam Da Silva.

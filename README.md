[![#ubuntu 18.04](https://img.shields.io/badge/ubuntu-v18.04-orange?style=plastic)](https://ubuntu.com/download/desktop)
[![#npm 12.18.2](https://img.shields.io/badge/npm-v12.18.2-blue?style=plastic)](https://github.com/nvm-sh/nvm#installation-and-update)
[![#built_with_Truffle](https://img.shields.io/badge/built%20with-Truffle-blueviolet?style=plastic)](https://www.trufflesuite.com/)
[![#solc 0.6.10](https://img.shields.io/badge/solc-v0.6.10-brown?style=plastic)](https://github.com/ethereum/solidity/releases/tag/v0.6.10)
[![#testnet kovan](https://img.shields.io/badge/testnet-Kovan-purple?style=plastic&logo=Ethereum)]()

# WFIL

> Wrapped Filecoin   

## Mentors

[Demo]()  
[HackFS]()  

## Sections
* [Building Blocks](#building-blocks)
* [Setup](#setup)
* [Deploy](#deploy)
* [About](#about)

## Building Blocks

![Smart Contracts Flow-Chart]()

### [WFIL](./contracts/WFIL.sol)

Setup
============

Clone this GitHub repository.

# Steps to compile and test

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
    - Slither (optional): 
    ```
    pip3 install slither-analyzer
    ```
    - MythX CLI (optional):
    ```sh
    $ git clone git://github.com/dmuhs/mythx-cli
    $ sudo python setup.py install
    ```
## Running the project with local test network (ganache-cli)

   - Start ganache-cli with the following command:
     ```sh
     $ ganache-cli
     ```
   - Compile the smart contract using Truffle with the following command:
     ```sh
     $ truffle compile
     ```
   - Deploy the smart contracts using Truffle & Ganache with the following command:
     ```sh
     $ truffle migrate
     ```
   - Test the smart contracts using Truffle & Ganache with the following command:
     ```sh
     $ truffle test
     ```
   - Analyze the smart contracts using Slither with the following command (optional):
      ```
      $ slither .
      ```
   - Analyze the smart contracts using MythX CLI with the following command (optional):
     ```sh
     $ mythx analyze
     ```
     
Deploy
============
## Deploy on Kovan Testnet
 - Get an Ethereum Account on Metamask.
 - On the landing page, click “Get Chrome Extension.”
 - Create a .secret file cointaining the menomic.
 - Get some test ether from a [Kovan's faucet](https://faucet.kovan.network/).
 - Signup [Infura](https://infura.io/).
 - Create new project.
 - Copy the kovan URL into truffle-config.js.
 - Uncomment the following lines in truffle-config.js:
   ```
   // const HDWalletProvider = require("@truffle/hdwallet-provider");
   // const infuraKey = '...';
   // const infuraURL = 'https://kovan.infura.io/...';

   // const fs = require('fs');
   // const mnemonic = fs.readFileSync(".secret").toString().trim();
   ```
 - Install Truffle HD Wallet Provider:
   ```sh
   $ npm install @truffle/hdwallet-provider
   ```
 - Deploy the smart contract using Truffle & Infura with the following command:
   ```sh
   $ truffle migrate --network kovan
   ```

## Project deployed on Kovan
[WFIL.sol](https://kovan.etherscan.io/address/)

About
============
## Inspiration & References

- [WBTC](https://etherscan.io/address/0x2260fac5e5542a773aa44fbcfedf7c193bc2c599#code)
- [WETH](https://etherscan.io/address/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2#code)
- [Chai](https://github.com/dapphub/chai)
- [EIP 712](https://eips.ethereum.org/EIPS/eip-712)
- [Add ERC20 permit() function to OpenZeppelin](https://github.com/OpenZeppelin/openzeppelin-contracts/issues/2206)

## Authors

Project created by [Nazzareno Massari](https://nazzarenomassari.com) and Cristiam Da Silva.  
Team WrappedFS for HackFS ETHGlobal Virtual Hackathon.

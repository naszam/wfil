import Web3 from "web3";

import contract from '../contracts/WFIL.json';

const { abi } = contract;
const CONTRACT_ADDRESS = process.env.REACT_APP_WFIL_CONTRACT_ADDRESS;
const REQUIRED_NETWORK = process.env.REACT_APP_WFIL_REQUIRED_NETWORK;

const NETWORKS = {
  1: "Main",
  3: "Ropsten",
  4: "Rinkeby",
  42: "Kovan",
};

function getNetworkById(id) {
  return NETWORKS[id] ? { id, name: NETWORKS[id] } : { id, name: 'unknow' };
}

function getContract() {
  const web3 = getWeb3();
  return new web3.eth.Contract(abi, CONTRACT_ADDRESS);
}

function getWeb3() {
  if (window.ethereum) {
    console.log("Using modern web3 provider.");
    return new Web3(window.ethereum);
  }
  if (window.web3) { // Legacy dapp browsers, public wallet address always exposed
    console.log("Legacy web3 provider. Try updating.");
    return new Web3(window.web3.currentProvider);
  }
  // Non-dapp browsers...
  console.log("Non-Ethereum browser detected. Using Infura fallback.");
  const web3Provider = new Web3.providers.HttpProvider("https://rinkeby.infura.io/v3/c43d74f41ea4482d8eecfa96d47a8151");
  return new Web3(web3Provider);
}

export async function getTokenSupply() {
  const web3 = getWeb3();
  const contract = getContract();
  try {
    const result = await contract.methods.totalSupply().call();
    return web3.utils.fromWei(result);

  } catch (e) {
    console.log("getTokenSupply -> e", e)
  }
  return 0;
}

export async function getUserTokenBalance(account) {
  try {
    const web3 = getWeb3();
    const contract = await getContract();
    const result = await contract.methods.balanceOf(account).call();
    return web3.utils.fromWei(result);
  } catch (error) {
    console.log("getTokenUserbalance -> error", error)
    return 0;
  }
}

export const requiredNetwork = getNetworkById(REQUIRED_NETWORK);

export const getNetwork = async () => {
  try {
    const web3 = getWeb3();
    const networkId = await web3.eth.net.getId();
    if (!networkId) return null;
    const isCorrectNetwork = Number(networkId) === Number(REQUIRED_NETWORK);
    const network = getNetworkById(networkId);
    return { ...network, isCorrectNetwork };

  } catch (error) {
    console.log("Could not get network ID: ", error);
  }
};

export const setupEventHandlers = ({ onNetworkChanged, onAccountsChanged }) => {
  try {
    window.ethereum.on('chainChanged', onNetworkChanged);
    window.ethereum.on('accountsChanged', onAccountsChanged);

  } catch (error) {
    console.log("setupEventHandlers -> error", error)    
  }
}

export const isConnected = () => {
  return Boolean(window.ethereum.selectedAddress);
}

export const getUserAccount = () => {
  return window.ethereum.selectedAddress;
}

export const userConnect = async () => {
  try {
    const address = await window.ethereum.request({ method: 'eth_requestAccounts' });
    return address;
  } catch (error) {
    console.log("getWalletAccount -> error", error);
  }
}

export const sendUnwrapTransaction = async ({ destination, amount, account, callback }) => {
  try {
    const contract = await getContract();
    contract.methods.unwrap(destination, amount)
      .send({ from: account })
      .on('transactionHash', (hash) => {
        callback({ status: 'pending', transactionHash: hash });
      })
      .on('confirmation', (confirmationNumber, receipt) => {
        if (receipt.status) {
          callback({
            status: 'success',
            transactionHash: receipt.transactionHash,
          });
        } else {
          callback({ status: 'error' });
        }
      })
  } catch (error) {
    console.log("sendUnwrapTransaction -> error", error)
  }
}

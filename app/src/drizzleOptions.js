import Web3 from "web3";
import WFIL from "./contracts/WFIL.json";

const options = {
  web3: {
    block: false,
    customProvider: new Web3("ws://localhost:8545"),
  },
  contracts: [WFIL],
  events: {
    WFIL: [],
  },
};

export default options;

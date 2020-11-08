import { SET_NETWORK, SET_TOTAL_SUPPLY, SET_ACCOUNT, SET_USER_TOKEN_BALANCE } from '../actions/web3';

const DEFAULT_STATE = {
  network: null,
  totalSupply: '0',
  account: '',
  userBalance: '0'
}

const web3Reducer = (state = DEFAULT_STATE, { type, payload }) => {
  switch(type) {
    case SET_NETWORK: {
      return { ...state, network: payload };
    }
    case SET_TOTAL_SUPPLY: {
      return { ...state, totalSupply: payload };
    }
    case SET_ACCOUNT: {
      return { ...state, account: payload };
    }
    case SET_USER_TOKEN_BALANCE: {
      return { ...state, userBalance: payload };
    }
    default: {
      return state;
    }
  }
}

export default web3Reducer;
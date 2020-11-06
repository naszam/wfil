import { SET_NETWORK, SET_TOTAL_SUPPLY } from '../actions/web3';

const DEFAULT_STATE = {
  network: null,
  totalSupply: 0
}

const web3Reducer = (state = DEFAULT_STATE, { type, payload }) => {
  switch(type) {
    case SET_NETWORK: {
      return { ...state, network: payload };
    }
    case SET_TOTAL_SUPPLY: {
      return { ...state, totalSupply: payload };
    }
    default: {
      return state;
    }
  }
}

export default web3Reducer;
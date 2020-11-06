export const SET_NETWORK = 'SET_NETWORK';
export const SET_TOTAL_SUPPLY = 'SET_TOTAL_SUPPLY';

export const setNetwork = (network) => {
  return { type: SET_NETWORK, payload: network };
}

export const setTotalSupply = (totalSupply) => {
  return { type: SET_TOTAL_SUPPLY, payload: totalSupply };
}

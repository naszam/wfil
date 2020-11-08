export const SET_NETWORK = 'SET_NETWORK';
export const SET_TOTAL_SUPPLY = 'SET_TOTAL_SUPPLY';
export const SET_ACCOUNT = 'SET_ACCOUNT';
export const SET_USER_TOKEN_BALANCE = 'SET_USER_TOKEN_BALANCE';

export const setNetwork = (network) => {
  return { type: SET_NETWORK, payload: network };
}

export const setTotalSupply = (totalSupply) => {
  return { type: SET_TOTAL_SUPPLY, payload: totalSupply };
}

export const setAccount = (account) => {
  return { type: SET_ACCOUNT, payload: account };
}

export const setUserTokenBalance = (balance) => {
  return { type: SET_USER_TOKEN_BALANCE, payload: balance };
}
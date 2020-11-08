import React, { useEffect } from "react";
import { useDispatch } from 'react-redux';
import {ThemeProvider} from 'styled-components'
import {theme} from 'rimble-ui'

import { Reset } from './components/ResetStyles';
import Wallet from './components/Wallet';
import Routes from './Routes';
import customTheme from './theme';
import {
  setNetwork,
  setTotalSupply,
  setAccount,
  setUserTokenBalance
} from './redux/actions/web3';
import {
  getTokenSupply,
  getNetwork,
  setupEventHandlers,
  isConnected,
  getUserAccount,
  getUserTokenBalance
} from './services/web3';

const appTheme = { ...theme, ...customTheme };

const App = () => {
  const dispatch = useDispatch();

  const initWeb3 = async () => {
    const [totalSupply, network] = await Promise.all([
      getTokenSupply(),
      getNetwork()
    ])
    dispatch(setTotalSupply(totalSupply));
    dispatch(setNetwork(network));
    if (isConnected()) {
      const account = getUserAccount();
      dispatch(setAccount(account));
      registerUserTokenBalance(account);
    }
  };
  
  const registerUserTokenBalance = async (account) => {
    const balance = await getUserTokenBalance(account);
    dispatch(setUserTokenBalance(balance));
  }

  const registerAccount = (accounts) => {
    const userAccount = accounts[0];
    dispatch(setAccount(userAccount));
    registerUserTokenBalance(userAccount);
  }

  useEffect(() => {
    initWeb3();
    setupEventHandlers({
      onNetworkChanged: initWeb3,
      onAccountsChanged: registerAccount
    });
  }, []);

  return (
    <ThemeProvider theme={appTheme}>
      <Reset />
      <Routes /> 
      <Wallet />
    </ThemeProvider>
  );
}

export default App;

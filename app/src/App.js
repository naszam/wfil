import React, { useEffect } from "react";
import { useDispatch } from 'react-redux';
import {ThemeProvider} from 'styled-components'
import {theme} from 'rimble-ui'

import RimbleWeb3 from "./utilities/RimbleWeb3";
import { Reset } from './components/ResetStyles';
import Wallet from './components/Wallet';
import Loading from './components/Loading';
import Routes from './Routes';
import customTheme from './theme';
import { setNetwork, setTotalSupply } from './redux/actions/web3';
import { getTokenBalance, getNetwork, setupEventHandlers } from './services/web3';

const appTheme = { ...theme, ...customTheme };

const config = {
  accountBalanceMinimum: 0.001,
  requiredNetwork: 4
};

const App = () => {
  const dispatch = useDispatch();

  const initWeb3 = async () => {
    const [totalSupply, network] = await Promise.all([
      getTokenBalance(),
      getNetwork()
    ])
    dispatch(setTotalSupply(totalSupply));
    dispatch(setNetwork(network));
  };

  useEffect(() => {
    initWeb3();
    setupEventHandlers({ onNetworkChanged: initWeb3 });
  }, []);

  return (
    <ThemeProvider theme={appTheme}>
      <Reset />
      <RimbleWeb3 config={config}>
        <Routes /> 
        <Wallet />
      </RimbleWeb3>
    </ThemeProvider>
  );
}

export default App;

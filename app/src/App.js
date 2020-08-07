import React from "react";
import {ThemeProvider} from 'styled-components'
import {theme} from 'rimble-ui'

import RimbleWeb3 from "./utilities/RimbleWeb3";
import { Reset } from './components/ResetStyles';
import Loading from './components/Loading';
import Routes from './Routes';
import customTheme from './theme';

const appTheme = { ...theme, ...customTheme };

const config = {
  accountBalanceMinimum: 0.001,
  requiredNetwork: 42
};

const App = () => {
  return (
    <ThemeProvider theme={appTheme}>
      <Reset />
      <RimbleWeb3 config={config}>
        <Routes /> 
      </RimbleWeb3>
    </ThemeProvider>
  );
}

export default App;

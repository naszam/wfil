import React from "react";
import { DrizzleContext } from "@drizzle/react-plugin";
import { Drizzle } from "@drizzle/store";
import {ThemeProvider} from 'styled-components'
import {theme} from 'rimble-ui'

import Loading from './components/Loading';
import drizzleOptions from "./drizzleOptions";
import Routes from './Routes';
import customTheme from './theme';

const drizzle = new Drizzle(drizzleOptions);
const appTheme = { ...theme, ...customTheme };

const App = () => {
  return (
    <ThemeProvider theme={appTheme}>
      <DrizzleContext.Provider drizzle={drizzle}>
        <DrizzleContext.Consumer>
          {drizzleContext => {
            const { initialized } = drizzleContext;

            return initialized ? <Routes /> : <Loading />;
          }}
        </DrizzleContext.Consumer>
      </DrizzleContext.Provider>
    </ThemeProvider>
  );
}

export default App;

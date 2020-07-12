import React from "react";
import { DrizzleContext } from "@drizzle/react-plugin";
import { Drizzle } from "@drizzle/store";
import {ThemeProvider} from 'styled-components'
import {theme} from 'rimble-ui'

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

            if (!initialized) return "Loading..."
            return <Routes />
          }}
        </DrizzleContext.Consumer>
      </DrizzleContext.Provider>
    </ThemeProvider>
  );
}

export default App;

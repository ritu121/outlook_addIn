import App from "./App";
import { AppContainer } from "react-hot-loader";
import * as React from "react";
import * as ReactDOM from "react-dom";
/* global document, Office, module, require */

let isOfficeInitialized = false;

const title = "Selltis Add-in";

const render = (Component) => {
  ReactDOM.render(<AppContainer><Component title={title} isOfficeInitialized={isOfficeInitialized} /></AppContainer>,
    document.getElementById("container")
  );
};

/* Render application after Office initializes */
Office.onReady(() => {
  isOfficeInitialized = true;
  render(App);
});

/* Initial render showing a progress bar */
render(App);

if (module.hot) {
  module.hot.accept("./App", () => {
    const NextApp = require("./App").default;
    render(NextApp);
  });
}

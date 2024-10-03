import React from "react";
import ReactDOM from "react-dom/client";
import { Amplify } from "aws-amplify";

import App from "./App";
import awsExports from "./aws-exports";
import "@aws-amplify/ui-react/styles.css";

import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-typeahead/css/Typeahead.css";
import { Provider } from "react-redux";
import store from "./redux/store";
import { withAuthenticator } from "@aws-amplify/ui-react";

Amplify.configure(awsExports);

const AuthenticatorWrappedApp = withAuthenticator(App);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <AuthenticatorWrappedApp />
    </Provider>
  </React.StrictMode>
);

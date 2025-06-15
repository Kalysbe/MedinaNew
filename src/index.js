/*!

=========================================================
* Material Dashboard PRO React - v1.8.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-pro-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Provider } from 'react-redux'
import { Router, Route, Switch, Redirect } from "react-router-dom";
import  PrivateRoute from "./PrivateRoute";

import AuthLayout from "layouts/Auth.js";
import AdminLayout from "layouts/Admin.js";

import store from "../src/redux/store";

import "assets/scss/material-dashboard-pro-react.scss?v=1.8.0";
import "./global.css";
import './utils'; 
const hist = createBrowserHistory();

ReactDOM.render(
<Provider store={store}>
  <Router history={hist}>
    <Switch>
  
      <Route path="/auth" component={AuthLayout} />
      <PrivateRoute  path="/admin" component={AdminLayout} />
      <Redirect from="/" to="/admin/dashboard" />
    </Switch>
  </Router>
</Provider>
,
  document.getElementById("root")
);

import React from "react";
import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom";

import Header from "./components/Header";
import Index from "./components/Index";
import Account from "./components/Account";
import Token from "./components/Token";
import Test from "./components/Test";

const AppRouter = () => (
  <Router>
    <div>
      <Header />
      <Route path="/" exact render={() => <Redirect to="/account" />} />
      <Route path="/account/:account?" component={Account} />
      <Route path="/token/:tokenId" component={Token} />
      <Route path="/test" component={Test} />
    </div>
  </Router>
);

export default AppRouter;


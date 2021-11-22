import React from "react";
import Toolbar from "./components/toolbar";
import "./styles.less";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import Navbar from "./components/navbar/navbar";
import ContactPage from "./components/contact-page";
import DocumentPage from "./components/documents-page";
import AboutPage from "./components/about-page";
import HomePage from "./components/home-page";
import CommitteePage from "./components/committee-page";

const App = () => {
  return (
    <div>
      <Toolbar />
      <Router>
        <Navbar />
        <div>
          <Switch>
            <Route exact path="/">
              <HomePage />
            </Route>
            <Route exact path="/about">
              <AboutPage />
            </Route>
            <Route exact path="/committees">
              <CommitteePage />
            </Route>
            <Route exact path="/documents">
              <DocumentPage />
            </Route>
            <Route exact path="/contact">
              <ContactPage />
            </Route>
          </Switch>
        </div>
      </Router>
    </div>
  );
};

export default App;

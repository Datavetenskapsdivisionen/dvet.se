import React from "react";
import Toolbar from "./components/toolbar";
import "./styles.less";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
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
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/committees" element={<CommitteePage />} />
            <Route path="/documents" element={<DocumentPage />} />
            <Route exact path="/contact" element={<ContactPage />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
};

export default App;

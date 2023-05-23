import React from "react";
import Toolbar from "./components/toolbar";
import "./styles.less";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Navbar from "./components/navbar/navbar";
import Footer from "./components/navbar/footer";
import ContactPage from "./components/contact-page";
import DocumentPage from "./components/documents-page";
import AboutPage from "./components/about-page";
import HomePage from "./components/home-page";
import CommitteePage from "./components/committee-page";
import WIP from "./components/widgets/wip";

const App = () => {
  return (
    <div>
      <Toolbar />
      <Router>
        <Navbar />
        <main>
          <Routes>
            <Route exact path="/" element={<HomePage />} />
            <Route exact path="/about" element={<AboutPage />} />
            <Route exact path="/committees" element={<CommitteePage />} />
            <Route exact path="/documents" element={<DocumentPage />} />
            <Route exact path="/contact" element={<ContactPage />} />
          </Routes>
        </main>
      </Router>
      <Footer />
      <WIP />
    </div>
  );
};

export default App;

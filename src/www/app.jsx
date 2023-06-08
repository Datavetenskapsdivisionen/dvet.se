import React from "react";
import Toolbar from "./components/toolbar";
import "./styles.less";
import { BrowserRouter as Router, Route, Routes, Outlet } from "react-router-dom";
import Navbar from "./components/navbar/navbar";
import Footer from "./components/navbar/footer";
import ContactPage from "./components/contact-page";
import DVRKRoute from "./components/dvrk-page";
import DocumentPage from "./components/documents-page";
import AboutPage from "./components/about-page";
import HomePage from "./components/home-page";
import CommitteePage from "./components/committee-page";
import ToolsPage from "./components/tools-page";
import PhotosPage from "./components/photos-page";
// import WIP from "./components/widgets/wip";
import IndividualCommitteePage from "./components/individual-committee-page";

const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          {DVRKRoute()}
          <Route element={
            <>
              <Toolbar />
              <Navbar />
              <main>
                <Outlet />
              </main>
            </>
          }>
            <Route exact path="/" element={<HomePage />} />
            <Route exact path="/about" element={<AboutPage />} />
            <Route exact path="/committees" element={<CommitteePage />} />
            <Route exact path="/tools" element={<ToolsPage />} />
            <Route exact path="/documents" element={<DocumentPage />} />
            <Route exact path="/contact" element={<ContactPage />} />
            <Route exact path="/photos" element={<PhotosPage />} />

            <Route exact path="/committees/the-board" element={
              <IndividualCommitteePage text={require("../../content/committees/the-board.md")["default"]} />
            } />
            <Route exact path="/committees/board-of-studies" element={
              <IndividualCommitteePage text={require("../../content/committees/board-of-studies.md")["default"]} />
            } />
            <Route exact path="/committees/mega6" element={
              <IndividualCommitteePage text={require("../../content/committees/mega6.md")["default"]} />
            } />
            <Route exact path="/committees/concats" element={
              <IndividualCommitteePage text={require("../../content/committees/concats.md")["default"]} />
            } />
            <Route exact path="/committees/femmepp" element={
              <IndividualCommitteePage text={require("../../content/committees/femmepp.md")["default"]} />
            } />
            <Route exact path="/committees/dv_ops" element={
              <IndividualCommitteePage text={require("../../content/committees/dv_ops.md")["default"]} />
            } />
            <Route exact path="/committees/dvarm" element={
              <IndividualCommitteePage text={require("../../content/committees/dvarm.md")["default"]} />
            } />
            <Route exact path="/committees/mega7" element={
              <IndividualCommitteePage text={require("../../content/committees/mega7.md")["default"]} />
            } />
          </Route>
        </Routes>
      </Router>
      <Footer />
      {/* <WIP /> */}
    </div>
  );
};

export default App;

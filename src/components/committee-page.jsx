import React from "react";
import ReactMarkdown from "react-markdown";
import text from "../../Content/committee-page.md";
import CommitteeBadge from "./widgets/committee-badge";

import DVRKLogo from "../../assets/committee-logos/dvrk-logo.png";
import ConCatsLogo from "../../assets/committee-logos/concats-logo.png";
import Mega6Logo from "../../assets/committee-logos/mega6-logo.png";

const me = () => (
  <div className="page">
    <h1>Kommitteer</h1>
    <ReactMarkdown children={text}></ReactMarkdown>
    <div className="committee-holder">
      <CommitteeBadge name="DVRK" logo={DVRKLogo} />
      <CommitteeBadge name="Studienämnd" />
      <CommitteeBadge name="Mega6" logo={Mega6Logo} />
      <CommitteeBadge name="ConCats" logo={ConCatsLogo} />
      <CommitteeBadge name="DIT1337" />
      <CommitteeBadge name="DVArm" />
    </div>
  </div>
);

export default me;

import React from "react";
import ReactMarkdown from "react-markdown";
import text from "../../Content/committee-page.md";
import CommitteeBadge from "./widgets/committee-badge";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

import DVRKLogo from "../../assets/committee-logos/dvrk-logo.png";
import ConCatsLogo from "../../assets/committee-logos/concats-logo.png";
import ConCatsText from "../../assets/committee-logos/concats-text-alt.png";
import Mega6Logo from "../../assets/committee-logos/mega6-logo.png";
import Mega7Logo from "../../assets/committee-logos/mega7-logo.png";
import TheBoardLogo from "../../assets/externallogohemlet.svg";

const me = () => (
  <div className="page">
    <ReactMarkdown children={text} rehypePlugins={[rehypeRaw]} remarkPlugins={[remarkGfm]}></ReactMarkdown>
    <div className="committee-holder">
      <CommitteeBadge uri="/committees/the-board" name="Styrelsen" logo={TheBoardLogo} />
      <CommitteeBadge uri="/committees/dvrk" name="DVRK" logo={DVRKLogo} color="#1e1e1e" />
      <CommitteeBadge uri="/committees/board-of-studies" name="Studienämnd" fontSize="1.8em" />
      <CommitteeBadge uri="/committees/mega6" name="Mega6" logo={Mega6Logo} color="#434AFA" />
      <CommitteeBadge uri="/committees/concats" imageText={ConCatsText} logo={ConCatsLogo} />
      <CommitteeBadge uri="/committees/femmepp" name="Femme++" />
      <CommitteeBadge uri="/committees/dv_ops" name="DV_Ops" />
      <CommitteeBadge uri="/committees/dvarm" name="DVArm" />
      <CommitteeBadge uri="/committees/mega7" name="Mega7" logo={Mega7Logo} />
    </div>
  </div>
);

export default me;

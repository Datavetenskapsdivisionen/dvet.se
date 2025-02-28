import React from "react";
import CommitteeBadge from "components/widgets/committee-badge";
import { isEnglish } from "util";

import DVRKLogo from "/frontend/assets/committee-logos/dvrk-logo.png";
import ConCatsLogo from "/frontend/assets/committee-logos/concats-logo.png";
import ConCatsText from "/frontend/assets/committee-logos/concats-text-alt.png";
import Mega6Logo from "/frontend/assets/committee-logos/mega6-logo.png";
import Mega7Logo from "/frontend/assets/committee-logos/mega7-logo.png";
import TheBoardLogo from "/frontend/assets/committee-logos/styrelsen.png";
import StudentEducationalCommittee from "/frontend/assets/committee-logos/student-educational-committee-logo.png";
import FemmePPLogo from "/frontend/assets/committee-logos/femmepp-logo.png";
import DV_OpsLogo from "/frontend/assets/committee-logos/dv_ops-logo.svg";
import DVArmLogo from "/frontend/assets/committee-logos/dvarm-logo.png";

const me = () => (
  <div className="page">
    <div className="committee-holder">
      <CommitteeBadge uri="/committees/the-board" name={isEnglish() ? "The Board" : "Styrelsen"} logo={TheBoardLogo} />
      <CommitteeBadge uri="/committees/dvrk" name="DVRK" logo={DVRKLogo} color="#1e1e1e" />
      <CommitteeBadge uri="/committees/student-educational-committee" name={isEnglish() ? "Student Educational Committee" : "Studienämnd"} fontSize={isEnglish() ? "1.1em" : "1.8em"} logo={StudentEducationalCommittee} />
      <CommitteeBadge uri="/committees/mega6" name="Mega6" logo={Mega6Logo} />
      <CommitteeBadge uri="/committees/concats" imageText={ConCatsText} logo={ConCatsLogo} Concats={true}/>
      <CommitteeBadge uri="/committees/femmepp" name="Femme++" logo={FemmePPLogo} />
      <CommitteeBadge uri="/committees/dv_ops" name="DV_Ops" logo={DV_OpsLogo} DVops={true} />  
      <CommitteeBadge uri="/committees/dvarm" name="DVArm" logo={DVArmLogo} />
      <CommitteeBadge uri="/committees/mega7" name="Mega7" logo={Mega7Logo} />
    </div>
  </div>
);

export default me;

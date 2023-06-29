import React from "react";
import { Link } from "react-router-dom";
import { isEnglish } from "../../util";

const navbar = () => {
  return (
    <nav>
      <div>
        <Link className="nav__link" to="/">
          Start
        </Link>
        <Link className="nav__link" to="/committees">
          {isEnglish() ? "Committees" : "Kommitteer"}
        </Link>
        <Link className="nav__link" to="/about">
          {isEnglish() ? "About us" : "Om Oss"}
        </Link>

        <Link className="nav__link" to="/photos">
          {isEnglish() ? "Photos" : "Bilder"}
        </Link>

        <Link className="nav__link" to="/documents">
          {isEnglish() ? "Documents" : "Dokument"}
        </Link>

        <Link className="nav__link" to="/contact">
          {isEnglish() ? "Contact" : "Kontakt"}
        </Link>
      </div>
    </nav>
  );
};

export default navbar;

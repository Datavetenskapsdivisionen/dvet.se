import React from "react";
import { NavLink } from "react-router-dom";
import { isEnglish } from "../../util";

const navbar = () => {
  return (
    <nav>
      <div>
        <NavLink className="nav__link" to="/">Start</NavLink>
        <NavLink className="nav__link" to="/committees">{isEnglish() ? "Committees" : "Kommitteer"}</NavLink >
        <NavLink className="nav__link" to="/about">{isEnglish() ? "About us" : "Om Oss"}</NavLink >
        <NavLink className="nav__link" to="/photos">{isEnglish() ? "Photos" : "Bilder"}</NavLink >
        <NavLink className="nav__link" to="/documents">{isEnglish() ? "Documents" : "Dokument"}</NavLink >
        <NavLink className="nav__link" to="/contact">{isEnglish() ? "Contact" : "Kontakt"}</NavLink >
        <NavLink className="nav__link" to="/dviki">{"Wiki"}</NavLink >
      </div>
    </nav>
  );
};

export default navbar;

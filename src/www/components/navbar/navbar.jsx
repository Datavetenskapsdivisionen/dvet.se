import React from "react";
import { Link } from "react-router-dom";

const navbar = () => {
  return (
    <nav>
      <div>
        <Link className="nav__link" to="/">
          Start
        </Link>
        <Link className="nav__link" to="/committees">
          Kommitteer
        </Link>
        <Link className="nav__link" to="/about">
          Om Oss
        </Link>

        <Link className="nav__link" to="/photos">
          Bilder
        </Link>

        <Link className="nav__link" to="/documents">
          Dokument
        </Link>

        <Link className="nav__link" to="/contact">
          Kontakt
        </Link>
      </div>
    </nav>
  );
};

export default navbar;

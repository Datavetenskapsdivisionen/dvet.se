import React from 'react';
import logo from "/frontend/assets/main.png";
import { isEnglish } from "util";
import { Link } from "react-router-dom";

const randomNumber = (limit) => Math.floor(Math.random() * limit) + 1;

const toolbar = () => {
  return (
    <header className="dv-header">
      <div className='header-bg-grid'>{
        [...Array(500)].map((_, i) => {
          return <div key={i} className={`v${randomNumber(4)} h${randomNumber(4)} c${randomNumber(7)}`}></div>;
        })
      }
      </div>
      <Link className="headwrapper" to="/">
        <img src={logo} alt="" id="logopic" />
        <div id="logo">
          <span id="header">{isEnglish() ? "Computer Science" : "Datavetenskap"}</span>
          <span id="subheader">{isEnglish() ? "AT The University of Gothenburg" : "VID Göteborgs Universitet"}</span>
        </div>
      </Link>
    </header>);
};

export default toolbar;

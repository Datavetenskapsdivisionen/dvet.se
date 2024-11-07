import React from 'react';
import logo from "/assets/main.png";
import { isEnglish } from "/src/www/util";
import { NavLink } from "react-router-dom";

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
      <div className="headwrapper">
        <img src={logo} alt="" id="logopic" />
        <div id="logo">
          <NavLink to="/">{isEnglish() ? "Computer Science" : "Datavetenskap"}</NavLink>
          <span id="subheader">{isEnglish() ? "AT The University of Gothenburg" : "VID Göteborgs Universitet"}</span>
        </div>
      </div>
    </header>);
};

export default toolbar;

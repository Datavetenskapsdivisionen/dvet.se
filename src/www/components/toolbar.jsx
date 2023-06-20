import React from 'react';
import logo from "../../../assets/main.png"
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
          <img src={logo} alt="" id="logopic"/>
        <div id="logo">
          <a href="/">Datavetenskap</a>
          <span id="subheader">vid Göteborgs Universitet</span>
        </div>
      </div>
    </header>);
};


const randomNumber = (limit) => Math.floor(Math.random() * limit) + 1;

export default toolbar


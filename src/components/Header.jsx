import React from "react";
import {
  BsFillBellFill,
  BsFillEnvelopeFill,
  BsPersonCircle,
  BsSearch,
  BsJustify,
  BsSun,
  BsMoon,
} from "react-icons/bs";

function Header({ OpenSidebar, toggleTheme, isDarkTheme }) {
  return (
    <header className="header">
      <div className="menu-icon">
        <BsJustify className="icon" onClick={OpenSidebar} />
      </div>
      <div className="header-left">
        <BsSearch className="icon" />
      </div>
      <div className="header-right">
        <BsFillBellFill className="icon" />
        {/* <BsFillEnvelopeFill className='icon'/> */}
        <BsPersonCircle className="icon" />
        <span className="icon theme-toggle-icon" onClick={toggleTheme}>
          {isDarkTheme ? <BsSun /> : <BsMoon />}
        </span>
      </div>
    </header>
  );
}

export default Header;

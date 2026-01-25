import { useState } from "react";

import { Link } from "react-router-dom";

import MainHeader from "./MainHeader";
import NavLinks from "./NavLinks";
import MobileNav from "./MobileNav";
import Backdrop from "../elements/Backdrop";
import "./MainNavigation.css";

const MainNavigation = () => {
  const [mobileIsOpen, setMobileIsOpen] = useState(false);

  const openMobile = () => {
    setMobileIsOpen(true);
  };

  const closeMobile = () => {
    setMobileIsOpen(false);
  };

  return (
    <>
      {mobileIsOpen && <Backdrop onClick={closeMobile} />}
      <MobileNav isOpen={mobileIsOpen} onClick={closeMobile}>
        <nav className="navigation__mobile-nav">
          <NavLinks onClick={closeMobile} />
        </nav>
      </MobileNav>

      <MainHeader>
        <button className="navigation__menu-btn" onClick={openMobile}>
          <span />
          <span />
          <span />
        </button>
        <h1 className="navigation__title glitch" data-text="MuscleApp">
          <Link to="/">MuscleApp</Link>
        </h1>
        <nav className="navigation__header-nav">
          <NavLinks />
        </nav>
      </MainHeader>
    </>
  );
};

export default MainNavigation;

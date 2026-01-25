import ReactDOM from "react-dom";
import "./MobileNav.css";

const MobileNav = ({ isOpen, onClick, children }) => {
  const mobilenav = (
    <aside
      className={`mobile-nav ${isOpen ? "mobile-nav--open" : ""}`}
      onClick={onClick}
    >
      {children}
    </aside>
  );

  return ReactDOM.createPortal(
    mobilenav,
    document.getElementById("mobile-nav")
  );
};

export default MobileNav;

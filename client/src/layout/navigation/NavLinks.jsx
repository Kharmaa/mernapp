import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../../context/auth";

import "./NavLinks.css";
import Button from "../formelements/Button";

// Haetaan kirjautumistila ja logout-funktio contextista
const NavLinks = () => {
  const { isLoggedIn, logout } = useContext(AuthContext);

  return (
    <ul className="nav-links">
      {/* Näytetään nämä linkit vain kirjautuneelle käyttäjälle */}
      {isLoggedIn && (
        <>
          <li>
            <NavLink to="/home">NÄKYMÄ</NavLink>
          </li>
          <li>
            <NavLink to="/workouts/new">LISÄÄ UUSI +</NavLink>
          </li>
          <li>
            <NavLink to="/profile">PROFIILI</NavLink>
          </li>
          <li>
            <Button
              type="button"
              variant="ghost"
              size="lg"
              className="nav-links__logout"
              onClick={logout}
            >
              ULOS
            </Button>
          </li>
        </>
      )}

      {/* Jos ei kirjautunut → näytetään vain kirjautumislinkki */}
      {!isLoggedIn && (
        <li>
          <NavLink to="/login">KIRJAUDU</NavLink>
        </li>
      )}
    </ul>
  );
};

export default NavLinks;

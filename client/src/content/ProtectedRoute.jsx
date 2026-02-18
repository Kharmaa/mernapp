import { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AuthContext } from "../context/auth";

//Tämä komponentti suojaa reittejä, jotka vaativat kirjautumisen.
export default function ProtectedRoute({ redirectTo = "/login" }) {
  const { isLoggedIn } = useContext(AuthContext);
  const location = useLocation();

  // Jos käyttäjä ei ole kirjautunut
  if (!isLoggedIn) {
    return <Navigate to={redirectTo} replace state={{ from: location }} />;
  }

  // Jos käyttäjä on kirjautunut, renderöidään suojatun reitin sisältö
  return <Outlet />;
}

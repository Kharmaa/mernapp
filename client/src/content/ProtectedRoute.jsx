import { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AuthContext } from "../context/auth";

/**
 * ProtectedRoute
 *
 * Tämä komponentti suojaa reittejä, jotka vaativat kirjautumisen.
 * Jos käyttäjä ei ole kirjautunut, hänet ohjataan kirjautumissivulle.
 * Jos käyttäjä on kirjautunut, näytetään suojatun reitin sisältö.
 */

export default function ProtectedRoute({ redirectTo = "/login" }) {
  // Haetaan kirjautumistieto AuthContextista
  const { isLoggedIn } = useContext(AuthContext);

  // Tallennetaan nykyinen sijainti, jotta käyttäjä voidaan ohjata
  // kirjautumisen jälkeen takaisin alkuperäiselle sivulle
  const location = useLocation();

  // Jos käyttäjä ei ole kirjautunut
  if (!isLoggedIn) {
    // Ohjataan käyttäjä kirjautumissivulle
    // "replace" estää palaamisen takaisin suojatulle sivulle selaimen takaisin-napilla
    // "state" välittää tiedon siitä, mistä sivulta käyttäjä yritti tulla
    return <Navigate to={redirectTo} replace state={{ from: location }} />;
  }

  // Jos käyttäjä on kirjautunut, renderöidään suojatun reitin sisältö
  return <Outlet />;
}

import { createContext } from "react";

/**
 * AuthContext
 *
 * AuthContextin avulla komponentit voivat tarkistaa, onko käyttäjä kirjautunut,
 * sekä käyttää käyttäjän tunnistetietoja ja kirjautumisfunktioita
 * ilman, että tietoja tarvitsee välittää propsien kautta.
 */
export const AuthContext = createContext({
  // Kertoo, onko käyttäjä kirjautunut sisään
  isLoggedIn: false,

  // Kirjautuneen käyttäjän yksilöivä tunniste
  userId: null,

  // JWT-token, jota käytetään suojattujen API-kutsujen yhteydessä
  token: null,

  // Funktio käyttäjän kirjautumista varten
  // Varsinainen toteutus määritellään Context Providerissa
  login: () => {},

  // Funktio käyttäjän uloskirjautumista varten
  logout: () => {},
});

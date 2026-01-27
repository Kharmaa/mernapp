import { useState, useCallback, useEffect } from "react";

// Ajastin automaattista uloskirjautumista varten
let logoutTimer;

/**
 * useAuth
 *
 * Custom hook, joka vastaa sovelluksen autentikointitilasta.
 * Hallitsee kirjautumisen, uloskirjautumisen, tokenin elinkaaren
 * sekä kirjautumistilan palauttamisen sivun päivityksen jälkeen.
 */
export const useAuth = () => {
  // JWT-token
  const [token, setToken] = useState(null);

  // Tokenin vanhenemisaika
  const [tokenExpDate, setTokenExpDate] = useState();

  // Kirjautuneen käyttäjän tunniste
  const [userId, setUserId] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  /**
   * login
   *
   * Tallentaa käyttäjän kirjautumistiedot sovelluksen tilaan
   * ja localStorageen. Tokenille asetetaan myös vanhenemisaika.
   */
  const login = useCallback((uid, token, expirationDate) => {
    setToken(token);
    setUserId(uid);

    // Käytetään backendiltä saatua vanhenemisaikaa,
    // tai oletuksena 1 tuntia nykyhetkestä
    const tokenExpDate =
      expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
    setTokenExpDate(tokenExpDate);

    // Tallennetaan tiedot localStorageen,
    // jotta kirjautumistila säilyy sivun päivityksen jälkeen
    localStorage.setItem(
      "userData",
      JSON.stringify({
        userId: uid,
        token,
        expiration: tokenExpDate.toISOString(),
      }),
    );
  }, []);

  /**
   * logout
   *
   * Tyhjentää autentikointitilan ja poistaa käyttäjätiedot
   * localStoragesta.
   */
  const logout = useCallback(() => {
    setToken(null);
    setTokenExpDate(null);
    setUserId(null);
    localStorage.removeItem("userData");
  }, []);

  /**
   * Automaattinen uloskirjautuminen
   *
   * Jos token on olemassa ja sillä on vanhenemisaika,
   * asetetaan ajastin, joka kirjaa käyttäjän ulos tokenin vanhentuessa.
   */
  useEffect(() => {
    if (token && tokenExpDate) {
      const remTime = tokenExpDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExpDate]);

  /**
   * Autentikointitilan palautus
   *
   * Tarkistetaan localStoragesta löytyykö voimassa oleva
   * kirjautumistieto, ja palautetaan se sovelluksen tilaan.
   */
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    if (
      storedData?.token &&
      storedData?.userId &&
      new Date(storedData.expiration) > new Date()
    ) {
      login(
        storedData.userId,
        storedData.token,
        new Date(storedData.expiration),
      );
    }
    setAuthReady(true);
  }, [login]);

  return { token, login, logout, userId, authReady };
};

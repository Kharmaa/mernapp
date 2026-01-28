import { createContext } from "react";

export const AuthContext = createContext({
  // Kertoo käyttäjän kirjautumistilan. Antaa yksilöivän tunnisteen
  isLoggedIn: false,
  userId: null,

  // JWT-token, jota käytetään suojattujen API-kutsujen Authorization-headerissa
  token: null,

  //funktiot kirjautumista ja uloskirjautumista varten
  login: () => {},
  logout: () => {},
});

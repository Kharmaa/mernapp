import { NavLink, Outlet } from "react-router-dom";

import MainNavigation from "./navigation/MainNavigation";
import Footer from "./footer/Footer";

// Layout-komponentti määrittää sovelluksen perusrakenteen (header, sisältö, footer)
export default function Layout() {
  return (
    <div className="app">
      {/* Yläpalkki / navigaatio */}
      <header>
        <MainNavigation />
      </header>

      {/* Sivun varsinainen sisältö */}
      <main>
        <div className="dashboard">
          <div className="background-box">
            {/* Outlet renderöi aktiivisen reitin sisällön */}
            <Outlet />
          </div>
        </div>
      </main>

      {/* Alapalkki */}
      <Footer />
    </div>
  );
}

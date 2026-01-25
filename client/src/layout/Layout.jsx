import { NavLink, Outlet } from "react-router-dom";

import MainNavigation from "./navigation/MainNavigation";
import Footer from "./footer/Footer";

export default function Layout() {
  return (
    <div className="app">
      <header>
        <MainNavigation />
      </header>

      <main>
        <div className="dashboard">
          <div className="background-box">
            <Outlet />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

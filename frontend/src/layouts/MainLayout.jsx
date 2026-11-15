
import { Outlet } from "react-router-dom";

import HeaderComponent from "../components/HeaderComponent";
import FooterComponent from "../components/FooterComponent";
import NavBarComponent from "../components/NavBarComponent";

export default function MainLayout() {
  return (
    <div>
      <NavBarComponent />

      <HeaderComponent />

      <main>
        <Outlet />
      </main>

      <FooterComponent />
    </div>
  );
}

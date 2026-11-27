import { Outlet } from "react-router-dom";

import HeaderComponent from "../components/HeaderComponent";
import FooterComponent from "../components/FooterComponent";
import NavBarComponent from "../components/NavBarComponent";

export default function MainLayout() {
  return (
    <div className="flex flex-col w-full min-h-screen bg-slate-950 m-0 p-0">
      <HeaderComponent />
      <NavBarComponent />

      <main className="flex-1 w-full bg-slate-950">
        <Outlet />
      </main>

      <FooterComponent />
    </div>
  );
}
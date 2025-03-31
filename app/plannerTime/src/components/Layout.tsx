import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header/Header";
import Sidebar from "./Sidebar";

export default function Layout() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";
  const isLP = location.pathname === "/lp";

  return (
    <div className=" flex min-h-screen flex-col bg-gray-50 w-full">
      <Header />
      <div className="flex flex-1 w-full h-full z-10 pt-0.5">
        <div hidden={isLP || isLoginPage}>
          <Sidebar />
        </div>
        <Outlet />
      </div>
    </div>
  );
}

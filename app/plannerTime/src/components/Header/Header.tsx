import { Calendar } from "lucide-react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

function Header() {
  const isLogged = localStorage.getItem("isLogged") === "true";
  const location = useLocation();
  const navigate = useNavigate();
  const isLoginPage = location.pathname === "/login";

  const HomeRedirect = () => {
    if (isLogged) {
        // change this to home page when build
        navigate('/lp')
    } else {
        navigate('/lp')
    }
  }  

  const HandleButtonClick = () => {
    if (isLogged) {
      localStorage.setItem("isLogged", "false");
      window.location.reload();
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white py-4 px-6 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div onClick={HomeRedirect} className="flex items-center gap-2">
            <Calendar className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold">Planner Time</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#" hidden={isLoginPage} className="text-purple-700 hover:text-purple-900">
              Home
            </a>
            <a href="#" hidden={isLoginPage} className="text-gray-700 hover:text-gray-900">
              Calendário
            </a>
            <a href="#" hidden={isLoginPage} className="text-gray-700 hover:text-gray-900">
              Atividades
            </a>
            <a href="#" hidden={isLoginPage} className="text-gray-700 hover:text-gray-900">
              Restrições
            </a>
            <button
              onClick={HandleButtonClick}
              type="button"
              className={`text-white ${
                isLogged
                  ? "bg-gray-400"
                  : "bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300"
              } font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800`}
              disabled={isLoginPage}
              hidden={isLoginPage}
            >
              {isLogged ? "Logout" : "Login"}
            </button>
          </nav>
        </div>
      </header>
      <Outlet />
    </div>
  );
}

export default Header;

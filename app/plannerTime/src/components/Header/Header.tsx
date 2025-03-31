import { Calendar } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

function Header() {
  const isLogged = localStorage.getItem("isLogged") === "true";
  const location = useLocation();
  const navigate = useNavigate();
  const isLoginPage = location.pathname === "/login";

  const HomeRedirect = () => {
    if (isLogged) {
      navigate("/home");
    } else {
      navigate("/lp");
    }
  };

  // const TasksRedirect = () => {
  //   navigate("/tasks");
  // };

  // const RestrictionsRedirect = () => {
  //   navigate("/restrictions");
  // };

  const HandleButtonClick = () => {
    if (isLogged) {
      localStorage.setItem("isLogged", "false");
      navigate("/lp");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="flex h-full w-full flex-col">
      <div className="bg-white py-4 px-6 shadow-sm z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div onClick={HomeRedirect} className="flex items-center gap-2">
            <Calendar className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold">Planner Time</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 cursor-pointer">
            {/* <a
              onClick={HomeRedirect}
              hidden={isLoginPage}
              className="text-purple-700 hover:text-purple-900"
            >
              Home
            </a>
            <a
              onClick={() => navigate("/calendar")}
              hidden={isLoginPage}
              className="text-gray-700 hover:text-gray-900 cursor-pointer"
            >
              Calendário
            </a>
            <a
              onClick={TasksRedirect}
              hidden={isLoginPage}
              className="text-gray-700 hover:text-gray-900 cursor-pointer"
            >
              Atividades
            </a>
            <a
              onClick={RestrictionsRedirect}
              hidden={isLoginPage}
              className="text-gray-700 hover:text-gray-900 cursor-pointer"
            >
              Restrições
            </a> */}
            <button
              onClick={HandleButtonClick}
              type="button"
              className={`text-white ${
                isLogged
                  ? "bg-gray-400"
                  : "bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300"
              } font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2`}
              disabled={isLoginPage}
              hidden={isLoginPage}
            >
              {isLogged ? "Logout" : "Login"}
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}

export default Header;

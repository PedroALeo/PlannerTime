import { CalendarIcon, ClipboardCheck, OctagonMinus, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();

  const TasksRedirect = () => {
    navigate("/tasks");
  };

  const RestrictionsRedirect = () => {
    navigate("/restrictions");
  };

  const CalendarRedirect = () => {
    navigate("/calendar");
  };

  return (
    <div className="min-h-screen w-64 shadow-2xl px-3 py-4 overflow-y-auto bg-white  dark:bg-gray-800">
      <ul className="space-y-2 font-medium">
        <li onClick={CalendarRedirect}>
          <a
            href="#"
            className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
          >
            <CalendarIcon />
            <span className="ms-3">Calendário</span>
          </a>
        </li>
        <li onClick={TasksRedirect}>
          <a
            href="#"
            className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
          >
            <ClipboardCheck />
            <span className="flex-1 ms-3 whitespace-nowrap">Atividades</span>
          </a>
        </li>
        <li onClick={RestrictionsRedirect}>
          <a
            href="#"
            className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
          >
            <OctagonMinus />
            <span className="flex-1 ms-3 whitespace-nowrap">Restições</span>
          </a>
        </li>
        <li >
          <a
            className="flex items-center p-2 text-gray-900 rounded-lg cursor-not-allowed hover:bg-gray-100"
          >
            <User className="opacity-20" />
            <span className="flex-1 ms-3 whitespace-nowrap opacity-20">Perfil</span>
            <span className="bg-yellow-200 font-bold">Em contrução</span>
          </a>
        </li>
      </ul>
    </div>
  );
}

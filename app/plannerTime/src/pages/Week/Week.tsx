// import { useState } from "react";
import { Calendar as CalendarIcon, Plus, Clock, Tag, ChevronLeft, ChevronRight } from "lucide-react";

function App() {
//   const [selectedDay, setSelectedDay] = useState<string | null>(null);
//   const [view, setView] = useState<'month' | 'week'>('week');

  // Mock data for weekly tasks
  const weeklyTasks = [
    {
      id: 1,
      title: "Reunião de Projeto",
      description: "Discussão sobre novos features",
      day: "Segunda",
      startTime: "09:00",
      endTime: "10:30",
      color: "bg-blue-100 border-blue-200",
      category: "Trabalho"
    },
    {
      id: 2,
      title: "Almoço com Cliente",
      description: "Apresentação da proposta",
      day: "Terça",
      startTime: "12:00",
      endTime: "13:30",
      color: "bg-green-100 border-green-200",
      category: "Reunião"
    },
    {
      id: 3,
      title: "Code Review",
      description: "Review do PR #123",
      day: "Quarta",
      startTime: "14:00",
      endTime: "15:00",
      color: "bg-purple-100 border-purple-200",
      category: "Desenvolvimento"
    },
    {
      id: 4,
      title: "Daily Standup",
      description: "Status update diário",
      day: "Quinta",
      startTime: "10:00",
      endTime: "10:30",
      color: "bg-yellow-100 border-yellow-200",
      category: "Reunião"
    },
    {
      id: 5,
      title: "Planning Semanal",
      description: "Planejamento da próxima sprint",
      day: "Sexta",
      startTime: "15:00",
      endTime: "16:30",
      color: "bg-pink-100 border-pink-200",
      category: "Planejamento"
    }
  ];

  const timeSlots = Array.from({ length: 9 }, (_, i) => {
    const hour = i + 9; // Starting from 9 AM
    return `${hour.toString().padStart(2, '0')}:00`;
  });

  const weekDays = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];

  const getTaskPosition = (startTime: string) => {
    const [hours] = startTime.split(':').map(Number);
    return `${(hours - 9) * 100}px`; // Each hour is 100px height
  };

  const getTaskHeight = (startTime: string, endTime: string) => {
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);
    const durationInMinutes = (endHours - startHours) * 60 + (endMinutes - startMinutes);
    return `${(durationInMinutes / 60) * 100}px`; // Each hour is 100px height
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="w-full max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Calendário</h1>
          <p className="text-gray-600 mt-1">Gerencie seus eventos e compromissos</p>
        </div>

        {/* Visualização Semanal */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-b px-6 py-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl text-gray-800 flex items-center">
                <CalendarIcon className="h-5 w-5 mr-2 text-blue-600" />
                Visualização Semanal
              </h2>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">15-21 Abril, 2024</span>
                <div className="flex gap-2">
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <ChevronLeft className="h-5 w-5 text-gray-600" />
                  </button>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <ChevronRight className="h-5 w-5 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-8 gap-[1px] bg-gray-200">
              {/* Time slots column */}
              <div className="bg-white pt-14"> {/* Extra padding to align with header */}
                {timeSlots.map((time) => (
                  <div key={time} className="h-[100px] border-b border-gray-100 text-sm text-gray-500 -mt-2">
                    {time}
                  </div>
                ))}
              </div>

              {/* Days columns */}
              {weekDays.map((day) => (
                <div key={day} className="bg-white relative">
                  <div className="h-14 border-b border-gray-200 flex items-center justify-center sticky top-0 bg-white z-10">
                    <span className="text-sm font-medium text-gray-700">{day}</span>
                  </div>
                  <div className="h-[900px] relative"> {/* 9 hours * 100px */}
                    {timeSlots.map((time) => (
                      <div key={time} className="h-[100px] border-b border-gray-100" />
                    ))}
                    {weeklyTasks
                      .filter(task => task.day === day)
                      .map(task => (
                        <div
                          key={task.id}
                          className={`absolute left-1 right-1 rounded-lg ${task.color} p-2 shadow-sm border transition-shadow hover:shadow-md overflow-hidden`}
                          style={{
                            top: getTaskPosition(task.startTime),
                            height: getTaskHeight(task.startTime, task.endTime),
                          }}
                        >
                          <h3 className="font-medium text-sm truncate">{task.title}</h3>
                          <p className="text-xs text-gray-600 truncate">{task.description}</p>
                          <div className="flex items-center mt-1 space-x-2">
                            <span className="flex items-center text-xs text-gray-500">
                              <Clock className="w-3 h-3 mr-1" />
                              {task.startTime}
                            </span>
                            <span className="flex items-center text-xs text-gray-500">
                              <Tag className="w-3 h-3 mr-1" />
                              {task.category}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <button className="w-full flex items-center justify-center py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Novo Evento
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
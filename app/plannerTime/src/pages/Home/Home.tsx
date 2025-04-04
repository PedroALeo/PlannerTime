import { useState, useEffect } from "react";
import { Clock, Calendar, AlertTriangle, Timer, CalendarClock, ArrowRight, Loader2 } from "lucide-react";

interface Task {
  id: number;
  name: string;
  estimatedTime: string;
  dueDate: string;
  priority: 1 | 2 | 3 | 4 | 5;
}

interface Restriction {
  id: number;
  name: string;
  weekDay: string;
  duration: string;
}

function Home() {
  // const [tasks, setTasks] = useState<Task[]>([]);
  // const [restrictions, setRestrictions] = useState<Restriction[]>([]);
  // const [loading, setLoading] = useState({ tasks: true, restrictions: true });

  const priorityColors = [
    {
      id: 5,
      label:"Muito baixa",
      color:"border-green-100 bg-green-100" 
    },
    {
      id: 4,
      label:"Baixa", 
      color:"border-green-200 bg-green-200" 
    },
    {
      id: 3,
      label:"Média", 
      color:"border-yellow-100 bg-yellow-100" 
    },
    {
      id: 2,
      label:"Alta", 
      color:"border-red-100 bg-red-100" 
    },
    {
      id: 1,
      label:"Urgênte",
      color:"border-red-200 bg-red-200" 
    },
  ];

  const restrictionsMocks = [
    {
      id: 1,
      name: "Daily Standup",
      weekDay: "Segunda a Sexta",
      duration: "4h"
    },
    {
      id: 2,
      name: "Reunião de Planning",
      weekDay: "Segunda",
      duration: "2h"
    },
    {
      id: 3,
      name: "Review Semanal",
      weekDay: "Sexta",
      duration: "1h"
    }
  ]

  const tasksMocks = [
    {
      id: 1,
      name: "Implementar autenticação",
      estimatedTime: "4h",
      dueDate: "2024-04-20",
      priority: 1
    },
    {
      id: 2,
      name: "Criar documentação da API",
      estimatedTime: "3h",
      dueDate: "2024-04-22",
      priority: 2
    },
    {
      id: 3,
      name: "Revisar pull requests",
      estimatedTime: "1h",
      dueDate: "2024-04-19",
      priority: 3
    }
  ]

  // useEffect(() => {
  //   // Simulated API calls
  //   const fetchTasks = async () => {
  //     try {
  //       // Replace with actual API endpoint
  //       // const response = await fetch('https://api.example.com/tasks');
  //       // const data = await response.json();
  //       setTasks();
  //       setLoading(prev => ({ ...prev, tasks: false }));
  //     } catch (error) {
  //       console.error('Error fetching tasks:', error);
  //       setLoading(prev => ({ ...prev, tasks: false }));
  //     }
  //   };

  //   const fetchRestrictions = async () => {
  //     try {
  //       // Replace with actual API endpoint
  //       // const response = await fetch('https://api.example.com/restrictions');
  //       // const data = await response.json();
  //       setRestrictions();
  //       setLoading(prev => ({ ...prev, restrictions: false }));
  //     } catch (error) {
  //       console.error('Error fetching restrictions:', error);
  //       setLoading(prev => ({ ...prev, restrictions: false }));
  //     }
  //   };

  //   fetchTasks();
  //   fetchRestrictions();
  // }, []);

  return (
    <div className="min-h-screen w-full bg-gray-50">
      <div className="container mx-auto py-8 px-4">

        <div className="space-y-8">
          {/* Container de Tarefas */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-b px-6 py-4">
              <h2 className="text-xl text-gray-800 flex items-center">
                <Timer className="h-5 w-5 mr-2 text-blue-600" />
                Tarefas Pendentes
              </h2>
            </div>
            
            <div className="p-6">
            
                <div className="space-y-4">
                  {tasksMocks.map((task) => (
                    <div
                      key={task.id}
                      className={`p-4 rounded-lg border ${priorityColors[task.priority].color} transition-all hover:shadow-md`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <h3 className="font-medium text-gray-900">{task.name}</h3>
                          <div className="flex items-center space-x-4">
                            <span className="flex items-center text-sm text-gray-500">
                              <Clock className="w-4 h-4 mr-1" />
                              {task.estimatedTime}
                            </span>
                            <span className="flex items-center text-sm text-gray-500">
                              <Calendar className="w-4 h-4 mr-1" />
                              {new Date(task.dueDate).toLocaleDateString('pt-BR')}
                            </span>
                            <span className="flex items-center text-sm text-gray-500">
                              <AlertTriangle className="w-4 h-4 mr-1" />
                              {priorityColors[task.priority].label}
                            </span>
                          </div>
                        </div>
                        <button className="text-blue-600 hover:text-blue-700">
                          <ArrowRight className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
            </div>
          </div>

          {/* Container de Restrições */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-b px-6 py-4">
              <h2 className="text-xl text-gray-800 flex items-center">
                <CalendarClock className="h-5 w-5 mr-2 text-blue-600" />
                Restrições de Horário
              </h2>
            </div>
            
            <div className="p-6">
                <div className="space-y-4">
                  {restrictionsMocks.map((restriction) => (
                    <div
                      key={restriction.id}
                      className="p-4 rounded-lg border bg-purple-50 border-purple-200 transition-all hover:shadow-md"
                    >
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <h3 className="font-medium text-gray-900">{restriction.name}</h3>
                          <div className="flex items-center space-x-4">
                            <span className="flex items-center text-sm text-gray-500">
                              <Calendar className="w-4 h-4 mr-1" />
                              {restriction.weekDay}
                            </span>
                            <span className="flex items-center text-sm text-gray-500">
                              <Clock className="w-4 h-4 mr-1" />
                              {restriction.duration}
                            </span>
                          </div>
                        </div>
                        <button className="text-blue-600 hover:text-blue-700">
                          <ArrowRight className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
import { useState } from "react";
import { Calendar as CalendarIcon, Plus, Clock, Tag } from "lucide-react";
import Calendar from "../../components/Calendar/Calendar";

function App() {
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  // Lista de eventos com suas datas
  const events = [
    {
      id: 1,
      title: "Prova de ESOF",
      description: "Estudar capítulos 5-8",
      date: "16/04",
      color: "bg-blue-50",
      category: "Acadêmico"
    },
    {
      id: 2,
      title: "Emitir NF de Março",
      description: "Prazo final para emissão",
      date: "16/04",
      color: "bg-green-50",
      category: "Financeiro"
    },
    {
      id: 3,
      title: "Pagar contas do mês",
      description: "Água, luz e internet",
      date: "17/04",
      color: "bg-yellow-50",
      category: "Financeiro"
    },
    {
      id: 4,
      title: "Finalizar API do freela",
      description: "Implementar endpoints restantes",
      date: "18/04",
      color: "bg-purple-50",
      category: "Trabalho"
    },
  ];

  // Filtrar eventos com base no dia selecionado
  const filteredEvents = selectedDay
    ? events.filter((event) => {
        const [day] = event.date.split("/");
        return Number.parseInt(day) === Number(selectedDay);
      })
    : events;

  const handleSelectDay = (day: string | null) => {
    if (day !== null) setSelectedDay(day);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="w-full max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Calendário</h1>
          <p className="text-gray-600 mt-1">Gerencie seus eventos e compromissos</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {
            <Calendar events={events} onSelectDay={handleSelectDay} />
        }
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-b px-6 py-4">
              <h2 className="text-xl text-gray-800 flex items-center">
                <CalendarIcon className="h-5 w-5 mr-2 text-blue-600" />
                Visualização Mensal
              </h2>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-gray-700">Abril 2024</h3>
                <div className="flex gap-2">
                  <button className="px-3 py-1 text-sm border rounded-md hover:bg-gray-50">Hoje</button>
                  <button className="px-3 py-1 text-sm border rounded-md hover:bg-gray-50">&lt;</button>
                  <button className="px-3 py-1 text-sm border rounded-md hover:bg-gray-50">&gt;</button>
                </div>
              </div>
              <div className="flex justify-center">
                {/* Calendar component will go here */}
              </div>
            </div>
          </div>

          {/* Lista de Eventos */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-b px-6 py-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl text-gray-800 flex items-center">
                  {selectedDay ? `Eventos do dia ${selectedDay}/04` : "Próximos Eventos"}
                </h2>
                {selectedDay && (
                  <button
                    onClick={() => setSelectedDay(null)}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Ver todos
                  </button>
                )}
              </div>
            </div>
            
            <div className="p-6">
              {filteredEvents.length > 0 ? (
                <div className="space-y-4">
                  {filteredEvents.map((event) => (
                    <div
                      key={event.id}
                      className={`p-4 rounded-lg border ${event.color} hover:shadow-md transition-shadow`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900">{event.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                          <div className="flex items-center mt-2 space-x-4">
                            <span className="flex items-center text-sm text-gray-500">
                              <Tag className="w-4 h-4 mr-1" />
                              {event.category}
                            </span>
                            <span className="flex items-center text-sm text-gray-500">
                              <Clock className="w-4 h-4 mr-1" />
                              {event.date}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-gray-500">
                  <CalendarIcon className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                  <p>
                    {selectedDay
                      ? `Não há eventos para o dia ${selectedDay}/04`
                      : "Não há eventos próximos"}
                  </p>
                </div>
              )}

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
    </div>
  );
}

export default App;
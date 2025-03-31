import { useState } from "react";
import Card from "../../components/Calendar/Card";
import Calendar from "../../components/Calendar/Calendar";
import Footer from "../../components/Calendar/Footer";

function CalendarPage() {
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  // Lista de eventos com suas datas
  const events = [
    {
      id: 1,
      title: "Prova de ESOF",
      description: "Estudar capítulos 5-8",
      date: "16/04",
      color: "bg-blue-50",
    },
    {
      id: 2,
      title: "Emitir NF de Março",
      description: "Prazo final para emissão",
      date: "16/04",
      color: "bg-green-50",
    },
    {
      id: 3,
      title: "Pagar contas do mês",
      description: "Água, luz e internet",
      date: "17/04",
      color: "",
    },
    {
      id: 4,
      title: "Finalizar API do freela",
      description: "Implementar endpoints restantes",
      date: "18/04",
      color: "",
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
    <div className="min-h-screen flex flex-col justify-center items-center w-full">
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-6">Calendário</h1>

          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <h2 className="text-xl font-semibold mb-4">
                Visualização Mensal
              </h2>
              <div className="flex justify-center">
                <Calendar events={events} onSelectDay={handleSelectDay} />
              </div>
            </Card>

            <Card>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                  {selectedDay
                    ? `Eventos do dia ${selectedDay}/04`
                    : "Próximos Eventos"}
                </h2>
                {selectedDay && (
                  <button
                    onClick={() => setSelectedDay(null)}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Ver todos
                  </button>
                )}
              </div>

              {filteredEvents.length > 0 ? (
                <div className="space-y-4">
                  {filteredEvents.map((event) => (
                    <div
                      key={event.id}
                      className={`p-3 border rounded-lg ${event.color}`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{event.title}</h3>
                          <p className="text-sm text-gray-600">
                            {event.description}
                          </p>
                        </div>
                        <div className="text-sm text-gray-600">
                          {event.date}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-gray-500">
                  {selectedDay
                    ? `Não há eventos para o dia ${selectedDay}/04`
                    : "Não há eventos próximos"}
                </div>
              )}

              <div className="mt-4">
                <button className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md bg-white hover:bg-gray-50 text-sm font-medium">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2 h-4 w-4"
                  >
                    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                    <line x1="16" x2="16" y1="2" y2="6" />
                    <line x1="8" x2="8" y1="2" y2="6" />
                    <line x1="3" x2="21" y1="10" y2="10" />
                  </svg>
                  Adicionar Novo Evento
                </button>
              </div>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default CalendarPage;

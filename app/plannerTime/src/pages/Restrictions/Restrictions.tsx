import React, { useState } from "react"
import { useNavigate } from "react-router-dom";


// Updated interface to include start and end times
interface Restricao {
  nome: string
  diasDaSemana: string[]
  horarioInicio: string
  horarioFim: string
}

const RestricaoForm: React.FC = () => {
  const [nome, setNome] = useState<string>("")
  const [diasDaSemana, setDiasDaSemana] = useState<string[]>([])
  const [horarioInicio, setHorarioInicio] = useState<string>("")
  const [horarioFim, setHorarioFim] = useState<string>("")

  const dias = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"]

  const navigate = useNavigate();

  const restrictionsRedirect = () => {
    navigate("/calendar");
  };

  const handleDiaSelecionado = (dia: string) => {
    setDiasDaSemana((prev) => (prev.includes(dia) ? prev.filter((d) => d !== dia) : [...prev, dia]))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const novaRestricao: Restricao = {
      nome,
      diasDaSemana,
      horarioInicio,
      horarioFim,
    }
    
    if (novaRestricao.horarioFim < novaRestricao.horarioInicio) {
      throw new Error("horarios invalidos");
    }

    try {
      const email = localStorage.getItem("email")

      const response = await fetch(`http://localhost:8080/createRestriction/${email}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novaRestricao),
      });

      if (!response.ok) {
        console.log("creat restriction error");
        throw new Error("creation failed. Please try again.");
      }

      alert("restrição criada com sucesso!!")

    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error);
      } else {
        alert("creat restriction error");
      }
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="w-full max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-b px-6 py-4">
          <h2 className="text-xl text-gray-800 flex items-center">
            <svg
              className="h-5 w-5 mr-2 text-blue-600"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            Cadastrar Restrição
          </h2>
        </div>
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="nome" className="block text-sm font-medium text-gray-700">
                Nome da Restrição:
              </label>
              <input
                id="nome"
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ex: Reunião semanal"
                required
              />
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">Dias da Semana:</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {dias.map((dia) => (
                  <div key={dia} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`dia-${dia}`}
                      checked={diasDaSemana.includes(dia)}
                      onChange={() => handleDiaSelecionado(dia)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`dia-${dia}`} className="text-sm text-gray-700 cursor-pointer">
                      {dia}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Intervalo de Horário:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative">
                  <label htmlFor="horarioInicio" className="block text-sm text-gray-600 mb-1">
                    Início
                  </label>
                  <input
                    id="horarioInicio"
                    type="time"
                    value={horarioInicio}
                    onChange={(e) => setHorarioInicio(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                  <svg
                    className="absolute right-3 top-[60%] transform -translate-y-1/2 h-4 w-4 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                </div>
                <div className="relative">
                  <label htmlFor="horarioFim" className="block text-sm text-gray-600 mb-1">
                    Fim
                  </label>
                  <input
                    id="horarioFim"
                    type="time"
                    value={horarioFim}
                    onChange={(e) => setHorarioFim(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                  <svg
                    className="absolute right-3 top-[60%] transform -translate-y-1/2 h-4 w-4 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                </div>
              </div>
            </div>

            <button
              onClick={restrictionsRedirect}
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Cadastrar Restrição
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default RestricaoForm
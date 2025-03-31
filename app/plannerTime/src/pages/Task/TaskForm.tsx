"use client"

import type React from "react"
import { useState } from "react"

// Definição do tipo de atividade
interface Atividade {
  nome: string
  tempoEstimado: number // Formato: "HH:MM"
  dataConclusao: string // Formato: "YYYY-MM-DD"
  prioridade: number // 1 (alta) a 5 (baixa)
}

const AtividadeForm: React.FC = () => {
  const [nome, setNome] = useState<string>("")
  const [tempoEstimado, setTempoEstimado] = useState<number>(0)
  const [dataConclusao, setDataConclusao] = useState<string>("")
  const [prioridade, setPrioridade] = useState<number>(3) // Prioridade média como padrão

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const novaAtividade: Atividade = {
      nome,
      tempoEstimado,
      dataConclusao,
      prioridade,
    }

    console.log("Nova Atividade:", novaAtividade)
    
    try {
      const email = localStorage.getItem("email")

      const response = await fetch(`http://localhost:8080/createTask/${email}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novaAtividade),
      });

      if (!response.ok) {
        console.log("creat task error");
        throw new Error("cration failed. Please try again.");
      }

    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log("creat task error");
      } else {
        console.log("creat task error");
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
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            Cadastrar Atividade
          </h2>
        </div>
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="nome" className="block text-sm font-medium text-gray-700">
                Nome da Atividade:
              </label>
              <input
                id="nome"
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ex: Finalizar relatório mensal"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="tempoEstimado" className="block text-sm font-medium text-gray-700">
                Tempo Estimado (horas):
              </label>
              <div className="relative">
                <input
                  id="tempoEstimado"
                  type="text"
                  value={tempoEstimado}
                  onChange={(e) => setTempoEstimado(Number.parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                <svg
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
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

            <div className="space-y-2">
              <label htmlFor="dataConclusao" className="block text-sm font-medium text-gray-700">
                Data de Conclusão:
              </label>
              <div className="relative">
                <input
                  id="dataConclusao"
                  type="date"
                  value={dataConclusao}
                  onChange={(e) => setDataConclusao(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                <svg
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="prioridade" className="block text-sm font-medium text-gray-700">
                Ordem de Prioridade:
              </label>
              <div className="flex flex-col space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Alta</span>
                  <span className="text-xs text-gray-500">Baixa</span>
                </div>
                <input
                  id="prioridade"
                  type="range"
                  min="1"
                  max="5"
                  value={prioridade}
                  onChange={(e) => setPrioridade(Number.parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between">
                  <span className="w-6 h-6 flex items-center justify-center text-xs font-medium text-white bg-blue-600 rounded-full">
                    1
                  </span>
                  <span className="w-6 h-6 flex items-center justify-center text-xs font-medium text-white bg-blue-500 rounded-full">
                    2
                  </span>
                  <span className="w-6 h-6 flex items-center justify-center text-xs font-medium text-white bg-blue-400 rounded-full">
                    3
                  </span>
                  <span className="w-6 h-6 flex items-center justify-center text-xs font-medium text-white bg-blue-300 rounded-full">
                    4
                  </span>
                  <span className="w-6 h-6 flex items-center justify-center text-xs font-medium text-white bg-blue-200 rounded-full">
                    5
                  </span>
                </div>
                <div className="text-center text-sm font-medium text-gray-700">
                  Prioridade selecionada:{" "}
                  {prioridade === 1
                    ? "Muito Alta"
                    : prioridade === 2
                      ? "Alta"
                      : prioridade === 3
                        ? "Média"
                        : prioridade === 4
                          ? "Baixa"
                          : "Muito Baixa"}
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Cadastrar Atividade
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AtividadeForm


"use client"

import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

// Definição do tipo de usuário
interface Usuario {
  nome: string
  email: string
  senha: string
}

const UsuarioForm: React.FC = () => {
  const [nome, setNome] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [senha, setSenha] = useState<string>("")
  const [confirmarSenha, setConfirmarSenha] = useState<string>("")
  const [mostrarSenha, setMostrarSenha] = useState<boolean>(false)
  const [erro, setErro] = useState<string>("")
  const navigate = useNavigate()

  const signUpRedirect = () => {
    navigate('/login')
  }

  const validarFormulario = (): boolean => {
    // Validar email com regex simples
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setErro("Por favor, insira um email válido.")
      return false
    }

    // Validar senha (mínimo 8 caracteres)
    if (senha.length < 8) {
      setErro("A senha deve ter pelo menos 8 caracteres.")
      return false
    }

    // Verificar se as senhas coincidem
    if (senha !== confirmarSenha) {
      setErro("As senhas não coincidem.")
      return false
    }

    setErro("")
    return true
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validarFormulario()) {
      return
    }

    const novoUsuario: Usuario = {
      nome,
      email,
      senha,
    }

    console.log("Novo Usuário:", novoUsuario)
    // Enviar para o back-end se necessário
    // fetch(`http://localhost:8080/createUser`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(novoUsuario),
    // });
  }

  return (
    <div className="container mx-auto py-8 px-4">
      
      <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
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
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            Cadastrar Usuário
          </h2>
        </div>
        <div className="p-6">
          {erro && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">{erro}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="nome" className="block text-sm font-medium text-gray-700">
                Nome:
              </label>
              <input
                id="nome"
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Seu nome completo"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email:
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="seu.email@exemplo.com"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="senha" className="block text-sm font-medium text-gray-700">
                Senha:
              </label>
              <div className="relative">
                <input
                  id="senha"
                  type={mostrarSenha ? "text" : "password"}
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Mínimo 8 caracteres"
                  required
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {mostrarSenha ? (
                    <svg
                      className="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  ) : (
                    <svg
                      className="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-500">A senha deve ter pelo menos 8 caracteres.</p>
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmarSenha" className="block text-sm font-medium text-gray-700">
                Confirmar Senha:
              </label>
              <div className="relative">
                <input
                  id="confirmarSenha"
                  type={mostrarSenha ? "text" : "password"}
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Repita sua senha"
                  required
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Cadastrar
              </button>
            </div>

            <div className="text-center text-sm text-gray-600">
              Já tem uma conta?{" "}
              <a onClick={signUpRedirect} className="text-blue-600 hover:text-blue-800 font-medium hover:underline cursor-pointer">
                Faça login
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default UsuarioForm


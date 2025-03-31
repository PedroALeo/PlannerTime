import HomeImg from '../../../public/home.jpg'

export default function PlannerTime() {
  return (
    <div className="min-h-full w-full bg-gray-50 justify-center items-center flex">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-6">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left Column - Image */}
          <div className="order-2 md:order-1">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <img
                src={HomeImg}
                alt="Calendar illustration"
                width={500}
                height={500}
                className="w-full h-auto"
              />
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="order-1 md:order-2">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Bem Vindo ao Planner Time</h1>
            <p className="text-gray-600 mb-8">
              Não perca tempo e continue agora o seu planejamento de atividades! Veja abaixo quais as suas tarefas que
              estão próximas do prazo final, mais detalhes na aba Atividades.
            </p>

            <h2 className="text-2xl font-bold text-gray-800 mb-6">Atividades</h2>

            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
              <div className="grid grid-cols-2 bg-gray-100 p-4">
                <div className="font-semibold text-gray-700">ATIVIDADES</div>
                <div className="font-semibold text-gray-700 text-right">PRAZO</div>
              </div>

              <div className="divide-y divide-gray-200">
                <div className="grid grid-cols-2 p-4 hover:bg-gray-50">
                  <div className="text-gray-700">Estudar para a prova de ESOF</div>
                  <div className="text-gray-700 text-right">16/04</div>
                </div>
                <div className="grid grid-cols-2 p-4 hover:bg-gray-50">
                  <div className="text-gray-700">Emitir NF de Março</div>
                  <div className="text-gray-700 text-right">16/04</div>
                </div>
                <div className="grid grid-cols-2 p-4 hover:bg-gray-50">
                  <div className="text-gray-700">Pagar contas do mês</div>
                  <div className="text-gray-700 text-right">17/04</div>
                </div>
                <div className="grid grid-cols-2 p-4 hover:bg-gray-50">
                  <div className="text-gray-700">Finalizar API do freela</div>
                  <div className="text-gray-700 text-right">18/04</div>
                </div>
              </div>
            </div>
            <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
              Clique aqui e veja mais detalhes
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}



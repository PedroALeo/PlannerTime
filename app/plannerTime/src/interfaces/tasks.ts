export interface Task {
  id?: number
  name: string
  estimatedTime: number
  priority: number
  dueDate: string
}

export interface CreateTask {
  nome: string
  tempoEstimado: string
  dataConclusao: string
  prioridade: number
}

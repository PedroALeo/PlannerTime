export interface RestrictionRequest {
  nome: string
  diasDaSemana: string[]
  horarioInicio: string
  horarioFim: string
}

export interface Restriction {
  id: number
  name: string
  duration: string
  weekDay: string[]
}

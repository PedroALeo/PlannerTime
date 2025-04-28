'use client'

import {
  CalendarClock,
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  Filter,
  Info,
  Plus,
  Timer,
  Trash2,
} from 'lucide-react'
import { useEffect, useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import {
  useCreateRestrictionMutation,
  useCreateTaskMutation,
  useDeleteRestrictionMutation,
  useDeleteTaskMutation,
  useGetRestrictionsQuery,
  useGetTasksQuery,
  useUserSchedullerQuery,
} from '@/store/services/apiSlice'
import { toast } from 'sonner'

// Interfaces
interface Event {
  id: string | number
  title: string
  description: string
  date: string
  startTime: string
  endTime: string
  type: 'task' | 'restriction'
  priority?: number
  completed?: boolean
  recurring?: boolean
  recurrencePattern?: string[]
}

// Configurações
const priorityColors = [
  {
    id: 5,
    label: 'Muito baixa',
    color: 'border-green-100 bg-green-100',
    badgeColor: 'bg-green-100 text-green-800',
  },
  {
    id: 4,
    label: 'Baixa',
    color: 'border-green-200 bg-green-200',
    badgeColor: 'bg-green-200 text-green-800',
  },
  {
    id: 3,
    label: 'Média',
    color: 'border-yellow-100 bg-yellow-100',
    badgeColor: 'bg-yellow-100 text-yellow-800',
  },
  {
    id: 2,
    label: 'Alta',
    color: 'border-red-100 bg-red-100',
    badgeColor: 'bg-red-100 text-red-800',
  },
  {
    id: 1,
    label: 'Urgente',
    color: 'border-red-200 bg-red-200',
    badgeColor: 'bg-red-200 text-red-800',
  },
]

const weekDays = [
  'Segunda',
  'Terça',
  'Quarta',
  'Quinta',
  'Sexta',
  'Sábado',
  'Domingo',
]

// Função para gerar datas da semana atual
const getCurrentWeekDates = (date: Date) => {
  const currentDay = date.getDay() // 0 = Domingo, 1 = Segunda, ...
  const startDate = new Date(date)

  // Ajustar para começar na segunda-feira (considerando que 0 = Domingo)
  startDate.setDate(date.getDate() - (currentDay === 0 ? 6 : currentDay - 1))

  const weekDates = []
  for (let i = 0; i < 7; i++) {
    const newDate = new Date(startDate)
    newDate.setDate(startDate.getDate() + i)
    weekDates.push(newDate)
  }

  return weekDates
}

// Função para formatar data como YYYY-MM-DD
const formatDateToYYYYMMDD = (date: Date) => {
  return date.toISOString().split('T')[0]
}

// Função para agrupar eventos por data
const groupEventsByDate = (events: Event[]) => {
  const grouped: Record<string, Event[]> = {}

  events.forEach((event) => {
    if (!grouped[event.date]) {
      grouped[event.date] = []
    }
    grouped[event.date].push(event)
  })

  return grouped
}

export default function Events() {
  const email = localStorage.getItem('email') || ''

  // Estados
  const [currentDate, setCurrentDate] = useState(new Date())
  const [events, setEvents] = useState<Event[]>([])
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [isEventModalOpen, setIsEventModalOpen] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [filters, setFilters] = useState({
    types: ['task', 'restriction'],
    priority: [1, 2, 3, 4, 5],
  })

  // Mutations
  const [createTask] = useCreateTaskMutation()
  const [createRestriction] = useCreateRestrictionMutation()
  const [deleteTask] = useDeleteTaskMutation()
  const [deleteRestriction] = useDeleteRestrictionMutation()

  // Buscar dados da API
  const { data: tasks = [], isLoading: isLoadingTasks } = useGetTasksQuery(
    { email },
    {
      skip: !email,
    }
  )
  const { restrictions, isLoadingRestrictions } = useGetRestrictionsQuery(
    { email },
    {
      selectFromResult: ({ data, isLoading }) => ({
        restrictions: data || [],
        isLoadingRestrictions: isLoading,
      }),
      skip: !email,
    }
  )
  const { userSchedule, isLoadingSchedule } = useUserSchedullerQuery(
    { username: email },
    {
      selectFromResult: ({ data, isLoading }) => ({
        userSchedule: data,
        isLoadingSchedule: isLoading,
      }),
      skip: !email,
    }
  )

  // Funções de navegação
  const navigatePrevious = () => {
    const newDate = new Date(currentDate)
    newDate.setDate(newDate.getDate() - 7)
    setCurrentDate(newDate)
  }

  const navigateNext = () => {
    const newDate = new Date(currentDate)
    newDate.setDate(newDate.getDate() + 7)
    setCurrentDate(newDate)
  }

  const navigateToday = () => {
    setCurrentDate(new Date())
  }

  // Combinar e formatar dados da API
  useEffect(() => {
    if (!tasks || !restrictions) return

    const formattedTasks = tasks.map((task) => ({
      id: task.id?.toString() || Math.random().toString(),
      title: task.name,
      description: task.name,
      date: task.dueDate,
      startTime: '09:00',
      endTime: `${9 + (task.estimatedTime || 1)}:00`,
      type: 'task' as const,
      priority: task.priority,
      completed: false,
    }))

    const dayMap: Record<string, number> = {
      Domingo: 0,
      Segunda: 1,
      Terça: 2,
      Quarta: 3,
      Quinta: 4,
      Sexta: 5,
      Sábado: 6,
    }

    const formattedRestrictions = restrictions.flatMap((restriction) => {
      if (!Array.isArray(restriction.weekDay)) return []

      // Calcular as datas para todas as semanas
      const today = new Date()
      const allRestrictions: {
        id: string
        title: string
        description: string
        date: string
        startTime: string
        endTime: string
        type: 'restriction'
        recurring: boolean
        recurrencePattern: string[]
      }[] = []

      // Calcular para 52 semanas (1 ano)
      for (let week = 0; week < 52; week++) {
        restriction.weekDay.forEach((day) => {
          const targetDay = dayMap[day]
          const startOfWeek = new Date(today)
          startOfWeek.setDate(today.getDate() + week * 7)
          const currentDay = startOfWeek.getDay()
          const daysToAdd = (targetDay - currentDay + 7) % 7

          const targetDate = new Date(startOfWeek)
          targetDate.setDate(startOfWeek.getDate() + daysToAdd)

          allRestrictions.push({
            id: `${restriction.id}-${day}-${week}`,
            title: restriction.name,
            description: `Duração: ${restriction.duration}h`,
            date: targetDate.toISOString().split('T')[0],
            startTime: '09:00',
            endTime: `${9 + Number(restriction.duration || 1)}:00`,
            type: 'restriction' as const,
            recurring: true,
            recurrencePattern: restriction.weekDay,
          })
        })
      }

      return allRestrictions
    })

    setEvents([...formattedTasks, ...formattedRestrictions])
  }, [tasks, restrictions])

  // Estado para novo item
  const [newItem, setNewItem] = useState<{
    title: string
    description: string
    date: string
    startTime: string
    endTime: string
    type: 'task' | 'restriction'
    priority?: number
    recurring?: boolean
    recurrencePattern?: string[]
  }>({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '10:00',
    type: 'task',
    priority: 3,
    recurring: false,
    recurrencePattern: [],
  })

  // Datas para visualização
  const weekDates = getCurrentWeekDates(currentDate)

  // Eventos agrupados por data
  const groupedEvents = groupEventsByDate(
    events.filter(
      (event) =>
        filters.types.includes(event.type) &&
        (event.type !== 'task' ||
          filters.priority.includes(event.priority || 3))
    )
  )

  const handleViewEventDetails = (event: Event) => {
    setSelectedEvent(event)
    setIsDetailModalOpen(true)
  }

  const handleDeleteEvent = async () => {
    if (!selectedEvent || !email) return

    try {
      if (selectedEvent.type === 'task') {
        await deleteTask({ email, taskId: Number(selectedEvent.id) }).unwrap()
        toast.success(
          `A tarefa "${selectedEvent.title}" foi excluída com sucesso.`
        )
      } else if (selectedEvent.type === 'restriction') {
        // Extrair o ID real da restrição (removendo o sufixo do dia da semana)
        const restrictionId = Number(String(selectedEvent.id).split('-')[0])
        await deleteRestriction({ email, restrictionId }).unwrap()
        toast.success(
          `A restrição "${selectedEvent.title}" foi excluída com sucesso.`
        )
      }

      setIsDetailModalOpen(false)
    } catch (error) {
      console.error('Erro ao excluir item:', error)
      toast.error('Ocorreu um erro ao excluir o item. Tente novamente.')
    }
  }

  const toggleWeekDay = (day: string) => {
    setNewItem((prev) => {
      const pattern = prev.recurrencePattern || []
      if (pattern.includes(day)) {
        return {
          ...prev,
          recurrencePattern: pattern.filter((d) => d !== day),
        }
      }
      return {
        ...prev,
        recurrencePattern: [...pattern, day],
      }
    })
  }

  const toggleFilter = (type: 'task' | 'restriction') => {
    setFilters((prev) => {
      if (prev.types.includes(type)) {
        return { ...prev, types: prev.types.filter((t) => t !== type) }
      } else {
        return { ...prev, types: [...prev.types, type] }
      }
    })
  }

  const togglePriorityFilter = (priority: number) => {
    setFilters((prev) => {
      if (prev.priority.includes(priority)) {
        return {
          ...prev,
          priority: prev.priority.filter((p) => p !== priority),
        }
      } else {
        return { ...prev, priority: [...prev.priority, priority] }
      }
    })
  }

  const handleCreateItem = async () => {
    try {
      if (!email) {
        toast.error('Você precisa estar logado para criar um item.')
        return
      }

      if (newItem.type === 'task') {
        await createTask({
          email,
          task: {
            nome: newItem.title,
            tempoEstimado: newItem.startTime,
            dataConclusao: newItem.date,
            prioridade: newItem.priority || 3,
          },
        }).unwrap()

        toast.success(`A tarefa "${newItem.title}" foi criada com sucesso.`)
      } else {
        if (!newItem.recurring || !newItem.recurrencePattern?.length) {
          toast.error('Selecione pelo menos um dia da semana para a restrição.')
          return
        }

        await createRestriction({
          email,
          data: {
            nome: newItem.title,
            diasDaSemana: newItem.recurrencePattern || [],
            horarioInicio: newItem.startTime,
            horarioFim: newItem.endTime,
          },
        }).unwrap()

        toast.success(`A restrição "${newItem.title}" foi criada com sucesso.`)
      }

      setIsEventModalOpen(false)
      setNewItem({
        title: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        startTime: '09:00',
        endTime: '10:00',
        type: 'task',
        priority: 3,
        recurring: false,
        recurrencePattern: [],
      })
    } catch (error) {
      console.error('Erro ao criar item:', error)
      toast.error('Ocorreu um erro ao criar o item. Tente novamente.')
    }
  }

  // Renderização de eventos
  const renderEventItem = (event: Event) => {
    const getEventColor = () => {
      switch (event.type) {
        case 'task': {
          const priority =
            priorityColors.find((p) => p.id === event.priority) ||
            priorityColors[2]
          return priority.color
        }
        case 'restriction':
          return 'border-red-200 bg-red-100 hover:bg-red-100'
        default:
          return 'border-gray-200 bg-gray-50'
      }
    }

    const getEventIcon = () => {
      switch (event.type) {
        case 'task':
          return <Timer className='h-4 w-4 text-yellow-600' />
        case 'restriction':
          return <CalendarClock className='h-4 w-4 text-red-600' />
        default:
          return <Info className='h-4 w-4' />
      }
    }

    const getEventBadge = () => {
      switch (event.type) {
        case 'task': {
          const priority =
            priorityColors.find((p) => p.id === event.priority) ||
            priorityColors[2]
          return (
            <Badge variant='outline' className={priority.badgeColor}>
              {priority.label}
            </Badge>
          )
        }
        case 'restriction':
          return (
            <Badge
              variant='outline'
              className='bg-indigo-100 text-indigo-800 hover:bg-indigo-100'
            >
              Restrição
            </Badge>
          )
        default:
          return null
      }
    }

    return (
      <div
        key={event.id}
        className={`group mb-2 cursor-pointer rounded-md border p-1 shadow-sm transition-all hover:shadow-md ${getEventColor()}`}
        onClick={() => handleViewEventDetails(event)}
      >
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            {getEventIcon()}
            <span className='text-xs font-medium'>{event.title}</span>
          </div>
          {getEventBadge()}
        </div>
        <div className='mt-1 flex items-center gap-2 text-xs text-gray-600'>
          <Clock className='h-2 w-2' />
          <span>
            {event.startTime} - {event.endTime}
          </span>
        </div>
      </div>
    )
  }

  // Renderização de dias da semana
  const renderWeekView = () => {
    return (
      <div className='grid grid-cols-7 gap-1'>
        {weekDates.map((date, index) => {
          const dateStr = formatDateToYYYYMMDD(date)
          const isToday = formatDateToYYYYMMDD(new Date()) === dateStr
          const dayEvents = groupedEvents[dateStr] || []
          const daySchedule = userSchedule?.[dateStr] || {}

          return (
            <div key={index} className='flex min-h-[400px] flex-col'>
              <div
                className={`mb-2 rounded-t-md p-2 text-center font-medium ${isToday ? 'bg-blue-100 text-blue-800' : 'bg-gray-100'}`}
              >
                <div className='text-sm uppercase'>{weekDays[index]}</div>
                <div className={`text-xl ${isToday ? 'font-bold' : ''}`}>
                  {date.getDate()}
                </div>
                <div className='text-xs text-gray-500'>
                  {date.toLocaleDateString('pt-BR', { month: 'short' })}
                </div>
              </div>
              <div className='flex max-h-[500px] flex-1 flex-col rounded-b-md border border-t-0 p-2'>
                {isLoadingTasks ||
                isLoadingRestrictions ||
                isLoadingSchedule ? (
                  <div className='flex h-full items-center justify-center'>
                    <div className='h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600'></div>
                  </div>
                ) : dayEvents.length === 0 &&
                  Object.keys(daySchedule).length === 0 ? (
                  <div className='flex h-full items-center justify-center text-center text-xs text-gray-400'>
                    <div>
                      <div className='mb-2 flex justify-center'>
                        <CalendarIcon className='h-10 w-10 text-gray-200' />
                      </div>
                      <p>Nenhum evento</p>
                    </div>
                  </div>
                ) : (
                  <div className='custom-scrollbar mb-2 flex-1 overflow-y-auto pr-1'>
                    {dayEvents.map((event) => renderEventItem(event))}
                    {Object.entries(daySchedule).map(([hour, activity]) => (
                      <div
                        key={`${dateStr}-${hour}`}
                        className='mb-2 rounded-md border border-blue-200 bg-blue-50 p-2'
                      >
                        <div className='flex items-center gap-2'>
                          <CalendarClock className='h-3 w-3 text-blue-600' />
                          <span className='text-xs font-medium'>
                            {activity.activiteName}
                          </span>
                        </div>
                        <div className='mt-1 flex items-center gap-2 text-xs text-gray-600'>
                          <Clock className='h-3 w-3' />
                          <span>
                            {hour}:00 - {Number(hour) + 1}:00
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <Button
                  variant='ghost'
                  size='sm'
                  className='mt-auto w-full justify-center text-xs text-gray-500 hover:bg-gray-50'
                  onClick={(e) => {
                    e.stopPropagation()
                    setNewItem((prev) => ({ ...prev, date: dateStr }))
                    setIsEventModalOpen(true)
                  }}
                >
                  <Plus className='mr-1 h-3 w-3' />
                  Adicionar
                </Button>
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  // Formatação de título
  const formatViewTitle = () => {
    const firstDay = weekDates[0]
    const lastDay = weekDates[6]
    const firstMonth = firstDay.toLocaleDateString('pt-BR', { month: 'long' })
    const lastMonth = lastDay.toLocaleDateString('pt-BR', { month: 'long' })

    if (firstDay.getMonth() === lastDay.getMonth()) {
      return `${firstDay.getDate()} - ${lastDay.getDate()} de ${firstMonth}`
    } else {
      return `${firstDay.getDate()} de ${firstMonth} - ${lastDay.getDate()} de ${lastMonth}`
    }
  }

  return (
    <div className='container mx-auto h-full w-full py-4'>
      {/* Cabeçalho */}
      <div className='mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h1 className='text-2xl font-bold'>Eventos e Atividades</h1>
          <p className='text-gray-500'>
            Visualize e gerencie seus eventos, tarefas e restrições
          </p>
        </div>

        <div className='flex flex-wrap items-center gap-2'>
          <div className='flex items-center rounded-md border bg-white shadow-sm'>
            <Button variant='ghost' size='sm' onClick={navigatePrevious}>
              <ChevronLeft className='h-4 w-4' />
            </Button>
            <Button
              variant='ghost'
              className='font-medium'
              onClick={navigateToday}
            >
              Hoje
            </Button>
            <Button variant='ghost' size='sm' onClick={navigateNext}>
              <ChevronRight className='h-4 w-4' />
            </Button>
          </div>

          <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <PopoverTrigger asChild>
              <Button
                variant='outline'
                size='sm'
                className='flex items-center gap-1'
              >
                <Filter className='h-4 w-4' />
                <span className='hidden sm:inline'>Filtros</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-80'>
              <div className='space-y-4'>
                <h4 className='font-medium'>Filtrar por tipo</h4>
                <div className='flex flex-wrap gap-2'>
                  <div className='flex items-center space-x-2'>
                    <Checkbox
                      id='filter-task'
                      checked={filters.types.includes('task')}
                      onCheckedChange={() => toggleFilter('task')}
                    />
                    <Label
                      htmlFor='filter-task'
                      className='flex items-center gap-1'
                    >
                      <Timer className='h-4 w-4 text-yellow-600' />
                      Tarefas
                    </Label>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <Checkbox
                      id='filter-restriction'
                      checked={filters.types.includes('restriction')}
                      onCheckedChange={() => toggleFilter('restriction')}
                    />
                    <Label
                      htmlFor='filter-restriction'
                      className='flex items-center gap-1'
                    >
                      <CalendarClock className='h-4 w-4 text-purple-600' />
                      Restrições
                    </Label>
                  </div>
                </div>

                <div className='pt-2'>
                  <h4 className='font-medium'>Filtrar por prioridade</h4>
                  <div className='mt-2 flex flex-wrap gap-2'>
                    {priorityColors.map((priority) => (
                      <div
                        key={priority.id}
                        className='flex items-center space-x-2'
                      >
                        <Checkbox
                          id={`filter-priority-${priority.id}`}
                          checked={filters.priority.includes(priority.id)}
                          onCheckedChange={() =>
                            togglePriorityFilter(priority.id)
                          }
                        />
                        <Label
                          htmlFor={`filter-priority-${priority.id}`}
                          className={`rounded-full px-2 py-1 text-xs ${priority.badgeColor}`}
                        >
                          {priority.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <Button
            onClick={() => setIsEventModalOpen(true)}
            className='ml-auto flex items-center gap-1 sm:ml-0'
          >
            <Plus className='h-4 w-4' />
            <span>Novo</span>
          </Button>
        </div>
      </div>

      {/* Título da visualização */}
      <div className='mb-4 text-center text-xl font-medium'>
        {formatViewTitle()}
      </div>

      {/* Conteúdo principal */}
      <Card className='border-none shadow-lg'>
        <CardContent className='p-4'>{renderWeekView()}</CardContent>
      </Card>

      {/* Modal para criar novo evento */}
      <Dialog open={isEventModalOpen} onOpenChange={setIsEventModalOpen}>
        <DialogContent className='sm:max-w-[550px]'>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2 text-xl'>
              <Plus className='h-5 w-5 text-blue-600' />
              Novo Item
            </DialogTitle>
            <DialogDescription>
              Preencha os detalhes do item abaixo.
            </DialogDescription>
          </DialogHeader>

          <div className='grid gap-4 py-4'>
            <div className='grid gap-2'>
              <Label htmlFor='event-title'>Título</Label>
              <Input
                id='event-title'
                placeholder='Digite o título do item'
                value={newItem.title}
                onChange={(e) =>
                  setNewItem({ ...newItem, title: e.target.value })
                }
              />
            </div>

            <div className='grid gap-2'>
              <Label htmlFor='event-description'>Descrição</Label>
              <Textarea
                id='event-description'
                placeholder='Digite uma descrição para o item'
                value={newItem.description}
                onChange={(e) =>
                  setNewItem({ ...newItem, description: e.target.value })
                }
                className='h-20'
              />
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div className='grid gap-2'>
                <Label htmlFor='event-date'>Data</Label>
                <Input
                  id='event-date'
                  type='date'
                  value={newItem.date}
                  onChange={(e) =>
                    setNewItem({ ...newItem, date: e.target.value })
                  }
                />
              </div>

              <div className='grid gap-2'>
                <Label htmlFor='event-type'>Tipo</Label>
                <Select
                  value={newItem.type}
                  onValueChange={(value) =>
                    setNewItem({
                      ...newItem,
                      type: value as 'task' | 'restriction',
                    })
                  }
                >
                  <SelectTrigger id='event-type'>
                    <SelectValue placeholder='Selecione o tipo' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='task'>Tarefa</SelectItem>
                    <SelectItem value='restriction'>Restrição</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div className='grid gap-2'>
                <Label htmlFor='start-time'>Horário de Início</Label>
                <Input
                  id='start-time'
                  type='time'
                  value={newItem.startTime}
                  onChange={(e) =>
                    setNewItem({ ...newItem, startTime: e.target.value })
                  }
                />
              </div>
              <div className='grid gap-2'>
                <Label htmlFor='end-time'>Horário de Fim</Label>
                <Input
                  id='end-time'
                  type='time'
                  value={newItem.endTime}
                  onChange={(e) =>
                    setNewItem({ ...newItem, endTime: e.target.value })
                  }
                />
              </div>
            </div>

            {newItem.type === 'task' && (
              <div className='grid gap-2'>
                <Label>Prioridade</Label>
                <RadioGroup
                  value={String(newItem.priority)}
                  onValueChange={(value) =>
                    setNewItem({ ...newItem, priority: Number(value) })
                  }
                  className='flex flex-wrap gap-2'
                >
                  {priorityColors.map((priority) => (
                    <div
                      key={priority.id}
                      className='flex items-center space-x-2'
                    >
                      <RadioGroupItem
                        value={String(priority.id)}
                        id={`priority-${priority.id}`}
                      />
                      <Label
                        htmlFor={`priority-${priority.id}`}
                        className={`rounded-full px-3 py-1 text-xs ${priority.badgeColor}`}
                      >
                        {priority.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}

            {newItem.type === 'restriction' && (
              <div className='grid gap-2'>
                <div className='flex items-center space-x-2'>
                  <Checkbox
                    id='recurring'
                    checked={newItem.recurring}
                    onCheckedChange={(checked) =>
                      setNewItem({
                        ...newItem,
                        recurring: checked as boolean,
                      })
                    }
                  />
                  <Label htmlFor='recurring'>Recorrente</Label>
                </div>

                {newItem.recurring && (
                  <div className='mt-2'>
                    <Label className='mb-2 block'>Dias da semana</Label>
                    <div className='flex flex-wrap gap-2'>
                      {weekDays.map((day) => (
                        <Button
                          key={day}
                          type='button'
                          variant={
                            newItem.recurrencePattern?.includes(day)
                              ? 'default'
                              : 'outline'
                          }
                          className={`h-auto rounded-full px-3 py-1 text-xs ${
                            newItem.recurrencePattern?.includes(day)
                              ? 'bg-blue-600 text-white hover:bg-blue-700'
                              : 'border-blue-200 text-blue-700 hover:bg-blue-50'
                          }`}
                          onClick={() => toggleWeekDay(day)}
                        >
                          {day}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setIsEventModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleCreateItem}
              disabled={!newItem.title || !newItem.date}
              className={
                newItem.type === 'task'
                  ? 'bg-yellow-600 hover:bg-yellow-700'
                  : 'bg-purple-600 hover:bg-purple-700'
              }
            >
              Criar {newItem.type === 'task' ? 'Tarefa' : 'Restrição'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de detalhes do evento */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className='sm:max-w-[500px]'>
          {selectedEvent && (
            <>
              <DialogHeader>
                <div className='flex items-center justify-between'>
                  <DialogTitle className='flex items-center gap-2 text-xl'>
                    {selectedEvent.type === 'task' && (
                      <Timer className='h-5 w-5 text-yellow-600' />
                    )}
                    {selectedEvent.type === 'restriction' && (
                      <CalendarClock className='h-5 w-5 text-purple-600' />
                    )}
                    {selectedEvent.title}
                  </DialogTitle>
                  <Badge
                    variant='outline'
                    className={
                      selectedEvent.type === 'task'
                        ? (
                            priorityColors.find(
                              (p) => p.id === selectedEvent.priority
                            ) || priorityColors[2]
                          ).badgeColor
                        : 'bg-purple-100 text-xs text-purple-800'
                    }
                  >
                    {selectedEvent.type === 'task'
                      ? (
                          priorityColors.find(
                            (p) => p.id === selectedEvent.priority
                          ) || priorityColors[2]
                        ).label
                      : 'Restrição'}
                  </Badge>
                </div>
              </DialogHeader>

              <div className='space-y-4 py-4'>
                {selectedEvent.description && (
                  <div>
                    <h4 className='mb-1 font-medium text-gray-700'>
                      Descrição
                    </h4>
                    <p className='text-gray-600'>{selectedEvent.description}</p>
                  </div>
                )}

                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <h4 className='mb-1 font-medium text-gray-700'>Data</h4>
                    <p className='flex items-center gap-2 text-gray-600'>
                      <CalendarIcon className='h-4 w-4' />
                      {new Date(selectedEvent.date).toLocaleDateString('pt-BR')}
                    </p>
                  </div>

                  <div>
                    <h4 className='mb-1 font-medium text-gray-700'>Horário</h4>
                    <p className='flex items-center gap-2 text-gray-600'>
                      <Clock className='h-4 w-4' />
                      {selectedEvent.startTime} - {selectedEvent.endTime}
                    </p>
                  </div>
                </div>

                {selectedEvent.recurring && selectedEvent.recurrencePattern && (
                  <div>
                    <h4 className='mb-1 font-medium text-gray-700'>
                      Recorrência
                    </h4>
                    <div className='flex flex-wrap gap-1'>
                      {selectedEvent.recurrencePattern.map((day) => (
                        <Badge
                          key={day}
                          variant='outline'
                          className='bg-gray-100'
                        >
                          {day}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {selectedEvent.type === 'task' && (
                  <div className='flex items-center space-x-2 pt-2'>
                    <Checkbox
                      id='task-completed'
                      checked={selectedEvent.completed}
                      disabled
                    />
                    <Label htmlFor='task-completed'>
                      {selectedEvent.completed
                        ? 'Tarefa concluída'
                        : 'Tarefa pendente'}
                    </Label>
                  </div>
                )}
              </div>

              <DialogFooter className='flex flex-col-reverse gap-2 sm:flex-row sm:justify-between'>
                <Button
                  variant='destructive'
                  onClick={handleDeleteEvent}
                  className='flex items-center gap-1'
                >
                  <Trash2 className='h-4 w-4' />
                  <span>Excluir</span>
                </Button>

                <Button onClick={() => setIsDetailModalOpen(false)}>
                  Fechar
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

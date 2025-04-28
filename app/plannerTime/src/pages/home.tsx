import {
  AlertTriangle,
  ArrowRight,
  Calendar,
  CalendarClock,
  Clock,
  Plus,
  Timer,
  Trash2,
} from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import ModalCreateRestrictions from '@/components/restrictions/modal-create-restrictions'
import ModalDeleteRestrictions from '@/components/restrictions/modal-delete-restrictions'
import ModalCreateTasks from '@/components/tasks/modal-create-tasks'
import ModalDeleteTasks from '@/components/tasks/modal-delete-tasks'
import { Restriction } from '@/interfaces/restriction'
import { Task } from '@/interfaces/tasks'
import {
  useGetRestrictionsQuery,
  useGetTasksQuery,
} from '@/store/services/apiSlice'

export const priorityColors = [
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
export default function Home() {
  const navigate = useNavigate()
  const email = localStorage.getItem('email')

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const [isRestrictionModalOpen, setIsRestrictionModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('tarefas')
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null)
  const [restrictionToDelete, setRestrictionToDelete] =
    useState<Restriction | null>(null)

  const { tasks, isLoadingTasks } = useGetTasksQuery(
    { email: email || '' },
    {
      selectFromResult: ({ data, isLoading }) => ({
        tasks: data || [],
        isLoadingTasks: isLoading,
      }),
      skip: !email,
    }
  )

  const { restrictions, isLoadingRestrictions } = useGetRestrictionsQuery(
    { email: email || '' },
    {
      selectFromResult: ({ data, isLoading }) => ({
        restrictions: data || [],
        isLoadingRestrictions: isLoading,
      }),
      skip: !email,
    }
  )

  return (
    <div className='container mx-auto p-4'>
      {/* Header com estatísticas */}
      <div className='mb-6 grid gap-4 md:grid-cols-4'>
        <Card className='bg-gradient-to-br from-blue-50 to-blue-100'>
          <CardContent className='flex items-center justify-between p-6'>
            <div>
              <p className='text-sm font-medium text-blue-600'>
                Total de Tarefas
              </p>
              <h3 className='text-2xl font-bold'>{tasks.length}</h3>
            </div>
            <div className='rounded-full bg-blue-100 p-3'>
              <Timer className='h-6 w-6 text-blue-600' />
            </div>
          </CardContent>
        </Card>

        <Card className='bg-gradient-to-br from-green-50 to-green-100'>
          <CardContent className='flex items-center justify-between p-4'>
            <div>
              <p className='text-sm font-medium text-green-600'>Concluídas</p>
              <h3 className='text-2xl font-bold'>0</h3>
            </div>
            <div className='rounded-full bg-green-100 p-3'>
              <Clock className='h-6 w-6 text-green-600' />
            </div>
          </CardContent>
        </Card>

        <Card className='bg-gradient-to-br from-yellow-50 to-yellow-100'>
          <CardContent className='flex items-center justify-between p-6'>
            <div>
              <p className='text-sm font-medium text-yellow-600'>Pendentes</p>
              <h3 className='text-2xl font-bold'>{tasks.length}</h3>
            </div>
            <div className='rounded-full bg-yellow-100 p-3'>
              <AlertTriangle className='h-6 w-6 text-yellow-600' />
            </div>
          </CardContent>
        </Card>

        <Card className='bg-gradient-to-br from-purple-50 to-purple-100'>
          <CardContent className='flex items-center justify-between p-6'>
            <div>
              <p className='text-sm font-medium text-purple-600'>Restrições</p>
              <h3 className='text-2xl font-bold'>{restrictions.length}</h3>
            </div>
            <div className='rounded-full bg-purple-100 p-3'>
              <CalendarClock className='h-6 w-6 text-purple-600' />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs para alternar entre tarefas e restrições */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
        <div className='flex items-center justify-between'>
          <TabsList className='grid w-[400px] grid-cols-2'>
            <TabsTrigger value='tarefas' className='flex items-center gap-2'>
              <Timer className='h-4 w-4' />
              Tarefas Pendentes
            </TabsTrigger>
            <TabsTrigger value='restricoes' className='flex items-center gap-2'>
              <CalendarClock className='h-4 w-4' />
              Restrições de Horário
            </TabsTrigger>
          </TabsList>

          <div className='flex gap-2'>
            <Button
              onClick={() => setIsTaskModalOpen(true)}
              className='flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700'
            >
              <Plus className='h-4 w-4' />
              Nova Tarefa
            </Button>
            <Button
              onClick={() => setIsRestrictionModalOpen(true)}
              variant='outline'
              className='flex items-center gap-2 border-blue-600 text-blue-600 hover:bg-blue-50'
            >
              <Plus className='h-4 w-4' />
              Nova Restrição
            </Button>
          </div>
        </div>

        <TabsContent value='tarefas' className='mt-4'>
          <Card className='gap-2 border-none py-0 shadow-lg'>
            <CardHeader className='bg-gradient-to-r from-blue-50 to-transparent py-2'>
              <CardTitle className='flex items-center text-2xl font-bold text-gray-800'>
                <Timer className='mr-2 h-6 w-6 text-blue-600' />
                Tarefas Pendentes
              </CardTitle>
            </CardHeader>
            <CardContent className='px-4 py-2'>
              <div className='max-h-[380px] space-y-4 overflow-y-auto pr-2'>
                {isLoadingTasks ? (
                  <div className='flex h-40 items-center justify-center text-gray-500'>
                    <div className='animate-pulse text-center'>
                      <div className='mb-2 h-4 w-32 rounded bg-gray-200'></div>
                      <div className='h-2 w-48 rounded bg-gray-200'></div>
                    </div>
                  </div>
                ) : tasks.length === 0 ? (
                  <div className='flex h-40 flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-gray-300 p-8 text-center text-gray-500'>
                    <Timer className='h-12 w-12 text-gray-300' />
                    <div>
                      <p className='mb-1 text-lg font-medium'>
                        Nenhuma tarefa encontrada
                      </p>
                      <p className='text-sm'>
                        Clique em "Nova Tarefa" para adicionar uma tarefa.
                      </p>
                    </div>
                    <Button
                      onClick={() => setIsTaskModalOpen(true)}
                      variant='outline'
                      className='mt-2'
                    >
                      <Plus className='mr-2 h-4 w-4' />
                      Nova Tarefa
                    </Button>
                  </div>
                ) : (
                  tasks.map((task: Task, index: number) => {
                    const priority =
                      priorityColors.find((p) => p.id === task.priority) ||
                      priorityColors[2]
                    return (
                      <div
                        key={index}
                        className='group relative rounded-lg border bg-white p-5 shadow-sm transition-all hover:shadow-md'
                      >
                        <div className='flex items-center justify-between'>
                          <div className='space-y-3'>
                            <div className='flex items-center gap-3'>
                              <h3 className='text-lg font-medium text-gray-900'>
                                {task.name}
                              </h3>
                              <span
                                className={`rounded-full px-3 py-1 text-xs font-medium ${priority.badgeColor}`}
                              >
                                {priority.label}
                              </span>
                            </div>
                            <div className='flex flex-wrap items-center gap-4'>
                              <span className='flex items-center text-sm text-gray-600'>
                                <Clock className='mr-1 h-4 w-4 text-gray-400' />
                                {task.estimatedTime} horas
                              </span>
                              <span className='flex items-center text-sm text-gray-600'>
                                <Calendar className='mr-1 h-4 w-4 text-gray-400' />
                                {new Date(task.dueDate).toLocaleDateString(
                                  'pt-BR'
                                )}
                              </span>
                            </div>
                          </div>
                          <div className='flex items-center gap-2'>
                            <Button
                              variant='ghost'
                              onClick={() => navigate('/calendar')}
                              className='flex h-9 w-9 items-center justify-center rounded-full p-0 text-blue-600 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-blue-50 hover:text-blue-700'
                            >
                              <ArrowRight className='h-5 w-5' />
                            </Button>
                            <Button
                              variant='ghost'
                              onClick={() => setTaskToDelete(task)}
                              className='flex h-9 w-9 items-center justify-center rounded-full p-0 text-red-600 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-50 hover:text-red-700'
                            >
                              <Trash2 className='h-5 w-5' />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </CardContent>
            {tasks.length > 0 && (
              <CardFooter className='flex justify-center border-t bg-gray-50 px-6 py-4'>
                <Button
                  variant='outline'
                  onClick={() => navigate('/calendar')}
                  className='flex items-center gap-2'
                >
                  <Calendar className='h-4 w-4' />
                  Ver todas no calendário
                </Button>
              </CardFooter>
            )}
          </Card>
        </TabsContent>

        <TabsContent value='restricoes' className='mt-4'>
          <Card className='gap-2 border-none py-0 shadow-lg'>
            <CardHeader className='bg-gradient-to-r from-purple-50 to-transparent py-2'>
              <CardTitle className='flex items-center text-2xl font-bold text-gray-800'>
                <CalendarClock className='mr-2 h-6 w-6 text-purple-600' />
                Restrições de Horário
              </CardTitle>
            </CardHeader>
            <CardContent className='px-4 py-2'>
              <div className='max-h-[380px] space-y-4 overflow-y-auto pr-2'>
                {isLoadingRestrictions ? (
                  <div className='flex h-40 items-center justify-center text-gray-500'>
                    <div className='animate-pulse text-center'>
                      <div className='mb-2 h-4 w-32 rounded bg-gray-200'></div>
                      <div className='h-2 w-48 rounded bg-gray-200'></div>
                    </div>
                  </div>
                ) : restrictions.length === 0 ? (
                  <div className='flex h-40 flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-gray-300 p-8 text-center text-gray-500'>
                    <CalendarClock className='h-12 w-12 text-gray-300' />
                    <div>
                      <p className='mb-1 text-lg font-medium'>
                        Nenhuma restrição encontrada
                      </p>
                      <p className='text-sm'>
                        Clique em "Nova Restrição" para adicionar uma restrição.
                      </p>
                    </div>
                    <Button
                      onClick={() => setIsRestrictionModalOpen(true)}
                      variant='outline'
                      className='mt-2'
                    >
                      <Plus className='mr-2 h-4 w-4' />
                      Nova Restrição
                    </Button>
                  </div>
                ) : (
                  restrictions.map(
                    (restriction: Restriction, index: number) => (
                      <div
                        key={index}
                        className='group relative rounded-lg border bg-white p-5 shadow-sm transition-all hover:shadow-md'
                      >
                        <div className='flex items-center justify-between'>
                          <div className='space-y-3'>
                            <div className='flex items-center gap-3'>
                              <h3 className='text-lg font-medium text-gray-900'>
                                {restriction.name}
                              </h3>
                              <span className='rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-800'>
                                Restrição
                              </span>
                            </div>
                            <div className='flex flex-wrap items-center gap-4'>
                              <span className='flex items-center text-sm text-gray-600'>
                                <Calendar className='mr-1 h-4 w-4 text-gray-400' />
                                {Array.isArray(restriction.weekDay)
                                  ? restriction.weekDay.join(', ')
                                  : restriction.weekDay}
                              </span>
                              <span className='flex items-center text-sm text-gray-600'>
                                <Clock className='mr-1 h-4 w-4 text-gray-400' />
                                {restriction.duration === '1'
                                  ? `${restriction.duration} hora`
                                  : `${restriction.duration} horas`}
                              </span>
                            </div>
                          </div>
                          <div className='flex items-center gap-2'>
                            <Button
                              variant='ghost'
                              onClick={() => navigate('/calendar')}
                              className='flex h-9 w-9 items-center justify-center rounded-full p-0 text-purple-600 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-purple-50 hover:text-purple-700'
                            >
                              <ArrowRight className='h-5 w-5' />
                            </Button>
                            <Button
                              variant='ghost'
                              onClick={() =>
                                setRestrictionToDelete(restriction)
                              }
                              className='flex h-9 w-9 items-center justify-center rounded-full p-0 text-red-600 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-50 hover:text-red-700'
                            >
                              <Trash2 className='h-5 w-5' />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )
                  )
                )}
              </div>
            </CardContent>
            {restrictions.length > 0 && (
              <CardFooter className='flex justify-center border-t bg-gray-50 px-6 py-4'>
                <Button
                  variant='outline'
                  onClick={() => navigate('/calendar')}
                  className='flex items-center gap-2'
                >
                  <Calendar className='h-4 w-4' />
                  Ver todas no calendário
                </Button>
              </CardFooter>
            )}
          </Card>
        </TabsContent>
      </Tabs>

      <ModalCreateTasks
        isOpen={isTaskModalOpen}
        onOpenChange={setIsTaskModalOpen}
      />
      {/* Modal para criar nova restrição */}
      <ModalCreateRestrictions
        isOpen={isRestrictionModalOpen}
        onOpenChange={setIsRestrictionModalOpen}
      />

      {/* AlertDialog para deletar tarefa */}
      <ModalDeleteTasks
        taskToDelete={taskToDelete}
        setTaskToDelete={setTaskToDelete}
      />

      {/* AlertDialog para deletar restrição */}
      <ModalDeleteRestrictions
        restrictionToDelete={restrictionToDelete}
        setRestrictionToDelete={setRestrictionToDelete}
      />
    </div>
  )
}

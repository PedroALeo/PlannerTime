import { Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { CreateTask } from '@/interfaces/tasks'
import { priorityColors } from '@/pages/home'
import { useCreateTaskMutation } from '@/store/services/apiSlice'
import { useState } from 'react'
import { toast } from 'sonner'

interface ModalCreateTasksProps {
  isOpen: boolean
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>
}
export default function ModalCreateTasks({
  isOpen,
  onOpenChange,
}: ModalCreateTasksProps) {
  const [createTask] = useCreateTaskMutation()
  const email = localStorage.getItem('email')
  const [newTask, setNewTask] = useState<CreateTask>({
    nome: '',
    tempoEstimado: '',
    dataConclusao: '',
    prioridade: 0,
  })

  const handleCreateTask = async () => {
    try {
      await createTask({
        email: email || '',
        task: {
          nome: newTask.nome,
          tempoEstimado: newTask.tempoEstimado,
          dataConclusao: newTask.dataConclusao,
          prioridade: newTask.prioridade,
        },
      }).unwrap()
      toast.success(`A tarefa "${newTask.nome}" foi criada com sucesso.`)
      onOpenChange(false)
    } catch (error) {
      console.log(error)
      toast.error('Erro ao criar tarefa.')
    }
  }
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-xl'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2 text-xl'>
            <Plus className='h-5 w-5 text-blue-600' />
            Nova Tarefa
          </DialogTitle>
          <DialogDescription>
            Preencha os detalhes da tarefa abaixo.
          </DialogDescription>
        </DialogHeader>

        <div className='grid gap-4 space-y-6 py-4'>
          <div className='grid gap-2'>
            <Label htmlFor='task-name'>Nome da Tarefa</Label>
            <Input
              id='task-name'
              placeholder='Digite o nome da tarefa'
              value={newTask.nome}
              onChange={(e) => setNewTask({ ...newTask, nome: e.target.value })}
            />
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div className='grid gap-2'>
              <Label htmlFor='estimated-time'>Tempo Estimado (horas)</Label>
              <Input
                id='estimated-time'
                type='number'
                min='1'
                value={newTask.tempoEstimado}
                onChange={(e) =>
                  setNewTask({
                    ...newTask,
                    tempoEstimado: String(e.target.value),
                  })
                }
              />
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='due-date'>Data de Vencimento</Label>
              <Input
                id='due-date'
                type='date'
                value={newTask.dataConclusao}
                onChange={(e) =>
                  setNewTask({ ...newTask, dataConclusao: e.target.value })
                }
              />
            </div>
          </div>

          <div className='grid gap-2'>
            <Label>Prioridade</Label>
            <RadioGroup
              value={String(newTask.prioridade)}
              onValueChange={(value) =>
                setNewTask({ ...newTask, prioridade: Number(value) })
              }
              className='flex flex-wrap gap-2'
            >
              {priorityColors.map((priority) => (
                <div key={priority.id} className='flex items-center space-x-2'>
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
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleCreateTask} disabled={!newTask.nome}>
            Criar Tarefa
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

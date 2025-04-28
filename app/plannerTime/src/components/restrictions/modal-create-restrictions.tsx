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
import { Restriction } from '@/interfaces/restriction'
import { useCreateRestrictionMutation } from '@/store/services/apiSlice'
import { useState } from 'react'
import { toast } from 'sonner'

interface ModalCreateRestrictionsProps {
  isOpen: boolean
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>
}
const weekDays = [
  'Segunda',
  'Terça',
  'Quarta',
  'Quinta',
  'Sexta',
  'Sábado',
  'Domingo',
]
export default function ModalCreateRestrictions({
  isOpen,
  onOpenChange,
}: ModalCreateRestrictionsProps) {
  const [createRestriction] = useCreateRestrictionMutation()
  const email = localStorage.getItem('email')
  const [newRestriction, setNewRestriction] = useState<Restriction>({
    id: 0,
    name: '',
    weekDay: [],
    duration: '0',
  })

  const toggleWeekDay = (day: string) => {
    setNewRestriction((prev) => {
      if (prev.weekDay.includes(day)) {
        return { ...prev, weekDay: prev.weekDay.filter((d) => d !== day) }
      } else {
        return { ...prev, weekDay: [...prev.weekDay, day] }
      }
    })
  }
  const handleCreateRestriction = async () => {
    try {
      await createRestriction({
        email: email || '',
        data: {
          nome: newRestriction.name,
          diasDaSemana: newRestriction.weekDay,
          horarioInicio: newRestriction.duration,
          horarioFim: newRestriction.duration,
        },
      }).unwrap()
      toast.success(
        `A restrição "${newRestriction.name}" foi criada com sucesso.`
      )
      onOpenChange(false)
    } catch (error) {
      console.error('Erro ao criar restrição:', error)
      toast.error('Erro ao criar restrição. Por favor, tente novamente.')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-xl'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2 text-xl'>
            <Plus className='h-5 w-5 text-purple-600' />
            Nova Restrição
          </DialogTitle>
          <DialogDescription>
            Preencha os detalhes da restrição abaixo.
          </DialogDescription>
        </DialogHeader>

        <div className='grid gap-4 space-y-6 py-4'>
          <div className='grid gap-2'>
            <Label htmlFor='restriction-name'>Nome da Restrição</Label>
            <Input
              id='restriction-name'
              placeholder='Digite o nome da restrição'
              value={newRestriction.name}
              onChange={(e) =>
                setNewRestriction({ ...newRestriction, name: e.target.value })
              }
            />
          </div>

          <div className='grid gap-4'>
            <Label>Dias da Semana</Label>
            <div className='flex flex-wrap gap-2'>
              {weekDays.map((day) => (
                <Button
                  key={day}
                  type='button'
                  variant={
                    newRestriction.weekDay.includes(day) ? 'default' : 'outline'
                  }
                  className={`h-auto rounded-full px-3 py-1 text-xs ${
                    newRestriction.weekDay.includes(day)
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

          <div className='grid grid-cols-2 gap-4'>
            <div className='grid gap-2'>
              <Label htmlFor='estimated-time'>Tempo Estimado (horas)</Label>
              <Input
                id='estimated-time'
                type='number'
                min='1'
                value={newRestriction.duration}
                onChange={(e) =>
                  setNewRestriction({
                    ...newRestriction,
                    duration: e.target.value,
                  })
                }
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleCreateRestriction}
            disabled={
              !newRestriction.name || newRestriction.weekDay.length === 0
            }
            className='bg-blue-600 hover:bg-blue-700'
          >
            Criar Restrição
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

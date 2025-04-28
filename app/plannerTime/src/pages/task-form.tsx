import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useCreateTaskMutation } from '@/store/services/apiSlice'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'

const taskSchema = z.object({
  nome: z.string().min(1, { message: 'Nome da atividade é obrigatório' }),
  tempoEstimado: z.string().min(1, { message: 'Tempo estimado é obrigatório' }),
  dataConclusao: z
    .string()
    .min(1, { message: 'Data de conclusão é obri gatória' }),
  prioridade: z.number().min(1).max(5),
})

type TaskFormValues = z.infer<typeof taskSchema>

export default function TaskForm() {
  const navigate = useNavigate()
  const [createTask, { isLoading }] = useCreateTaskMutation()
  const [error, setError] = useState<string | null>(null)

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      nome: '',
      tempoEstimado: '',
      dataConclusao: '',
      prioridade: 3,
    },
  })

  const onSubmit = async (values: TaskFormValues) => {
    setError(null)
    const email = localStorage.getItem('email')

    if (!email) {
      setError('Usuário não encontrado')
      return
    }

    try {
      await createTask({
        email,
        task: {
          nome: values.nome,
          tempoEstimado: values.tempoEstimado,
          prioridade: values.prioridade,
          dataConclusao: values.dataConclusao,
        },
      }).unwrap()
      toast.success(`A tarefa "${values.nome}" foi criada com sucesso.`)
      navigate('/calendar')
    } catch (err: unknown) {
      setError(
        (err as { data: { message: string } }).data.message ||
          (err as { error: string }).error ||
          'Erro ao criar atividade. Tente novamente.'
      )
    }
  }

  return (
    <div className='container mx-auto p-4'>
      <Card className='mx-auto w-full max-w-4xl'>
        <CardHeader>
          <CardTitle className='flex items-center text-2xl font-bold text-gray-800'>
            <Plus className='mr-2 h-6 w-6 text-blue-600' />
            Cadastrar Atividade
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className='mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700'>
              {error}
            </div>
          )}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
              <FormField
                control={form.control}
                name='nome'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome da Atividade</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Ex: Finalizar relatório mensal'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='tempoEstimado'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tempo Estimado (horas)</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='dataConclusao'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Conclusão</FormLabel>
                    <FormControl>
                      <Input
                        type='date'
                        {...field}
                        min={
                          new Date(new Date().setDate(new Date().getDate() + 1))
                            .toISOString()
                            .split('T')[0]
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='prioridade'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ordem de Prioridade</FormLabel>
                    <FormControl>
                      <div className='flex flex-col space-y-2'>
                        <div className='flex items-center justify-between'>
                          <span className='text-xs text-gray-500'>Alta</span>
                          <span className='text-xs text-gray-500'>Baixa</span>
                        </div>
                        <Input
                          type='range'
                          min='1'
                          max='5'
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                          className='h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-blue-600'
                        />
                        <div className='flex justify-between'>
                          {[1, 2, 3, 4, 5].map((value) => (
                            <span
                              key={value}
                              className='flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-medium text-white'
                            >
                              {value}
                            </span>
                          ))}
                        </div>
                        <div className='text-center text-sm font-medium text-gray-700'>
                          Prioridade selecionada:{' '}
                          {field.value === 1
                            ? 'Muito Alta'
                            : field.value === 2
                              ? 'Alta'
                              : field.value === 3
                                ? 'Média'
                                : field.value === 4
                                  ? 'Baixa'
                                  : 'Muito Baixa'}
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type='submit'
                className='w-full uppercase'
                size='lg'
                disabled={isLoading}
                variant='success'
              >
                {isLoading ? 'Cadastrando...' : 'Cadastrar Atividade'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

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
import { useCreateRestrictionMutation } from '@/store/services/apiSlice'
import { zodResolver } from '@hookform/resolvers/zod'
import { Ban } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'

const dias = [
  'Domingo',
  'Segunda',
  'Terça',
  'Quarta',
  'Quinta',
  'Sexta',
  'Sábado',
]

const restrictionSchema = z.object({
  nome: z.string().min(2, { message: 'Nome obrigatório' }),
  diasDaSemana: z
    .array(z.string())
    .min(1, { message: 'Selecione pelo menos um dia' }),
  horarioInicio: z
    .string()
    .min(1, { message: 'Horário de início obrigatório' }),
  horarioFim: z.string().min(1, { message: 'Horário de fim obrigatório' }),
})

type RestrictionFormValues = z.infer<typeof restrictionSchema>

export default function CreateRestrictions() {
  const navigate = useNavigate()
  const [createRestriction, { isLoading }] = useCreateRestrictionMutation()
  const [error, setError] = useState<string | null>(null)

  const form = useForm<RestrictionFormValues>({
    resolver: zodResolver(restrictionSchema),
    defaultValues: {
      nome: '',
      diasDaSemana: [],
      horarioInicio: '',
      horarioFim: '',
    },
  })

  const onSubmit = async (values: RestrictionFormValues) => {
    setError(null)
    try {
      const email = localStorage.getItem('email')
      if (!email) {
        setError('Email não encontrado')
        return
      }
      await createRestriction({ email, data: values }).unwrap()
      navigate('/calendar')
    } catch (err: unknown) {
      setError(
        (err as { data: { message: string } }).data.message ||
          (err as { error: string }).error ||
          'Erro ao criar restrição. Tente novamente.'
      )
    }
  }

  return (
    <div className='container mx-auto p-4'>
      <Card className='mx-auto w-full max-w-4xl'>
        <CardHeader>
          <CardTitle className='flex items-center text-2xl font-bold text-gray-800'>
            <Ban className='mr-2 h-6 w-6 text-blue-600' />
            Cadastrar Restrição
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
                    <FormLabel>Nome da Restrição</FormLabel>
                    <FormControl>
                      <Input placeholder='Ex: Reunião semanal' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='diasDaSemana'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dias da Semana</FormLabel>
                    <FormControl>
                      <div className='grid grid-cols-2 gap-3 sm:grid-cols-4'>
                        {dias.map((dia) => (
                          <label
                            key={dia}
                            className='flex cursor-pointer items-center space-x-2'
                          >
                            <input
                              type='checkbox'
                              checked={field.value.includes(dia)}
                              onChange={() => {
                                if (field.value.includes(dia)) {
                                  field.onChange(
                                    field.value.filter((d: string) => d !== dia)
                                  )
                                } else {
                                  field.onChange([...field.value, dia])
                                }
                              }}
                              className='h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                            />
                            <span className='text-sm text-gray-700'>{dia}</span>
                          </label>
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                <FormField
                  control={form.control}
                  name='horarioInicio'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Início</FormLabel>
                      <FormControl>
                        <Input type='time' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='horarioFim'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fim</FormLabel>
                      <FormControl>
                        <Input type='time' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button
                type='submit'
                className='w-full uppercase'
                size='lg'
                disabled={isLoading}
                variant='success'
              >
                {isLoading ? 'Cadastrando...' : 'Cadastrar Restrição'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

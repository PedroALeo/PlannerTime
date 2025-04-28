import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useSignUpMutation } from '@/store/services/apiSlice'
import { zodResolver } from '@hookform/resolvers/zod'
import { UserPlus } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const signUpSchema = z
  .object({
    username: z.string().min(2, { message: 'Username obrigatório' }),
    email: z.string().email({ message: 'E-mail inválido' }),
    password: z
      .string()
      .min(8, { message: 'A senha deve ter pelo menos 8 caracteres.' }),
    confirmarSenha: z.string().min(8, { message: 'Confirme sua senha.' }),
  })
  .refine((data) => data.password === data.confirmarSenha, {
    message: 'As senhas não coincidem.',
    path: ['confirmarSenha'],
  })

type SignUpFormValues = z.infer<typeof signUpSchema>
interface SignUpProps {
  setShowLogin: React.Dispatch<React.SetStateAction<boolean>>
}
export default function SignUp({ setShowLogin }: SignUpProps) {
  const [signUp, { isLoading }] = useSignUpMutation()
  const [error, setError] = useState<string | null>(null)

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmarSenha: '',
    },
  })

  async function onSubmit(values: SignUpFormValues) {
    setError(null)
    try {
      await signUp({
        username: values.username,
        password: values.password,
        email: values.email,
      }).unwrap()
      alert(`Usuário criado! Username: ${values.username}`)
      setShowLogin(true)
    } catch (err: unknown) {
      setError(
        (err as { data: { message: string } }).data.message ||
          (err as { error: string }).error ||
          'Erro no cadastro. Tente novamente.'
      )
    }
  }

  return (
    <Card className='w-full border-none shadow-lg'>
      <CardHeader className='space-y-4 py-8'>
        <CardTitle className='text-center text-3xl font-bold'>
          Criar Conta
        </CardTitle>
        <CardDescription className='text-center text-base'>
          Preencha os dados para criar sua conta
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-6 px-8'>
        {error && (
          <div className='mb-6 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700'>
            {error}
          </div>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <FormField
              control={form.control}
              name='username'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder='Seu username' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type='email'
                      placeholder='seu.email@exemplo.com'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input
                      type='password'
                      placeholder='Mínimo 8 caracteres'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                  <p className='text-xs text-gray-500'>
                    A senha deve ter pelo menos 8 caracteres.
                  </p>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='confirmarSenha'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmar Senha</FormLabel>
                  <FormControl>
                    <Input
                      type='password'
                      placeholder='Repita sua senha'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type='submit'
              className='w-full gap-2'
              variant='success'
              size='lg'
              disabled={isLoading}
            >
              <UserPlus className='h-4 w-4' />
              {isLoading ? 'Cadastrando...' : 'Cadastrar'}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className='flex flex-col'>
        <div className='mt-2 text-center text-sm'>
          Já tem uma conta?{' '}
          <Button
            variant='link'
            className='h-auto p-0'
            onClick={() => setShowLogin(true)}
          >
            Faça login
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useLoginMutation } from '@/store/services/apiSlice'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Lock, LogIn, User } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email({ message: 'E-mail inválido' }),
  password: z.string().min(1, { message: 'Senha obrigatória' }),
  rememberMe: z.boolean(),
})

type LoginFormValues = z.infer<typeof loginSchema>

interface LoginProps {
  setShowSignUp: React.Dispatch<React.SetStateAction<boolean>>
  setShowLogin: React.Dispatch<React.SetStateAction<boolean>>
}

export default function Login({ setShowSignUp, setShowLogin }: LoginProps) {
  const [login, { isLoading }] = useLoginMutation()
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  })

  const onSubmit = async (values: LoginFormValues) => {
    setError(null)
    try {
      await login({ email: values.email, password: values.password }).unwrap()
      localStorage.setItem('email', values.email)
      localStorage.setItem('isLogged', 'true')
      if (values.rememberMe) {
        localStorage.setItem('rememberMe', 'true')
      }
      navigate('/home')
    } catch (err: unknown) {
      setError(
        (err as { data: { message: string } }).data.message ||
          (err as { error: string }).error ||
          'Erro ao fazer login. Tente novamente.'
      )
    }
  }

  return (
    <Card className='w-full border-none shadow-lg'>
      <CardHeader className='space-y-4 py-8'>
        <CardTitle className='text-center text-3xl font-bold'>
          Entrar no Planner Time
        </CardTitle>
        <CardDescription className='text-center text-base'>
          Digite suas credenciais para acessar sua conta
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
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <div className='relative'>
                    <User className='text-muted-foreground absolute top-3 left-3 h-4 w-4' />
                    <FormControl>
                      <Input
                        placeholder='seu@email.com'
                        className='pl-10'
                        {...field}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <div className='flex items-center justify-between'>
                    <FormLabel>Senha</FormLabel>
                    <Button
                      variant='link'
                      className='h-auto p-0 text-xs'
                      onClick={() => navigate('/forgot-password')}
                    >
                      Esqueceu a senha?
                    </Button>
                  </div>
                  <div className='relative'>
                    <Lock className='text-muted-foreground absolute top-3 left-3 h-4 w-4' />
                    <FormControl>
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder='••••••••'
                        className='pr-10 pl-10'
                        {...field}
                      />
                    </FormControl>
                    <Button
                      type='button'
                      variant='ghost'
                      size='icon'
                      className='absolute top-0 right-0 h-full px-3'
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className='text-muted-foreground h-4 w-4' />
                      ) : (
                        <Eye className='text-muted-foreground h-4 w-4' />
                      )}
                      <span className='sr-only'>
                        {showPassword ? 'Esconder senha' : 'Mostrar senha'}
                      </span>
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='rememberMe'
              render={({ field }) => (
                <FormItem className='flex items-center space-x-2'>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className='text-sm font-normal'>
                    Lembrar de mim
                  </FormLabel>
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
              <LogIn className='h-4 w-4' />
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className='flex flex-col'>
        <div className='mt-2 text-center text-sm'>
          Não tem uma conta?{' '}
          <Button
            variant='link'
            className='h-auto p-0'
            onClick={() => {
              setShowSignUp(true)
              setShowLogin(false)
            }}
          >
            Crie uma
          </Button>
        </div>
        <Button
          variant='ghost'
          className='mt-4'
          onClick={() => {
            setShowSignUp(false)
            setShowLogin(false)
            navigate('/')
          }}
        >
          Voltar para a página inicial
        </Button>
      </CardFooter>
    </Card>
  )
}

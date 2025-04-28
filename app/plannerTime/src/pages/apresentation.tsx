import { CalendarClock, Clock, LogIn, UserPlus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useState } from 'react'
import Login from './login'
import SignUp from './signup'

export default function Apresentation() {
  const [showLogin, setShowLogin] = useState(false)
  const [showSignUp, setShowSignUp] = useState(false)

  const activities = [
    {
      name: 'Estudar para a prova de ESOF',
      deadline: new Date().toLocaleDateString(),
    },
    { name: 'Emitir NF de Março', deadline: new Date().toLocaleDateString() },
    { name: 'Pagar contas do mês', deadline: new Date().toLocaleDateString() },
    {
      name: 'Finalizar API do freela',
      deadline: new Date().toLocaleDateString(),
    },
  ]

  return (
    <div className='flex min-h-screen w-full flex-col bg-gradient-to-b from-slate-50 to-slate-100'>
      {/* Header with Login Button */}
      <header className='flex w-full items-center justify-between bg-white p-4 shadow-sm'>
        <div className='flex items-center gap-2'>
          <CalendarClock className='text-primary h-6 w-6' />
          <h2 className='text-xl font-bold'>Planner Time</h2>
        </div>
      </header>

      {/* Main Content */}
      <main className='flex flex-1 items-center justify-center p-2'>
        <Card className='max-w-8xl mx-auto h-full w-full border-none bg-white/80 backdrop-blur-sm'>
          <div className='grid gap-8 md:grid-cols-2'>
            {/* Left Column - Image */}
            <div className='order-2 flex items-center justify-center p-6 md:order-1'>
              <div className='relative h-[450px] w-full overflow-hidden rounded-xl shadow-lg'>
                <img
                  src='/home.jpg'
                  alt='Calendar illustration'
                  className='h-full w-full object-cover'
                />
              </div>
            </div>

            {/* Right Column - Content or Login/SignUp */}
            {showLogin || showSignUp ? (
              <div className='order-2 flex items-center justify-center p-2 md:order-1'>
                {showLogin ? (
                  <Login
                    setShowSignUp={setShowSignUp}
                    setShowLogin={setShowLogin}
                  />
                ) : (
                  <SignUp setShowLogin={setShowLogin} />
                )}
              </div>
            ) : (
              <div className='order-1 flex flex-col justify-center p-6 md:order-2'>
                <div className='mb-4 flex items-center gap-2'>
                  <h1 className='text-primary text-4xl font-bold tracking-tight'>
                    Planner Time
                  </h1>
                </div>

                <p className='text-muted-foreground mb-8 text-lg'>
                  Não perca tempo e continue agora o seu planejamento de
                  atividades! Veja abaixo quais as suas tarefas que estão
                  próximas do prazo final, mais detalhes na aba Atividades.
                </p>

                <Card className='mb-8 border-none shadow-md'>
                  <CardHeader className='pb-2'>
                    <div className='flex items-center gap-2'>
                      <Clock className='text-primary h-5 w-5' />
                      <CardTitle>Atividades Próximas</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className='w-[70%] font-semibold'>
                            ATIVIDADES
                          </TableHead>
                          <TableHead className='text-right font-semibold'>
                            PRAZO
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {activities.map((activity, index) => (
                          <TableRow key={index} className='hover:bg-slate-50'>
                            <TableCell>{activity.name}</TableCell>
                            <TableCell className='text-right'>
                              {activity.deadline}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                <div className='flex gap-4'>
                  <Button
                    size='lg'
                    onClick={() => setShowSignUp(true)}
                    className='gap-2'
                    variant='outline'
                  >
                    <UserPlus className='h-5 w-5' />
                    <span className='text-sm uppercase'>Criar Conta</span>
                  </Button>
                  <Button
                    size='lg'
                    onClick={() => setShowLogin(true)}
                    className='gap-2'
                    variant='success'
                  >
                    <LogIn className='h-5 w-5' />
                    <span className='text-sm uppercase'>Entrar</span>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>
      </main>

      {/* Footer */}
      <footer className='text-muted-foreground bg-gradient-to-b from-slate-50 to-slate-100 p-4 text-center text-sm shadow-inner'>
        © {new Date().getFullYear()} Planner Time - Organize seu tempo com
        eficiência
      </footer>
    </div>
  )
}

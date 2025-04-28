import { CalendarClock, Menu } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { Avatar, AvatarFallback } from '../ui/avatar'
import { Button } from '../ui/button'

interface NavbarProps {
  toggleSidebar: () => void
}

const Navbar = ({ toggleSidebar }: NavbarProps) => {
  const userName = localStorage.getItem('email')
  const navigate = useNavigate()
  const handleLogout = () => {
    localStorage.removeItem('email')
    localStorage.removeItem('isLogged')
    navigate('/')
  }
  return (
    <header className='sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-white px-4 shadow-sm'>
      <div className='flex items-center gap-4'>
        <button
          onClick={toggleSidebar}
          className='rounded-md p-2 hover:bg-slate-100'
          aria-label='Toggle sidebar'
        >
          <Menu className='h-5 w-5' />
        </button>

        <Link to='/home' className='flex items-center gap-2'>
          <CalendarClock className='text-primary h-6 w-6' />
          <h1 className='text-xl font-bold'>Planner Time</h1>
        </Link>
      </div>

      <div className='flex items-center gap-2'>
        <div className='relative'>
          <Avatar>
            <AvatarFallback className='bg-blue-600 text-white'>
              {userName?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
        <Button onClick={handleLogout}>Sair</Button>
      </div>
    </header>
  )
}

export default Navbar

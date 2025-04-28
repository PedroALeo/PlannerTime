import {
  CalendarDays,
  ClipboardCheck,
  HomeIcon,
  OctagonMinus,
} from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

interface SidebarProps {
  isOpen: boolean
}

interface NavItem {
  path: string
  label: string
  icon: React.ReactNode
}

const Sidebar = ({ isOpen }: SidebarProps) => {
  const location = useLocation()

  const navItems: NavItem[] = [
    {
      icon: <HomeIcon />,
      label: 'Home',
      path: '/home',
    },
    {
      icon: <ClipboardCheck />,
      label: 'Atividades',
      path: '/tasks',
    },
    {
      icon: <OctagonMinus />,
      label: 'Restrições',
      path: '/restrictions',
    },
    {
      path: '/calendar',
      label: 'Calendário',
      icon: <CalendarDays className='h-5 w-5' />,
    },
  ]

  if (!isOpen) {
    return (
      <aside className='w-16 border-r bg-white'>
        <nav className='flex flex-col items-center gap-4 py-4'>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex h-10 w-10 items-center justify-center rounded-md ${
                location.pathname === item.path
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:bg-slate-100'
              }`}
              title={item.label}
            >
              {item.icon}
            </Link>
          ))}
        </nav>
      </aside>
    )
  }

  return (
    <aside className='w-64 border-r bg-white'>
      <nav className='flex flex-col py-4'>
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 ${
              location.pathname === item.path
                ? 'bg-primary/10 text-primary font-medium'
                : 'text-gray-600 hover:bg-slate-100'
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar

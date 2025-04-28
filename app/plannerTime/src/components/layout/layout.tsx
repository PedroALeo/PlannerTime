import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './navbar'
import Sidebar from './sidebar'

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <div className='flex min-h-screen flex-col bg-slate-50'>
      {/* Navbar at the top */}
      <Navbar toggleSidebar={toggleSidebar} />

      <div className='flex flex-1'>
        {/* Sidebar on the left */}
        <Sidebar isOpen={sidebarOpen} />

        {/* Main content area */}
        <main className='flex-1 overflow-auto p-2'>
          <div className='container mx-auto'>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default Layout

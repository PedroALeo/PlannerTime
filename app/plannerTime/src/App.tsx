import Layout from '@/components/layout/layout.tsx'
import CreateRestrictions from '@/pages/create-restrictions'
import Home from '@/pages/home'
import TaskForm from '@/pages/task-form'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Apresentation from './pages/apresentation'
import Events from './pages/events'
function App() {
  const publicRoutes = [
    {
      path: '/',
      index: true,
      element: <Apresentation />,
    },
  ]

  const privateRoutes = [
    {
      path: '/',
      element: <Layout />,
      children: [
        {
          path: 'home',
          element: <Home />,
        },
        {
          path: 'calendar',
          element: <Events />,
        },
        {
          path: 'tasks',
          element: <TaskForm />,
        },
        {
          path: 'restrictions',
          element: <CreateRestrictions />,
        },
      ],
    },
  ]

  const router = createBrowserRouter([...publicRoutes, ...privateRoutes])

  return <RouterProvider router={router} />
}

export default App

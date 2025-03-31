import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import LandingPage from './pages/LandingPage/LandingPage.tsx'
//import ProfilePage from './pages/Profile/ProfilePage.tsx'
import Header from './components/Header/Header.tsx'
import Login from './pages/Login/Login.tsx'
import Restrictions from './pages/Restrictions/Restrictions.tsx'
import Tasks from './pages/Task/TaskForm.tsx'
import SignUp from './pages/SignUp/SignUp.tsx'
import Calendar from './pages/Calendar/Calendar.tsx'

function App() {

        const routes = [{
          element: <Header />,
          children: [
            {path: "/lp", element: <LandingPage />},
            {path: "/login", element: <Login />},
            //{path: "/profile", element: <ProfilePage />},
            {path: "/restrictions", element: <Restrictions/>},
            {path: "/tasks", element: <Tasks/>},
            {path: "/signup", element: <SignUp/>},
            {path: "/calendar", element: <Calendar/>}
            //{path: "/articles", element: <Articles />},
            //{path: "/article", element: <Article />},
            //{path: "/newArticle", element: <NewArticle />},
            //{path: "/editArticle", element: <EditArticle />}
          ],
          },
          { path: "*", element: <Navigate to="/lp" /> }
          ];

        const router = createBrowserRouter(routes);

  return <RouterProvider router={router} />
}

export default App

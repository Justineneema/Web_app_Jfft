import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

import Home from './pages/Home.jsx'
import SignUp from './pages/SignUp.jsx'
import SignIn from './pages/SignIn.jsx'
import Typing from './pages/Typing.jsx'
import Voice from './pages/Voice.jsx'
import DashboardLayout from './layouts/DashboardLayout.jsx'
import AssignmentsTable from './pages/app/AssignmentsTable.jsx'
import AssignmentsCalendar from './pages/app/AssignmentsCalendar.jsx'
import ClassesTable from './pages/app/ClassesTable.jsx'
import StudentsTable from './pages/app/StudentsTable.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: 'signup', element: <SignUp /> },
      { path: 'signin', element: <SignIn /> },
      { path: 'typing', element: <Typing /> },
      { path: 'voice', element: <Voice /> },
    ],
  },
  {
    path: '/app',
    element: <DashboardLayout />,
    children: [
      { index: true, element: <AssignmentsTable /> },
      { path: 'assignments', element: <AssignmentsTable /> },
      { path: 'assignments/calendar', element: <AssignmentsCalendar /> },
      { path: 'classes', element: <ClassesTable /> },
      { path: 'students', element: <StudentsTable /> },
    ],
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)

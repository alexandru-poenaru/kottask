import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import TakenList from './pages/taken/TakenList';
import NotFound from './pages/NotFound';
import Agenda from './pages/agenda/Agenda';
import Layout from './pages/Layout';
import AddOrEditTaak from './pages/taken/AddOrEditTaak';
import AddOrEditAgendablok from './pages/agenda/AddOrEditAgendablok';
import { AuthProvider } from './contexts/Auth.context';
import Login from './pages/Login';
import PrivateRoute from './components/PrivateRoute';
import Logout from './pages/Logout';
import MyProfile from './pages/gebruiker/MyProfile';
import Register from './pages/Register';
import { ThemeProvider } from './contexts/Theme.context';

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <PrivateRoute />,
        children: [{
          index: true,
          element: <TakenList />,
        }],
      },
      {
        path: 'taken',
        element: <PrivateRoute />,
        children: [
          {
            index: true,
            element: <TakenList />,
          },
          {
            path: 'add',
            element: <AddOrEditTaak />,
          },
          {
            path: 'edit/:id',
            element: <AddOrEditTaak />,
          },
        ],
      },
      {
        path: 'me',
        element: <PrivateRoute />,
        children: [
          {
            index: true,
            element: <MyProfile />,
          },
          {
            path: 'taken',
            element: <TakenList />,
          },
          {
            path: 'agendablokken',
            element: <Agenda />,
          },
        ],
      },
      {
        path: 'agendablokken',
        element: <PrivateRoute />,
        children: [
          {
            index: true,
            element: <Agenda />,
          },
          {
            path: 'add',
            element: <AddOrEditAgendablok />,
          },
          {
            path: 'edit/:id',
            element: <AddOrEditAgendablok />,
          },
        ],
      },
      { path: '*', element: <NotFound /> },
      { path: 'login', element: <Login /> },
      { path: 'logout', element: <Logout /> },
      { path: 'register', element: <Register /> },
    ],
  }]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ThemeProvider>
  </StrictMode >,
);

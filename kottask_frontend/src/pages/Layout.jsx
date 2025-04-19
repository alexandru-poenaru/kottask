import { Outlet, ScrollRestoration } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useContext } from 'react';
import { ThemeContext } from '../contexts/Theme.context';

export default function Layout() {
  const { theme } = useContext(ThemeContext);
  return (
    <div className='container min-h-screen min-w-full' data-theme={theme}>
      <Navbar />
      <Outlet />
      <ScrollRestoration />
    </div>
  );
}
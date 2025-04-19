import logo from '../assets/kottask_logo.png';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/auth';
import avatar from '../assets/default_avatar.webp';
import { useContext } from 'react';
import { ThemeContext, themes } from '../contexts/Theme.context';

export default function Navbar() {
  const { isAuthed } = useAuth();
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <div className='navbar bg-base-200'>
      <div className='navbar-start'>
        <div className='flex items-center'>
          <img src={logo} alt='KotTask logo' />
          <input
            type="checkbox"
            value="synthwave"
            onChange={toggleTheme}
            checked={theme === themes.dracula}
            className="toggle theme-controller ml-2 border-sky-400 bg-amber-300 [--tglbg:theme(colors.sky.500)] checked:border-blue-800 checked:bg-blue-300 checked:[--tglbg:theme(colors.blue.900)]" />
        </div>
      </div>
      <div className='navbar-center hidden lg:flex'>
        <ul className='menu menu-horizontal px-1'>
          <div className='dropdown dropdown-end'>
            <div tabIndex={0} role='button' className='btn btn-ghost'>
              Taken
            </div>
            <ul className='menu menu-sm dropdown-content bg-base-100 rounded-box mt-3 w-52 p-2 shadow z-50'>
              <li><Link className='nav-link' to='/me/taken'>Mijn taken</Link></li>
              <li><Link className='nav-link' to='/taken'>Taken</Link></li>
            </ul>
          </div>
        </ul>
        <ul className='menu menu-horizontal px-1'>
          <div className='dropdown dropdown-end'>
            <div tabIndex={0} className='btn btn-ghost'>
              Agenda&apos;s
            </div>
            <ul className='menu menu-sm dropdown-content bg-base-100 rounded-box mt-3 w-52 p-2 shadow z-50'>
              <li><Link className='nav-link' to='/me/agendablokken'>Mijn agenda</Link></li>
              <li><Link className='nav-link' to='/agendablokken'>Algemene agenda</Link></li>
            </ul>
          </div>
        </ul>
      </div>
      <div className='navbar-end'>
        <div className='dropdown dropdown-end'>
          <div tabIndex={0} className='btn btn-ghost btn-circle avatar'>
            <div className='w-10 rounded-full' data-cy='navbar_dropdown'>
              <img
                alt='avatar'
                src={avatar} />
            </div>
          </div>
          <ul
            className='menu menu-sm dropdown-content bg-base-100 rounded-box mt-3 w-52 p-2 shadow z-50'>
            {isAuthed ? (
              <>
                <li className='lg:hidden'><Link className='nav-link' to='/me/taken'>Mijn taken</Link></li>
                <li className='lg:hidden'><Link className='nav-link' to='/taken'>Taken</Link></li>
                <li className='lg:hidden'><Link className='nav-link' to='/me/agendablokken'>Mijn agenda</Link></li>
                <li className='lg:hidden'><Link className='nav-link' to='/agendablokken'>Algemene agenda</Link></li>
                <li><Link className='nav-link' to='/me'>Mijn profiel</Link></li>
                <li><Link className='nav-link' to='/logout' data-cy='logout_btn'>Log uit</Link></li>
              </>
            ) : (
              <li><Link className='nav-link' to='/login'>Log in</Link></li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

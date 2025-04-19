import { useEffect } from 'react';
import { useAuth } from '../contexts/auth';

export default function Logout() {
  const { isAuthed, logout } = useAuth();

  useEffect(() => {
    logout();
  }, [logout]);

  if (isAuthed) {
    return (
      <div className='container'>
        <div className='row'>
          <div className='col-12'>
            <h1>Aan het uitloggen...</h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='flex items-center justify-center min-h-screen'>
      <div className='text-center'>
        <h1 className='text-2xl font-bold'>Je werd succesvol uitgelogd!</h1>
      </div>
    </div>
  );
}
